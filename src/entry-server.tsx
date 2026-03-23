import { renderToString } from "react-dom/server";
import App from "./App";
import { buildHeadMarkup, getSeoDocument } from "./lib/seo";
import { getAllPublicPaths, resolveRoute } from "./lib/routing";

export function getPrerenderEntries() {
  const paths = getAllPublicPaths();

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
