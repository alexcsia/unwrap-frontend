<script setup lang="ts">
import ProfileMenu from "./ProfileMenu.vue";
</script>

<template>
  <main class="w-full h-20 bg-amber-200">
    <div
      class="flex items-center justify-between w-full h-full px-6 py-3 border border-[#303030] bg-[#191919]"
    >
      <RouterLink
        to="/"
        class="text-[#a8e66b] text-2xl font-extrabold no-underline px-2"
      >
        Unwrap
      </RouterLink>

      <div>
        <ProfileMenu />
      </div>
    </div>
  </main>
</template>
