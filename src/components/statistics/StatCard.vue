<script setup lang="ts">
defineProps<{
  label: string;
  value: string | number;
}>();
</script>

<template>
  <div class="p-5 border border-[#303030] rounded-xl bg-[#191919] text-white">
    <div class="text-sm text-neutral-400 mb-1">{{ label }}</div>
    <div class="text-2xl font-bold leading-tight">{{ value }}</div>
  </div>
</template>
