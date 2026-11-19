import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router/index.ts";
import { createPinia } from "pinia";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== "true") return;
  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledFrame: "bypass" });
}

const queryClient = new QueryClient();

enableMocking().then(() => {
  const app = createApp(App);

  app
    .use(createPinia())
    .use(router)
    .use(VueQueryPlugin, { queryClient })
    .mount("#app");

  if (import.meta.env.DEV) {
    (window as any).clearQueryCache = () => queryClient.clear();
    console.log("clearQueryCache() available on window");
  }
});
