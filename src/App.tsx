import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { applySeoDocument, getSeoDocument } from "./lib/seo";
import { resolveRoute } from "./lib/routing";
import Home from "./pages/Home";
import HowItWorks from "./pages/HowItWorks";
import Areas from "./pages/Areas";
import Chat from "./pages/Chat";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Simulator from "./pages/Simulator";
import Blog from "./pages/Blog";
import ContentPage from "./pages/ContentPage";
import NotFound from "./pages/NotFound";
import { normalizePath } from "./config/site";

interface AppProps {
  initialPath?: string;
}

function getInitialPath(initialPath?: string) {
  if (initialPath) {
    return normalizePath(initialPath);
  }

  if (typeof window === "undefined") {
    return "/";
  }

  return normalizePath(window.location.pathname);
}

function App({ initialPath }: AppProps) {
  const [currentPath, setCurrentPath] = useState(() => getInitialPath(initialPath));
  const route = useMemo(() => resolveRoute(currentPath), [currentPath]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    applySeoDocument(getSeoDocument(route));
  }, [route]);

  const handleNavigate = (href: string) => {
    const nextPath = normalizePath(href);

    if (typeof window !== "undefined" && window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }

    setCurrentPath(nextPath);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPage = () => {
    switch (route.kind) {
      case "core":
        switch (route.page) {
          case "home":
            return <Home onNavigate={handleNavigate} />;
          case "how-it-works":
            return <HowItWorks onNavigate={handleNavigate} />;
          case "areas":
            return <Areas onNavigate={handleNavigate} />;
          case "chat":
            return <Chat onNavigate={handleNavigate} />;
          case "contact":
            return <Contact onNavigate={handleNavigate} />;
          case "terms":
            return <Terms />;
          case "privacy":
            return <Privacy />;
          case "simulator":
            return <Simulator onNavigate={handleNavigate} />;
          case "blog":
            return <Blog onNavigate={handleNavigate} />;
        }
        break;
      case "blog-index":
        return <Blog onNavigate={handleNavigate} />;
      case "service":
        return <ContentPage entry={route.entry} kind="service" onNavigate={handleNavigate} />;
      case "blog-post":
        return <ContentPage entry={route.entry} kind="blog" onNavigate={handleNavigate} />;
      case "not-found":
        return <NotFound onNavigate={handleNavigate} />;
    }

    return <Home onNavigate={handleNavigate} />;
  };

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col">
      <Header
        currentPage={route.kind === "not-found" ? undefined : route.navPage}
        onNavigate={handleNavigate}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
