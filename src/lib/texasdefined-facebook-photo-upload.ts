/**
 * The Graph Page Photos API accepts a multipart image file. Facebook's remote
 * "url" fetch may reject valid article OG image proxies; fetch exactly once on
 * our server, validate it, then supply the bytes as the "source" part.
 *
 * Never convert a failed image into a text-only Facebook post.
 */
export const MAX_TEXASDEFINED_FACEBOOK_PHOTO_BYTES = 9 * 1024 * 1024;

export type TexasDefinedFacebookPhoto = {
  blob: Blob;
  filename: string;
  mimeType: "image/jpeg" | "image/png" | "image/gif";
  size: number;
};

function jpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

function png(bytes: Uint8Array): boolean {
  return bytes.length >= 8 &&
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
    bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
}

function gif(bytes: Uint8Array): boolean {
  if (bytes.length < 6) return false;
  const header = String.fromCharCode(...bytes.slice(0, 6));
  return header === "GIF87a" || header === "GIF89a";
}

function mimeTypeOf(bytes: Uint8Array): TexasDefinedFacebookPhoto["mimeType"] | null {
  if (jpeg(bytes)) return "image/jpeg";
  if (png(bytes)) return "image/png";
  if (gif(bytes)) return "image/gif";
  return null;
}

export async function loadTexasDefinedFacebookPhoto(
  imageUrl: string,
  fetchImage: typeof fetch = fetch,
): Promise<TexasDefinedFacebookPhoto | null> {
  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" || url.username || url.password) return null;

  try {
    const response = await fetchImage(url.toString(), {
      redirect: "follow",
      headers: {
        Accept: "image/jpeg,image/png,image/gif;q=0.9,*/*;q=0.1",
        "User-Agent": "TexasDefined-Facebook-Publisher/1.2",
      },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok || !response.body) {
      await response.body?.cancel().catch(() => undefined);
      return null;
    }

    const expectedMime = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
    // WebP, AVIF, SVG and HTML are not permitted for Meta Page Photos.
    if (expectedMime !== "image/jpeg" && expectedMime !== "image/png" && expectedMime !== "image/gif") {
      await response.body.cancel().catch(() => undefined);
      return null;
    }

    const declaredBytes = Number(response.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredBytes) && declaredBytes > MAX_TEXASDEFINED_FACEBOOK_PHOTO_BYTES) {
      await response.body.cancel().catch(() => undefined);
      return null;
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_TEXASDEFINED_FACEBOOK_PHOTO_BYTES) {
        await reader.cancel().catch(() => undefined);
        return null;
      }
      chunks.push(value);
    }
    if (total < 256) return null;

    const bytes = new Uint8Array(total);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const detectedMime = mimeTypeOf(bytes);
    if (!detectedMime || detectedMime !== expectedMime) return null;
    const extension = detectedMime === "image/jpeg" ? "jpg" : detectedMime === "image/png" ? "png" : "gif";
    return {
      blob: new Blob([bytes.buffer as ArrayBuffer], { type: detectedMime }),
      filename: `texasdefined-facebook-article.${extension}`,
      mimeType: detectedMime,
      size: total,
    };
  } catch {
    // A bad source image is not grounds to bypass the photo requirement.
    return null;
  }
}

export function createTexasDefinedFacebookPhotoPayload(
  photo: TexasDefinedFacebookPhoto,
  caption: string,
  pageToken: string,
): FormData {
  const form = new FormData();
  form.set("source", photo.blob, photo.filename);
  form.set("caption", caption);
  form.set("access_token", pageToken);
  return form;
}
