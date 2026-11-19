<script setup lang="ts">
import NavbarMenu from "./NavbarMenu.vue";
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-white/10 bg-surface/95 backdrop-blur-md"
  >
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
      <RouterLink
        to="/"
        class="text-xl font-extrabold tracking-tight text-brand no-underline transition-opacity hover:opacity-80"
      >
        Unwrap
      </RouterLink>

      <NavbarMenu />
    </nav>
  </header>
</template>
