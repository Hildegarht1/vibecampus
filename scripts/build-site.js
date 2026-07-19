const fs = require("node:fs");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
const distDir = path.join(rootDir, "dist");
const serverDir = path.join(distDir, "server");
const openAiDir = path.join(distDir, ".openai");
const files = ["index.html", "styles.css", "app.js"];

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(openAiDir, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(rootDir, file), path.join(distDir, file));
}

fs.copyFileSync(path.join(rootDir, ".openai", "hosting.json"), path.join(openAiDir, "hosting.json"));

fs.writeFileSync(
  path.join(serverDir, "index.js"),
  `export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    const url = new URL(request.url);
    url.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(url, request));
  }
};
`
);

console.log("Built static VibeCampus site into dist/");
