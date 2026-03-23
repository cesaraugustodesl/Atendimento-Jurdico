import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, "..");
const distDir = path.join(rootDir, "dist");
const ssrEntryPath = path.join(rootDir, "dist-server", "entry-server.js");

const templatePath = path.join(distDir, "index.html");
const template = await readFile(templatePath, "utf8");
const serverModule = await import(pathToFileURL(ssrEntryPath).href);

const entries = serverModule.getPrerenderEntries();
const notFoundEntry = serverModule.getNotFoundEntry();

for (const entry of entries) {
  const html = injectRouteHtml(template, entry.head, entry.appHtml);
  const outputPath = getOutputPath(entry.path);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

await writeFile(
  path.join(distDir, "404.html"),
  injectRouteHtml(template, notFoundEntry.head, notFoundEntry.appHtml),
  "utf8"
);

await writeFile(path.join(distDir, "sitemap.xml"), buildSitemap(entries), "utf8");
await writeFile(path.join(distDir, "robots.txt"), buildRobots(entries), "utf8");

function getOutputPath(routePath) {
  if (routePath === "/") {
    return path.join(distDir, "index.html");
  }

  return path.join(distDir, routePath.slice(1), "index.html");
}

function injectRouteHtml(baseHtml, headMarkup, appHtml) {
  const cleanedHead = baseHtml
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta[^>]+name="description"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+name="robots"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+name="twitter:[^"]+"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+property="og:[^"]+"[^>]*>\s*/gi, "")
    .replace(/<link[^>]+rel="canonical"[^>]*>\s*/gi, "")
    .replace(
      /<script type="application\/ld\+json" data-seo-structured="true">[\s\S]*?<\/script>\s*/gi,
      ""
    )
    .replace("</head>", `${headMarkup}</head>`);

  return cleanedHead.replace(
    /<div id="root">[\s\S]*?<\/div>/i,
    `<div id="root">${appHtml}</div>`
  );
}

function buildSitemap(allEntries) {
  const urls = allEntries
    .filter((entry) => entry.seo.robots.startsWith("index"))
    .map(
      (entry) =>
        `<url><loc>${escapeXml(entry.seo.canonicalUrl)}</loc><changefreq>weekly</changefreq><priority>${
          entry.path === "/" ? "1.0" : entry.path.startsWith("/blog/") ? "0.72" : "0.8"
        }</priority></url>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

function buildRobots(allEntries) {
  const indexedHome = allEntries.find((entry) => entry.path === "/");
  const sitemapUrl = indexedHome
    ? `${indexedHome.seo.canonicalUrl.replace(/\/$/, "")}/sitemap.xml`
    : "https://project-nu-one-39.vercel.app/sitemap.xml";

  return [
    "User-agent: *",
    "Allow: /",
    "Disallow: /privacy-policy-draft",
    "",
    `Sitemap: ${sitemapUrl}`,
    "",
  ].join("\n");
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
