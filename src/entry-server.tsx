import { renderToString } from "react-dom/server";
import App from "./App";
import { getAllContentPaths } from "./content";
import { buildHeadMarkup, getSeoDocument } from "./lib/seo";
import { resolveRoute } from "./lib/routing";
import { pagePaths } from "./config/site";

export function getPrerenderEntries() {
  const paths = Array.from(
    new Set([...Object.values(pagePaths), ...getAllContentPaths()])
  );

  return paths.map((path) => {
    const route = resolveRoute(path);
    const seo = getSeoDocument(route);
    return {
      path,
      route,
      seo,
      head: buildHeadMarkup(seo),
      appHtml: renderToString(<App initialPath={path} />),
    };
  });
}

export function getNotFoundEntry() {
  const path = "/404-not-found";
  const route = resolveRoute(path);
  const seo = getSeoDocument(route);

  return {
    path,
    route,
    seo,
    head: buildHeadMarkup(seo),
    appHtml: renderToString(<App initialPath={path} />),
  };
}
