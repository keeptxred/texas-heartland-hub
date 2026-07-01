const PRINTIFY_API = "https://api.printify.com/v1";

export async function getPrintifyHeaders() {
  return {
    Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
    "Content-Type": "application/json",
  };
}

// Get all shops (use this once to find SHOP_ID)
export async function getShops() {
  const res = await fetch(`${PRINTIFY_API}/shops.json`, {
    headers: await getPrintifyHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Printify shops");
  }
  return res.json();
}

// Get products from a specific shop
export async function getShopProducts(shopId: string) {
  const res = await fetch(`${PRINTIFY_API}/shops/${shopId}/products.json`, {
    headers: await getPrintifyHeaders(),
  });
  if (!res.ok) {
    throw new Error("Failed to fetch Printify products");
  }
  return res.json();
}