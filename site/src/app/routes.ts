import {
  createRouter,
  createWebHashHistory,
  createMemoryHistory,
} from "vue-router";
import { pages } from "../content/components";
import { guides } from "../content/guides";
export function legacyPath(path: string) {
  const id = path.replace(/^\//, "").replace(/\/$/, "");
  const guides: Record<string, string> = {
    "getting-started": "/guide/quick-start",
    foundations: "/guide/theme",
    conventions: "/guide/configuration",
    scenarios: "/components",
    feedback: "/extensions",
    api: "/components",
  };
  return pages.some((p) => p.id === id) ? `/components/${id}` : guides[id];
}
export function makeRouter(memory = false) {
  return createRouter({
    history: memory
      ? createMemoryHistory()
      : createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
      { path: "/", component: () => import("../layouts/HomePage.vue") },
      {
        path: "/components",
        component: () => import("../layouts/OverviewPage.vue"),
      },
      {
        path: "/extensions",
        component: () => import("../layouts/OverviewPage.vue"),
        props: { extensionsOnly: true },
      },
      { path: "/components/feedback", redirect: "/extensions" },
      {
        path: "/components/:id",
        component: () => import("../layouts/ComponentPage.vue"),
      },
      { path: "/guide", redirect: "/guide/installation" },
      ...guides.map((g) => ({
        path: `/guide/${g.id}`,
        component: () => import("../layouts/GuidePage.vue"),
        props: { guide: g },
      })),
      {
        path: "/guide/changelog",
        component: () => import("../layouts/ChangelogPage.vue"),
      },
      {
        path: "/:old",
        redirect: (to) =>
          legacyPath(to.path)
            ? { path: legacyPath(to.path)!, hash: to.hash }
            : "/not-found",
      },
      {
        path: "/not-found",
        component: () => import("../layouts/NotFoundPage.vue"),
      },
      {
        path: "/:pathMatch(.*)*",
        component: () => import("../layouts/NotFoundPage.vue"),
      },
    ],
    scrollBehavior(to, from, saved) {
      if (saved) return saved;
      if (to.hash)
        return {
          el: to.hash,
          top:
            (document.querySelector(".site-header")?.getBoundingClientRect()
              .height ?? 64) + 24,
          behavior: "smooth",
        };
      return { top: 0 };
    },
  });
}
