import type { BlogPost, ServicePage } from "./content";
import { blogPosts } from "./blogPosts";
import { servicePages } from "./servicePages";

export type { BlogPost, ContentBase, ContentFaq, ContentSection, ServicePage } from "./content";

export const blogIndexMeta = {
  path: "/blog",
  title: "Blog juridico com guias praticos para triagem e consulta",
  description:
    "Guias juridicos sobre trabalho, saude, familia, contratos e golpes para organizar documentos, entender sinais de risco e decidir o proximo passo.",
  heroTitle: "Blog juridico com foco em triagem clara e busca organica real",
  heroLead:
    "Conteudo pensado para responder buscas praticas, reduzir atrito na primeira consulta e fortalecer a presenca organica do site.",
};

const allEntries = [...servicePages, ...blogPosts];
const entryMap = new Map(allEntries.map((entry) => [entry.path, entry]));

export function getServicePageByPath(pathname: string): ServicePage | undefined {
  return servicePages.find((page) => page.path === pathname);
}

export function getBlogPostByPath(pathname: string): BlogPost | undefined {
  return blogPosts.find((post) => post.path === pathname);
}

export function getContentByPath(pathname: string): ServicePage | BlogPost | undefined {
  return entryMap.get(pathname);
}

export function getRelatedContent(paths: string[]) {
  return paths
    .map((path) => entryMap.get(path))
    .filter((entry): entry is ServicePage | BlogPost => Boolean(entry));
}

export function getAllContentPaths() {
  return allEntries.map((entry) => entry.path);
}

export function getAllContentEntries() {
  return allEntries;
}

export function getFeaturedGuides() {
  return servicePages.slice(0, 4);
}

export function getFeaturedPosts() {
  return blogPosts.slice(0, 4);
}

export { blogPosts, servicePages };
