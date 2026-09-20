import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const site = "https://keeptxred.com";
const cartKey = "keeptxred:cart-items:v1";
const productsPath = process.env.SMOKE_PRODUCTS_JSON || "/tmp/smoke-products.json";
const products = JSON.parse(fs.readFileSync(productsPath, "utf8"));
const screenshotDir = process.env.SMOKE_SCREENSHOT_DIR || "/tmp/checkout-smoke";
fs.mkdirSync(screenshotDir, { recursive: true });

const testAddress = {
  email: "checkout-smoke@keeptxred.com",
  phone: "5125550100",
  name: "Checkout Smoke Test",
  line1: "1100 Congress Ave",
  city: "Austin",
  state: "TX",
  postalCode: "78701",
};

function cartItem(product) {
  return {
    key: `${product.productId}::${product.variantId}::_::_`,
    productId: product.productId,
    title: product.title,
    image: product.image || "",
    price: product.price,
    currency: product.currency || "USD",
    color: null,
    size: null,
    qty: 1,
    url: product.link,
    variantId: Number(product.variantId),
    variantTitle: null,
  };
}

async function visibleFirst(frame, selectors) {
  for (const selector of selectors) {
    const locator = frame.locator(selector);
    const count = await locator.count().catch(() => 0);
    for (let i = 0; i < count; i += 1) {
      const candidate = locator.nth(i);
      if (await candidate.isVisible().catch(() => false)) return candidate;
    }
  }
  return null;
}

async function fillIfPresent(frame, selectors, value, label) {
  const locator = await visibleFirst(frame, selectors);
  if (!locator) {
    console.log(`Field not found yet: ${label}`);
    return false;
  }
  await locator.fill(value);
  console.log(`Filled: ${label}`);
  return true;
}

async function dumpInputs(frame, tag) {
  const inputs = await frame.locator("input, select").evaluateAll((els) =>
    els.map((el) => ({
      tag: el.tagName,
      type: el.getAttribute("type"),
      name: el.getAttribute("name"),
      autocomplete: el.getAttribute("autocomplete"),
      placeholder: el.getAttribute("placeholder"),
      ariaLabel: el.getAttribute("aria-label"),
    })),
  ).catch(() => []);
  console.log(`${tag} input descriptors: ${JSON.stringify(inputs)}`);
}

async function findStripeFrame(page) {
  await page.waitForTimeout(4000);
  for (let attempt = 0; attempt < 30; attempt += 1) {
    const frames = page.frames();
    const candidate = frames.find((frame) =>
      frame !== page.mainFrame() && /stripe\.com/i.test(frame.url()),
    );
    if (candidate) return candidate;
    await page.waitForTimeout(1000);
  }
  throw new Error(`Stripe checkout frame did not load. Frames: ${page.frames().map((f) => f.url()).join(", ")}`);
}

async function fillShipping(page, label) {
  await page.getByRole("heading", { name: /shipping information/i })
    .waitFor({ state: "visible", timeout: 30000 });

  await dumpInputs(page, `${label}-shipping-form`);

  await page.getByLabel(/^Email$/i).fill(testAddress.email);
  console.log("Filled: email");
  await page.getByLabel(/^Phone/i).fill(testAddress.phone);
  console.log("Filled: phone");
  await page.getByLabel(/^Full name$/i).fill(testAddress.name);
  console.log("Filled: full name");
  await page.getByLabel(/^Street address$/i).fill(testAddress.line1);
  console.log("Filled: address line 1");
  await page.getByLabel(/^City$/i).fill(testAddress.city);
  console.log("Filled: city");
  await page.getByLabel(/^State$/i).fill(testAddress.state);
  console.log("Filled: state");
  await page.getByLabel(/^ZIP code$/i).fill(testAddress.postalCode);
  console.log("Filled: ZIP");

  await page
    .getByRole("button", { name: /continue to secure payment/i })
    .click();

  await page
    .getByRole("button", { name: /pay \$/i })
    .waitFor({ state: "visible", timeout: 90000 });
}

async function runCase(browser, product, expectedFree, label) {
  const context = await browser.newContext();
  const page = await context.newPage();
  page.on("console", (msg) => console.log(`[browser:${label}] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", (err) => console.log(`[browser:${label}] pageerror: ${err.message}`));

  try {
    await page.goto(site, { waitUntil: "domcontentloaded", timeout: 90000 });
    const item = cartItem(product);
    await page.evaluate(
      ({ key, value }) => window.localStorage.setItem(key, JSON.stringify([value])),
      { key: cartKey, value: item },
    );

    await page.goto(`${site}/shop/checkout`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await fillShipping(page, label);
    const frame = await findStripeFrame(page);
    console.log(`${label} Stripe payment frame: ${frame.url()}`);

    const bodyText = await page.locator("body").innerText();
    console.log(`${label} checkout text:\n${bodyText.slice(0, 12000)}`);
    const screenshot = path.join(screenshotDir, `${label}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });

    if (expectedFree) {
      if (!/Free standard shipping/i.test(bodyText)) {
        throw new Error(`${label}: expected free standard shipping but the final Stripe checkout did not show it.`);
      }
    } else {
      if (!/Printify standard shipping/i.test(bodyText)) {
        throw new Error(`${label}: expected the live Printify standard shipping option but it was not shown.`);
      }
      const shippingLine = bodyText
        .split("\n")
        .find((line) => /Printify standard shipping/i.test(line));
      console.log(`${label} final paid shipping line: ${shippingLine || "label present"}`);
    }

    console.log(`${label} PASS: ${product.title} @ $${product.price.toFixed(2)}`);
  } finally {
    await context.close();
  }
}

const browser = await chromium.launch({ headless: true });
try {
  await runCase(browser, products.under, false, "under-35");
  await runCase(browser, products.over, true, "over-35");
} finally {
  await browser.close();
}
