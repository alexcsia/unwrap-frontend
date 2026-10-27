import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router/index.ts";
import { createPinia } from "pinia";

const app = createApp(App);

app.use(createPinia()).use(router).mount("#app");
