<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { getProfile, linkPlatform, logout } from "@/services/api";

const isOpen = ref(false);
const loading = ref(false);
const error = ref<string | null>(null);

const router = useRouter();

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const openProfile = async () => {
  loading.value = true;
  error.value = null;

  try {
    const profile = await getProfile();
    console.log("Profile:", profile);
  } catch (err) {
    console.error(err);
    error.value = "Could not load your profile.";
  } finally {
    loading.value = false;
  }
};

const connectSpotify = async () => {
  loading.value = true;
  error.value = null;

  try {
    const result = await linkPlatform("spotify");
    window.location.href = result.redirectUrl;
  } catch (err) {
    console.error(err);
    error.value = "Could not start platform connection.";
    loading.value = false;
  }
};

const signOut = async () => {
  loading.value = true;
  error.value = null;

  try {
    await logout();
    isOpen.value = false;
    await router.replace("/login");
  } catch (err) {
    console.error(err);
    error.value = "Could not log out. Please try again.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="profile-menu">
    <button
      class="menu-button"
      type="button"
      @click="toggleMenu"
      aria-label="Open profile menu"
      :aria-expanded="isOpen"
    >
      ☰
    </button>

    <div v-if="isOpen" class="dropdown">
      <button
        type="button"
        class="dropdown-item"
        :disabled="loading"
        @click="openProfile"
      >
        Profile
      </button>

      <button
        type="button"
        class="dropdown-item"
        :disabled="loading"
        @click="connectSpotify"
      >
        Link platform
      </button>

      <button
        type="button"
        class="dropdown-item"
        :disabled="loading"
        @click="signOut"
      >
        Log out
      </button>

      <p v-if="error" class="error" role="alert">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.profile-menu {
  position: relative;
}

.menu-button {
  padding: 10px 14px;
  border: 1px solid #444;
  border-radius: 8px;
  background: #191919;
  color: white;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  z-index: 10;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  padding: 8px;
  border: 1px solid #333;
  border-radius: 10px;
  background: #191919;
  box-shadow: 0 8px 24px #0005;
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 11px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: white;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #303030;
}

.dropdown-item:disabled {
  opacity: 0.5;
}

.error {
  padding: 0 10px;
  color: #ff9696;
  font-size: 0.85rem;
}
</style>
