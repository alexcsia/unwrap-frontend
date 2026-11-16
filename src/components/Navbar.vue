<script setup lang="ts">
import ProfileMenu from "./ProfileMenu.vue";
</script>

<template>
  <main class="w-full h-20 bg-background">
    <div
      class="flex items-center justify-between w-full h-full px-6 py-3 border border-white/10 bg-surface"
    >
      <RouterLink
        to="/"
        class="px-2 text-2xl font-extrabold text-brand no-underline"
      >
        Unwrap
      </RouterLink>

      <ProfileMenu />
    </div>
  </main>
</template>
