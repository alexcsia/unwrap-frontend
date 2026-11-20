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

      <div class="flex items-center gap-3">
        <RouterLink
          to="/statistics"
          active-class="border-brand text-brand"
          class="rounded-lg border border-solid px-3.5 py-1.5 text-base font-medium tracking-tight text-gray-200 transition-colors hover:text-brand"
        >
          My statistics
        </RouterLink>

        <RouterLink
          to="/exclusions"
          active-class="border-brand text-brand"
          class="rounded-lg border border-solid px-3.5 py-1.5 text-base font-medium tracking-tight text-gray-200 transition-colors hover:text-brand"
        >
          Exclusions
        </RouterLink>

        <NavbarMenu />
      </div>
    </nav>
  </header>
</template>
