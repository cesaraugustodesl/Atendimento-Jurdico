import {
  blogIndexMeta,
  getAllContentPaths,
  getBlogPostByPath,
  getContentByPath,
  getServicePageByPath,
} from "../content";
import { getAllSimulatorPaths, getSimulatorByPath } from "./simulators/registry";
import type { BlogPost, ServicePage } from "../content";
import { pageLabels, pagePaths, type Page, normalizePath } from "../config/site";
import type { SimulatorDefinition } from "./simulators/types";

export type ResolvedRoute =
  | { kind: "core"; page: Page; path: string; navPage: Page }
  | { kind: "simulator-detail"; entry: SimulatorDefinition; path: string; navPage: Page }
  | { kind: "service"; entry: ServicePage; path: string; navPage: Page }
  | { kind: "blog-index"; path: string; navPage: Page }
  | { kind: "blog-post"; entry: BlogPost; path: string; navPage: Page }
  | { kind: "not-found"; path: string };

export const corePages = Object.keys(pagePaths) as Page[];

export function resolveRoute(pathname: string): ResolvedRoute {
  const path = normalizePath(pathname);

  if (path === blogIndexMeta.path) {
    return {
      kind: "blog-index",
      path,
      navPage: "blog",
    };
  }

  const corePage = corePages.find((page) => pagePaths[page] === path);
  if (corePage) {
    return {
      kind: "core",
      page: corePage,
      path,
      navPage: corePage,
    };
  }

  const simulatorEntry = getSimulatorByPath(path);
  if (simulatorEntry) {
    return {
      kind: "simulator-detail",
      entry: simulatorEntry,
      path,
      navPage: "simulator",
    };
  }

  const servicePage = getServicePageByPath(path);
  if (servicePage) {
    return {
      kind: "service",
      entry: servicePage,
      path,
      navPage: "blog",
    };
  }

  const blogPost = getBlogPostByPath(path);
  if (blogPost) {
    return {
      kind: "blog-post",
      entry: blogPost,
      path,
      navPage: "blog",
    };
  }

  return {
    kind: "not-found",
    path,
  };
}

export function isInternalHref(href: string) {
  return href.startsWith("/");
}

export function getAllPublicPaths() {
  return Array.from(
    new Set([
      ...Object.values(pagePaths),
      blogIndexMeta.path,
      ...getAllContentPaths(),
      ...getAllSimulatorPaths(),
    ])
  );
}

export function getRouteLabel(route: ResolvedRoute) {
  switch (route.kind) {
    case "core":
      return pageLabels[route.page];
    case "simulator-detail":
      return route.entry.name;
    case "blog-index":
      return "Blog";
    case "service":
    case "blog-post":
      return route.entry.title;
    case "not-found":
      return "Pagina nao encontrada";
  }
}

export function getRelatedEntryByPath(pathname: string) {
  return getContentByPath(pathname);
}
