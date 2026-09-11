// Browser regression check. Uses a fresh context and completes only the local demo order.
// PLAYWRIGHT_MODULE may point to an existing bundled Playwright installation; no install is needed.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const baseURL = process.env.CHECKOUT_BASE_URL || "http://localhost:5173";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(baseURL).hostname), "Run only against the local demo");
const output = process.env.CHECKOUT_REPORT_DIR || path.join(tmpdir(), `capsule-checkout-motion-${Date.now()}`);
await mkdir(output, { recursive: true });
const sourceHash = async () => createHash("sha256").update(await readFile(new URL("../src/components/Checkout/checkout.tsx", import.meta.url))).digest("hex");

function installRecorder() {
  const ids = new WeakMap();
  let nextId = 0;
  let active = null;
  const id = element => {
    if (!element) return null;
    if (!ids.has(element)) ids.set(element, ++nextId);
    return ids.get(element);
  };
  const opacity = element => element ? Number(getComputedStyle(element).opacity) : null;
  const visibleOpacity = element => {
    let value = 1;
    for (let node = element; node; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden") return 0;
      value *= Number(style.opacity);
    }
    return element ? value : 0;
  };
  const sample = kind => {
    if (!active) return;
    const modal = document.querySelector(".checkout-card");
    const content = modal?.querySelector(".checkout-content");
    const step = modal?.querySelector(".checkout-step");
    const heading = modal?.querySelector("#checkout-title");
    active.samples.push({
      t: Math.round((performance.now() - active.start) * 100) / 100, kind,
      modal: id(modal), state: modal?.getAttribute("data-state") || null,
      modalOpacity: opacity(modal), sheetOpacity: opacity(modal?.querySelector(".checkout-container")),
      contentOpacity: opacity(content), stepOpacity: opacity(step), titleOpacity: visibleOpacity(heading),
      title: heading?.textContent?.trim() || null,
      form: Boolean(modal?.querySelector(".checkout-form")),
      busy: modal?.querySelector(".checkout-form")?.getAttribute("aria-busy") || null,
    });
  };
  new MutationObserver(records => {
    if (!active) return;
    for (const record of records) {
      if (record.type === "attributes" && record.attributeName === "data-state" && record.target.matches(".checkout-card")) {
        active.states.push({ old: record.oldValue, next: record.target.getAttribute("data-state"), t: performance.now() - active.start });
      }
    }
    sample("mutation");
  }).observe(document, { subtree: true, childList: true, attributes: true, attributeOldValue: true, attributeFilter: ["data-state", "aria-busy", "class", "style"] });
  const tick = () => { sample("raf"); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  window.checkoutMotion = {
    start(label) { active = { label, start: performance.now(), samples: [], states: [] }; sample("start"); },
    stop() { sample("stop"); const result = active; active = null; return result; },
  };
}

const browser = await chromium.launch({ headless: true });
const results = [];
const settings = [
    { name: "desktop", width: 1366, height: 900, reduced: false },
    { name: "mobile", width: 390, height: 844, reduced: false },
    { name: "mobile-reduced", width: 320, height: 640, reduced: true },
  ].filter(setting => !process.env.CHECKOUT_CASE || process.env.CHECKOUT_CASE.split(",").includes(setting.name));
assert.ok(settings.length, "CHECKOUT_CASE must select desktop, mobile or mobile-reduced");

try {
  for (const setting of settings) {
    const context = await browser.newContext({ viewport: { width: setting.width, height: setting.height }, reducedMotion: setting.reduced ? "reduce" : "no-preference" });
    const page = await context.newPage();
    const result = { ...setting, sourceStart: await sourceHash(), traces: [], failures: [], errors: [] };
    results.push(result);
    page.on("pageerror", error => result.errors.push(error.message));
    page.on("console", message => { if (message.type() === "error") result.errors.push(message.text()); });
    await page.addInitScript(installRecorder);
    const check = (condition, message) => { if (!condition) result.failures.push(message); };
    const record = async (label, action, settle = 450) => {
      await page.evaluate(label => window.checkoutMotion.start(label), label);
      await action();
      await page.waitForTimeout(settle);
      const trace = await page.evaluate(() => window.checkoutMotion.stop());
      result.traces.push(trace);
      if (["shipping", "back", "complete"].includes(label)) {
        const outgoingTitle = trace.samples.find(sample => sample.title)?.title;
        let faded = false;
        let wasVisible = false;
        for (const sample of trace.samples.filter(sample => sample.title === outgoingTitle)) {
          if (sample.titleOpacity > .8) wasVisible = true;
          if (wasVisible && sample.titleOpacity < .35) faded = true;
          check(!faded || sample.titleOpacity <= .8, `${label}: outgoing content became visible after fading`);
        }
      }
      return trace;
    };
    const open = async (label = "open") => {
      const trace = await record(label, () => page.getByRole("button", { name: "Review order", exact: true }).click());
      check(!trace.states.some(state => state.old === "open" && state.next === "opening"), `${label}: open -> opening regression`);
      const first = trace.samples.find(sample => sample.modal);
      check(first?.state !== "open" || first.modalOpacity < .1, `${label}: first mounted frame is already opaque/open`);
      let maximumOpacity = 0;
      for (const sample of trace.samples.filter(sample => sample.kind === "raf" && sample.modal)) {
        const value = sample.modalOpacity * sample.sheetOpacity;
        check(value >= maximumOpacity - .03, `${label}: opacity reversed during entry`);
        maximumOpacity = Math.max(maximumOpacity, value);
      }
      await page.getByRole("heading", { name: "Order summary", exact: true }).waitFor();
      return trace;
    };
    const shipping = () => record("shipping", () => page.getByRole("button", { name: "Shipping details", exact: true }).click());
    const fill = async () => {
      for (const [label, value] of [["First name", "Motion"], ["Last name", "Review"], ["Address", "1 Demo Street"], ["Email", "motion@example.test"], ["Phone number", "123456789"]]) {
        await page.getByLabel(label, { exact: true }).fill(value);
      }
    };
    try {
      await page.goto(`${baseURL}/product-page/1`);
      await page.getByLabel("Your name", { exact: true }).fill("Motion review");
      await page.getByRole("button", { name: "Log in", exact: true }).click();
      await page.getByRole("button", { name: "Add Future Jacket to bag", exact: true }).click();
      await page.goto(`${baseURL}/shopping-bag`);
      await open();
      if (setting.reduced) {
        const durations = await page.locator(".checkout-step").evaluate(element => ({ animation: getComputedStyle(element).animationDuration, transition: getComputedStyle(element).transitionDuration }));
        check(Object.values(durations).every(value => value.split(",").every(duration => parseFloat(duration) <= .001)), "reduced motion: step animation or transition remains enabled");
      }
      await page.screenshot({ path: path.join(output, `${setting.name}-summary.png`) });
      await shipping();
      await record("back", () => page.getByRole("button", { name: "Back", exact: true }).click());

      if (!setting.reduced) {
        await page.evaluate(() => window.checkoutMotion.start("close-mid-step-reopen-early"));
        await page.getByRole("button", { name: "Shipping details", exact: true }).click();
        await page.keyboard.press("Escape");
        // Trigger before the closing overlay is removed; coordinate clicks still hit that overlay.
        await page.getByRole("button", { name: "Review order", exact: true }).evaluate(button => button.click());
        await page.waitForTimeout(460);
        result.traces.push(await page.evaluate(() => window.checkoutMotion.stop()));
        check(await page.getByRole("heading", { name: "Order summary", exact: true }).count() === 1, "early reopen: summary is unavailable");
        await shipping();
        await fill();
        await page.evaluate(() => window.checkoutMotion.start("close-mid-submit"));
        await page.getByRole("button", { name: "Complete order", exact: true }).click();
        await page.waitForFunction(() => document.querySelector(".checkout-form")?.getAttribute("aria-busy") === "true");
        await page.keyboard.press("Escape");
        await page.waitForTimeout(460);
        const cancelled = await page.evaluate(() => window.checkoutMotion.stop());
        result.traces.push(cancelled);
        check(!cancelled.samples.some(sample => sample.title === "Thank you for your order"), "close-mid-submit: completion ran after closing");
        check(await page.getByRole("button", { name: "Review order", exact: true }).count() === 1, "close-mid-submit: bag was cleared");
        check(await page.locator(".checkout-card").count() === 0, "close-mid-submit: dialog remains mounted");
        await open("reopen-after-mid-submit");
      }

      await shipping();
      await fill();
      await record("complete", async () => {
        await page.getByRole("button", { name: "Complete order", exact: true }).click();
        await page.getByRole("heading", { name: "Thank you for your order", exact: true }).waitFor();
      });
      check(await page.getByRole("heading", { name: "Your bag is empty", exact: true }).count() === 1, "complete: demo bag did not clear");
      await page.screenshot({ path: path.join(output, `${setting.name}-complete.png`) });
      const closeViaX = process.env.CHECKOUT_EXIT === "close";
      const exit = await record(closeViaX ? "close-confirmation" : "continue", async () => {
        await page.getByRole("button", { name: closeViaX ? "Close checkout" : "Continue shopping", exact: true }).click();
        if (!closeViaX) await page.waitForURL("**/homepage");
      });
      if (closeViaX) check(await page.evaluate(() => document.activeElement?.matches(".shopping-heading h1")), "close confirmation: focus did not return to the empty bag heading");
      check(!exit.samples.some(sample => sample.modal && (sample.form || sample.title === "Order summary")), "continue: previous form or summary reappeared during exit");
      check(await page.locator(".checkout-card").count() === 0, "continue: dialog remains mounted");
      check(await page.evaluate(() => document.body.style.overflow !== "hidden"), "continue: body remains scroll-locked");
      check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), "horizontal viewport overflow");
      check(result.errors.length === 0, `Browser errors: ${result.errors.join("; ")}`);
    } catch (error) {
      result.failures.push(error.message);
      await page.screenshot({ path: path.join(output, `${setting.name}-failure.png`) }).catch(() => {});
    } finally {
      result.sourceEnd = await sourceHash();
      check(result.sourceStart === result.sourceEnd, "Checkout source changed during the run; repeat after edits settle");
      result.failures = [...new Set(result.failures)];
      await writeFile(path.join(output, `${setting.name}.json`), JSON.stringify(result, null, 2));
      await context.close();
      console.log(JSON.stringify({ case: setting.name, failures: result.failures, errors: result.errors, samples: result.traces.reduce((sum, trace) => sum + trace.samples.length, 0) }));
    }
  }
} finally {
  await browser.close();
  await writeFile(path.join(output, "report.json"), JSON.stringify(results, null, 2));
}
console.log(`Checkout motion evidence: ${output}`);
if (results.some(result => result.failures.length)) process.exitCode = 1;
