<script setup lang="ts">
import { ref, watch } from "vue";
import ProfileField from "@/components/profile/ProfileField.vue";
import { useProfile } from "@/composables/profile/useProfile";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import Navbar from "@/components/Navbar.vue";

const router = useRouter();
const {
  data: profile,
  isLoading,
  isError,
  updateProfile,
  changePassword,
  deleteAccount,
  isDeleting,
} = useProfile();

const username = ref("");
const email = ref("");

watch(
  profile,
  (p) => {
    if (p) {
      username.value = p.username ?? "";
      email.value = p.email ?? "";
    }
  },
  { immediate: true },
);

const changingPassword = ref(false);
const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

async function updateUsername(value: string) {
  try {
    await updateProfile({ username: value });
    toast.success("Username updated successfully.");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update username.");
  }
}

async function updateEmail(value: string) {
  try {
    await updateProfile({ email: value });
    toast.success("Email address updated successfully.");
  } catch (err) {
    console.error(err);
    toast.error("Failed to update email address.");
  }
}

async function handlePasswordChange() {
  if (newPassword.value !== confirmPassword.value) {
    toast.error("New passwords do not match.");
    return;
  }

  if (newPassword.value.length < 8) {
    toast.error("New password must be at least 8 characters long.");
    return;
  }

  try {
    await changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    });
    toast.success("Password changed successfully.");
    currentPassword.value = "";
    newPassword.value = "";
    confirmPassword.value = "";
    changingPassword.value = false;
  } catch (err) {
    console.error(err);
    toast.error("Failed to change password. Check your current password.");
  }
}

async function handleDeleteAccount() {
  const confirmed = window.confirm(
    "Are you sure you want to delete your account? This action cannot be undone.",
  );

  if (!confirmed) return;

  try {
    await deleteAccount();
    toast.success("Account deleted.");
    await router.replace("/login");
  } catch (err) {
    console.error(err);
    toast.error("Could not delete account. Please try again.");
  }
}
</script>

<template>
  <Navbar />
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
            type="text"
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
          @submit.prevent="handlePasswordChange"
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
        <h2 class="text-lg font-semibold text-error">Danger zone</h2>

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
            class="shrink-0 rounded-lg border border-red-400/40 px-4 py-2 text-sm font-semibold text-error transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
            @click="handleDeleteAccount"
          >
            {{ isDeleting ? "Deleting..." : "Delete account" }}
          </button>
        </div>
      </section>
    </div>
  </main>
</template>
