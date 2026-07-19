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
  `const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const publicDir = path.resolve(__dirname, "..");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8"
};

function handler(request, response) {
  const url = new URL(request.url, "http://localhost");
  const requestedPath = decodeURIComponent(url.pathname);
  const assetPath = requestedPath === "/" ? "/index.html" : requestedPath;
  const filePath = path.normalize(path.join(publicDir, assetPath));

  if (!filePath.startsWith(publicDir)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(publicDir, "index.html"), (fallbackError, fallbackData) => {
        if (fallbackError) {
          response.writeHead(404);
          response.end("Not found");
          return;
        }
        response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        response.end(fallbackData);
      });
      return;
    }

    response.writeHead(200, { "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream" });
    response.end(data);
  });
}

const server = http.createServer(handler);
const port = Number(process.env.PORT || 3000);
server.listen(port, "0.0.0.0", () => {
  console.log("VibeCampus listening on port " + port);
});
`
);

console.log("Built static VibeCampus site into dist/");
