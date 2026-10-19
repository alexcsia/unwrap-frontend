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

    // Avoid redirecting to an external URL.
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
  <main class="auth-page">
    <section class="auth-card">
      <RouterLink to="/" class="brand">Unwrap</RouterLink>

      <h1>Welcome back</h1>
      <p class="auth-subtitle">Log in to explore your listening history.</p>

      <form @submit.prevent="submitLogin">
        <label for="email">Email</label>
        <input
          id="email"
          v-model.trim="email"
          type="email"
          autocomplete="email"
          placeholder="you@example.com"
          required
        />

        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          autocomplete="current-password"
          placeholder="Your password"
          required
        />

        <p v-if="error" class="form-error" role="alert">
          {{ error }}
        </p>

        <button type="submit" :disabled="loading">
          {{ loading ? "Logging in..." : "Log in" }}
        </button>
      </form>

      <p class="auth-footer">
        Don't have an account?
        <RouterLink to="/register">Create one</RouterLink>
      </p>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #101010;
  color: #f5f5f5;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 36px;
  border: 1px solid #303030;
  border-radius: 18px;
  background: #191919;
}

.brand {
  color: #a8e66b;
  font-size: 1.5rem;
  font-weight: 800;
  text-decoration: none;
}

h1 {
  margin: 28px 0 8px;
}

.auth-subtitle,
.auth-footer {
  color: #aaa;
  line-height: 1.6;
}

form {
  display: grid;
  gap: 12px;
  margin-top: 28px;
}

label {
  font-size: 0.9rem;
}

input {
  box-sizing: border-box;
  width: 100%;
  padding: 13px;
  border: 1px solid #444;
  border-radius: 8px;
  background: #101010;
  color: white;
}

button {
  margin-top: 10px;
  padding: 13px;
  border: 0;
  border-radius: 8px;
  background: #a8e66b;
  color: #111;
  font-weight: 700;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: wait;
}

.form-error {
  color: #ff9696;
}

.auth-footer {
  margin-top: 24px;
  font-size: 0.9rem;
}

.auth-footer a {
  color: #a8e66b;
}
</style>
