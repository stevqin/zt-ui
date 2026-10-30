import { createApp } from "vue";
import App from "./App.vue";
import { makeRouter, legacyPath } from "./routes";
import "../styles/docs.scss";
const oldPath = legacyPath(location.pathname);
if (!location.hash && oldPath)
  history.replaceState(null, "", `${import.meta.env.BASE_URL}#${oldPath}`);
createApp(App).use(makeRouter()).mount("#app");
