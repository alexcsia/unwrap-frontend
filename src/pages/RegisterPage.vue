<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { register, ApiError } from "@/services/api";

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const error = ref("");

const router = useRouter();

const submitRegister = async () => {
  error.value = "";

  if (!name.value.trim() || !email.value.trim()) {
    error.value = "Please complete all fields.";
    return;
  }

  if (password.value.length < 8) {
    error.value = "Password must be at least 8 characters.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }

  loading.value = true;

  try {
    await register(name.value.trim(), email.value.trim(), password.value);

    await router.replace("/");
  } catch (err) {
    if (err instanceof ApiError && err.status === 409) {
      error.value = "An account with this email already exists.";
    } else {
      error.value = "Could not create your account. Please try again.";
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main
    class="min-h-screen grid place-items-center p-4 bg-[#f5f5f5] text-[#f5f5f5]"
  >
    <section
      class="w-full max-w-[420px] box-border p-5 border border-[#303030] rounded-[18px] bg-[#191919]"
    >
      <RouterLink
        to="/"
        class="text-[#a8e66b] text-2xl font-extrabold no-underline"
        >Unwrap</RouterLink
      >

      <h1 class="mt-7 mb-2 font-bold text-2xl">Create your account</h1>
      <p class="text-[#aaa] leading-[1.6]">Start understanding your music.</p>

      <form @submit.prevent="submitRegister" class="grid gap-3 mt-7">
        <label for="name" class="text-sm">Name</label>
        <input
          id="name"
          v-model.trim="name"
          autocomplete="name"
          placeholder="Your name"
          required
          class="box-border w-full p-[13px] border border-[#444] rounded-lg bg-[#101010] text-white"
        />

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
          autocomplete="new-password"
          minlength="8"
          placeholder="At least 8 characters"
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
          {{ loading ? "Creating account..." : "Create account" }}
        </button>
      </form>

      <p class="mt-6 text-sm text-[#aaa] leading-[1.6]">
        Already have an account?
        <RouterLink to="/login" class="text-[#a8e66b]">Log in</RouterLink>
      </p>
    </section>
  </main>
</template>
