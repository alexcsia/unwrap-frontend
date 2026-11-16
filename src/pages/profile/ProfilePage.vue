<script setup lang="ts">
import { ref } from "vue";
import ProfileField from "@/components/profile/ProfileField.vue";
import { useProfile } from "@/composables/profile/useProfile";

const { data: profile, isLoading, isError } = useProfile();

const username = ref("YourUsername");
const email = ref("you@example.com");

const changingPassword = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const isDeleting = ref(false);

async function updateUsername(value: string) {
  username.value = value;
}

async function updateEmail(value: string) {
  email.value = value;
}

async function changePassword() {
  if (newPassword.value !== confirmPassword.value) {
    return;
  }

  if (newPassword.value.length < 8) {
    return;
  }

  currentPassword.value = "";
  newPassword.value = "";
  confirmPassword.value = "";
  changingPassword.value = false;
}

async function deleteAccount() {
  const confirmed = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone.",
  );

  if (!confirmed) return;

  isDeleting.value = true;

  try {
  } finally {
    isDeleting.value = false;
  }
}
</script>

<template>
  <main class="min-h-screen bg-background px-6 py-12">
    <div class="mx-auto max-w-3xl">
      <div class="mb-10">
        <h1 class="text-3xl font-bold tracking-tight text-surface">
          Your profile
        </h1>
      </div>

      <section class="rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
        <div class="mb-3">
          <h2 class="text-lg font-semibold text-white">Personal information</h2>
          <p class="mt-1 text-sm text-white/50">Update your account details.</p>
        </div>

        <div v-if="isLoading" class="text-white/60">Loading profile...</div>
        <div v-else-if="isError" class="text-error">
          Could not load your profile.
        </div>

        <div v-else-if="profile">
          <ProfileField
            label="Username"
            :value="username"
            @save="updateUsername"
          />

          <ProfileField
            label="Email address"
            type="email"
            :value="email"
            @save="updateEmail"
          />
        </div>
      </section>

      <section
        class="mt-6 rounded-2xl border border-white/10 bg-surface p-6 sm:p-8"
      >
        <div class="mb-3">
          <h2 class="text-lg font-semibold text-white">Security</h2>
          <p class="mt-1 text-sm text-white/50">
            Manage your password and account security.
          </p>
        </div>

        <div
          class="flex flex-col gap-3 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="mb-1 text-sm font-medium text-white/50">Password</p>
            <p class="text-base tracking-widest text-white">*************</p>
          </div>

          <button
            v-if="!changingPassword"
            type="button"
            class="self-start rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-brand/50 hover:text-brand sm:self-auto"
            @click="changingPassword = true"
          >
            Change password
          </button>
        </div>

        <form
          v-if="changingPassword"
          class="mt-5 space-y-4"
          @submit.prevent="changePassword"
        >
          <div>
            <label
              for="currentPassword"
              class="mb-2 block text-sm text-white/70"
            >
              Current password
            </label>
            <input
              id="currentPassword"
              v-model="currentPassword"
              type="password"
              autocomplete="current-password"
              required
              class="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-brand"
            />
          </div>

          <div>
            <label for="newPassword" class="mb-2 block text-sm text-white/70">
              New password
            </label>
            <input
              id="newPassword"
              v-model="newPassword"
              type="password"
              autocomplete="new-password"
              minlength="8"
              required
              class="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-brand"
            />
          </div>

          <div>
            <label
              for="confirmPassword"
              class="mb-2 block text-sm text-white/70"
            >
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              autocomplete="new-password"
              minlength="8"
              required
              class="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-white outline-none focus:border-brand"
            />
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              class="rounded-lg px-4 py-2 text-sm text-white/60 hover:text-white"
              @click="changingPassword = false"
            >
              Cancel
            </button>

            <button
              type="submit"
              class="rounded-lg bg-brand px-5 py-2 text-sm font-semibold text-surface transition hover:brightness-110"
            >
              Update password
            </button>
          </div>
        </form>
      </section>

      <section
        class="mt-6 rounded-2xl border border-red-400/20 bg-surface p-6 sm:p-8"
      >
        <h2 class="text-lg font-semibold text-red-400">Danger zone</h2>

        <div
          class="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p class="font-medium text-white">Delete account</p>
            <p class="mt-1 text-sm text-white/50">
              Permanently delete your account and associated data.
            </p>
          </div>

          <button
            type="button"
            :disabled="isDeleting"
            class="shrink-0 rounded-lg border border-red-400/40 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            @click="deleteAccount"
          >
            {{ isDeleting ? "Deleting..." : "Delete account" }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>
