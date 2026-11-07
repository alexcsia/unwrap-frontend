<script setup lang="ts">
defineProps<{
  label: string;
  busy?: boolean;
}>();
defineEmits<{ disconnect: [] }>();
</script>

<template>
  <section class="rounded-lg border border-neutral-700 p-4 flex flex-col gap-3">
    <header class="flex items-center justify-between">
      <h2 class="text-lg font-semibold">{{ label }}</h2>
      <span class="text-green-500 text-sm">Connected</span>
    </header>

    <slot />

    <button :disabled="busy" @click="$emit('disconnect')">
      {{ busy ? "Disconnecting..." : "Disconnect" }}
    </button>
  </section>
</template>
