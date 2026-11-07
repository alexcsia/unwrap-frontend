import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router/index.ts";
import { createPinia } from "pinia";
import { QueryClient, VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);

const queryClient = new QueryClient();
app
  .use(createPinia())
  .use(router)
  .use(VueQueryPlugin, { queryClient })
  .mount("#app");

if (import.meta.env.DEV) {
  (window as any).clearQueryCache = () => queryClient.clear();
  console.log("TanStack Query cache cleared!");
}
