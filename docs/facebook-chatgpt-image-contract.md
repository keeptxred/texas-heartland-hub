# ChatGPT Facebook attention-image handoff

Keep TX Red attention/question posts are not allowed to publish text-only or with a generic fallback image.

When an attention slot is due, `/api/public/hooks/auto-facebook-post-smart` returns `requires_chatgpt_image: true` plus the exact selected `title`, `message`, and `image_prompt` unless a matching ChatGPT-generated image is supplied in the same authenticated request.

The expected image prompt begins with:

`Generate an image for this Facebook post.`

followed by the exact Facebook post text and editorial-quality guidance.

To publish the attention post, the authenticated caller supplies JSON fields:

- `title`: exact selected title
- `message`: exact selected message
- `image_base64`: raster image bytes encoded as base64
- `content_type`: `image/jpeg`, `image/png`, or `image/webp`

The server re-resolves the currently selected post and rejects mismatched title/message payloads. It rejects missing, invalid, implausibly small, oversized, SVG, or unsupported image payloads. Valid bytes are stored in `article-images` and those exact bytes are uploaded to Facebook. There is no generic `/og/default.jpg` fallback and no site-side image generator for this path.
