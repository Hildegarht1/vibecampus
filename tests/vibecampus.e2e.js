const assert = require("node:assert/strict");
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

function loadPlaywright() {
  try {
    return require("playwright");
  } catch (error) {
    const localRuntime = path.join(
      process.env.USERPROFILE || "",
      ".cache",
      "codex-runtimes",
      "codex-primary-runtime",
      "dependencies",
      "node",
      "node_modules",
      "playwright"
    );

    if (fs.existsSync(localRuntime)) {
      return require(localRuntime);
    }

    throw error;
  }
}

const { chromium } = loadPlaywright();
const rootDir = path.resolve(__dirname, "..");
const browserPaths = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".json": "application/json"
};

function startStaticServer() {
  const server = http.createServer((request, response) => {
    const requestedPath = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
    const safePath = requestedPath === "/" ? "/index.html" : requestedPath;
    const filePath = path.normalize(path.join(rootDir, safePath));

    if (!filePath.startsWith(rootDir)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }

    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }

      response.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream"
      });
      response.end(data);
    });
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

let browser;
let baseUrl;
async function runTest(name, callback) {
  const context = await browser.newContext();
  await context.tracing.start({ screenshots: true, snapshots: true });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  try {
    await openApp(page, baseUrl);
    await callback(page);
    assert.deepEqual(errors, [], "No uncaught browser errors");
    console.log(`PASS ${name}`);
  } catch (error) {
    const directory = path.join(rootDir, "test-results", name.replace(/[^a-z0-9]+/gi, "-"));
    fs.mkdirSync(directory, { recursive: true });
    await page.screenshot({ path: path.join(directory, "failure.png"), fullPage: true }).catch(() => {});
    fs.writeFileSync(path.join(directory, "error.txt"), String(error.stack || error));
    await context.tracing.stop({ path: path.join(directory, "trace.zip") });
    console.error(`FAIL ${name}`);
    console.error(error);
    process.exitCode = 1;
  } finally {
    await context.close();
  }
}

async function main() {
  const started = await startStaticServer();
  const { server } = started;
  baseUrl = started.baseUrl;
  const executablePath = browserPaths.find((candidate) => fs.existsSync(candidate));
  browser = await chromium.launch({
    headless: true,
    ...(executablePath ? { executablePath } : {})
  });

  try {
    await runTest("generates a vibe report from a student response", async (page) => {
      await openApp(page, baseUrl);
      await page.getByRole("heading", { name: "Vote. Rant. Laugh. Decide.", exact: true }).waitFor();

      await page.fill("#newResponse", "Friday is fun, but the food queue was too long and the ticket price felt expensive.");
      await page.click("#addResponse");
      await page.click("#runVibeCheck");

      await page.waitForFunction(() => document.querySelector("#vibeScore")?.textContent.includes("%"));

      const score = await page.textContent("#vibeScore");
      const summary = await page.inputValue("#shareSummary");
      const actions = await page.locator(".action-card").count();

      assert.match(score, /\d+%/);
      assert.equal(actions, 4);
      assert.match(summary, /VibeCampus report/);
      assert.match(summary, /Next moves:/);
    });

    await runTest("builds an automation payload and simulates routing", async (page) => {
      await page.click('a[href="#automation"]');
      const payloadText = await page.textContent("#automationPayload");
      const payload = JSON.parse(payloadText);

      assert.equal(payload.event, "vibecampus.vibe_report.generated");
      assert.equal(payload.source, "VibeCampus dashboard");
      assert.ok(payload.votes.counts["Friday evening"] >= 1);
      assert.match(payload.session.code, /^VC-/);
      assert.match(payload.session.share_link, /session=VC-/);
      assert.ok(payload.participants.named_count >= 1);
      assert.ok(Array.isArray(payload.responses));
      assert.ok(payload.ai_analysis.vibe_score >= 0);
      assert.ok(["normal", "medium", "high"].includes(payload.routing.priority));
      assert.ok(Array.isArray(payload.next_actions));
      assert.ok(payload.automation_outputs.google_sheets_row.log_id.startsWith("VCLOG-"));
      assert.ok(Array.isArray(payload.automation_outputs.task_queue));
      assert.ok(payload.automation_outputs.task_queue[0].task_id.includes(payload.session.code));
      assert.match(payload.automation_outputs.group_recap.short_caption, /Ready to post|Organizer review needed/);

      await page.click("#sendAutomation");
      await assertVisibleText(page, "Simulated automation run");
    });

    await runTest("adds a named student response and keeps identity in the payload", async (page) => {
      await openApp(page, baseUrl);

      await page.click("#newSessionCode");
      const sessionCode = await page.textContent("#sessionCode");
      await page.fill("#studentName", "Hilda");
      await page.locator("#studentVoteOptions [data-vote='Saturday afternoon']").click();
      await page.fill("#newResponse", "Saturday works better for my study group, but please keep the room near campus.");
      await page.click("#addResponse");

      await page.locator("#responseList").getByText("Hilda", { exact: false }).waitFor({ state: "visible" });
      await page.click('a[href="#automation"]');
      const payload = JSON.parse(await page.textContent("#automationPayload"));

      assert.equal(payload.session.code, sessionCode);
      assert.ok(payload.participants.submitters.includes("Hilda"));
      assert.equal(payload.responses[0].author, "Hilda");
      assert.equal(payload.responses[0].anonymous, false);
      assert.equal(payload.responses[0].vote, "Saturday afternoon");
      assert.ok(payload.votes.counts["Saturday afternoon"] >= 1);
    });

    await runTest("generates a meme caption from a complaint", async (page) => {
      const before = await page.textContent("#memeCaption");
      await page.fill("#memeInput", "The WiFi disappeared during my group presentation.");
      await page.click("#generateMeme");
      const after = await page.textContent("#memeCaption");

      assert.notEqual(after, before);
      assert.match(after, /WiFi|POV|campus|deadline|chat|character/i);
    });
    await runTest("posts the expected JSON to a controlled webhook", async (page) => {
      let request;
      await page.route("https://webhook.test/intake", async route => {
        request = route.request();
        await route.fulfill({ status: 200, body: "Accepted" });
      });
      await page.fill("#webhookUrl", "https://webhook.test/intake");
      await page.click("#sendAutomation");
      await page.locator("#automationStatus").filter({ hasText: "Dispatch attempted" }).waitFor();
      assert.equal(request.method(), "POST");
      const payload = request.postDataJSON();
      assert.equal(payload.event, "vibecampus.vibe_report.generated");
      assert.ok(Array.isArray(payload.next_actions));
      assert.ok(payload.session.code.startsWith("VC-"));
    });
    await runTest("shows a recoverable webhook network failure", async (page) => {
      await page.route("https://webhook.test/intake", route => route.abort("failed"));
      await page.fill("#webhookUrl", "https://webhook.test/intake");
      await page.click("#sendAutomation");
      await page.locator("#automationStatus").filter({ hasText: "Webhook handoff failed" }).waitFor();
      const payload = JSON.parse(await page.textContent("#automationPayload"));
      assert.equal(payload.event, "vibecampus.vibe_report.generated");
    });
    await runTest("allows a vote without a comment", async (page) => {
      await page.locator("#studentVoteOptions [data-vote='Saturday afternoon']").click();
      await page.fill("#newResponse", "   ");
      await page.click("#addResponse");
      const payload = JSON.parse(await page.textContent("#automationPayload"));
      assert.equal(payload.responses[0].text, "Voted for Saturday afternoon.");
    });
  } finally {
    await browser.close();
    server.close();
  }
}

async function assertVisibleText(page, text) {
  const locator = page.getByText(text, { exact: false });
  await locator.waitFor({ state: "visible", timeout: 5000 });
}

async function openApp(page, baseUrl) {
  try {
    await page.goto(baseUrl, { waitUntil: "commit", timeout: 10000 });
  } catch (error) {
    if (!String(error.message).includes("Timeout")) throw error;
  }

  await page.getByRole("heading", { name: "Vote. Rant. Laugh. Decide." }).waitFor({
    state: "visible",
    timeout: 10000
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
