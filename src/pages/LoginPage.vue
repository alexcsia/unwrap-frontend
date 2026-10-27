<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { login, ApiError } from "@/services/api";

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const route = useRoute();
const router = useRouter();

const submitLogin = async () => {
  error.value = "";

  if (!email.value.trim() || !password.value) {
    error.value = "Enter your email and password.";
    return;
  }

  loading.value = true;

  try {
    await login(email.value.trim(), password.value);

    const redirect =
      typeof route.query.redirect === "string" ? route.query.redirect : "/";

    const safeRedirect =
      redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/";

    await router.replace(safeRedirect);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      error.value = "Invalid email or password.";
    } else {
      error.value = "Could not log in. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main
    class="min-h-screen grid place-items-center p-6 bg-[#f5f5f5] text-[#f5f5f5]"
  >
    <section
      class="w-full max-w-[420px] p-9 border border-[#303030] rounded-[18px] bg-[#191919]"
    >
      <RouterLink
        to="/"
        class="text-[#a8e66b] text-2xl font-extrabold no-underline"
        >Unwrap</RouterLink
      >

      <h1 class="mt-7 mb-2 font-bold text-2xl">Welcome back</h1>
      <p class="text-[#aaa] leading-[1.6]">
        Log in to explore your listening history.
      </p>

      <form @submit.prevent="submitLogin" class="grid gap-3 mt-7">
        <label for="email" class="text-sm">Email</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          required
          class="box-border w-full p-[13px] border border-[#444] rounded-lg bg-[#101010] text-white"
        />

        <label for="password" class="text-sm">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Your password"
          required
          class="box-border w-full p-[13px] border border-[#444] rounded-lg bg-[#101010] text-white"
        />

        <p v-if="error" class="text-[#ff9696]" role="alert">
          {{ error }}
        </p>

        <button
          type="submit"
          :disabled="loading"
          class="mt-[10px] p-[13px] border-0 rounded-lg bg-[#a8e66b] text-[#111] font-bold cursor-pointer disabled:opacity-60 disabled:cursor-wait"
        >
          {{ loading ? "Logging in..." : "Log in" }}
        </button>
      </form>

      <p class="mt-6 text-sm text-[#aaa] leading-[1.6]">
        Don't have an account?
        <RouterLink to="/register" class="text-[#a8e66b]"
          >Create one</RouterLink
        >
      </p>
    </section>
  </main>
</template>
