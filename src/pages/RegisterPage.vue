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
  <main class="auth-page">
    <section class="auth-card">
      <RouterLink to="/" class="brand">Unwrap</RouterLink>

      <h1>Create your account</h1>
      <p class="auth-subtitle">Start understanding your music.</p>

      <form @submit.prevent="submitRegister">
        <label for="name">Name</label>
        <input
          id="name"
          v-model.trim="name"
          autocomplete="name"
          placeholder="Your name"
          required
        />

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
          autocomplete="new-password"
          minlength="8"
          placeholder="At least 8 characters"
          required
        />

        <label for="confirm-password">Confirm password</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          autocomplete="new-password"
          placeholder="Enter your password again"
          required
        />

        <p v-if="error" class="form-error" role="alert">
          {{ error }}
        </p>

        <button type="submit" :disabled="loading">
          {{ loading ? "Creating account..." : "Create account" }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account?
        <RouterLink to="/login">Log in</RouterLink>
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
  box-sizing: border-box;
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
