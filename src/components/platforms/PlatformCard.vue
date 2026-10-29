<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  buttonText: string;
  theme: "emerald" | "red";
}>();

const emit = defineEmits<{ (e: "link"): void }>();

const themes = {
  emerald: {
    hoverBg: "hover:bg-emerald-500/15",
    hoverBorder: "hover:border-emerald-400",
    buttonHover:
      "hover:bg-emerald-500 hover:text-neutral-950 hover:border-emerald-400",
    groupBorder: "group-hover:border-emerald-400/60",
  },
  red: {
    hoverBg: "hover:bg-red-500/15",
    hoverBorder: "hover:border-red-400",
    buttonHover: "hover:bg-red-500 hover:text-white hover:border-red-400",
    groupBorder: "group-hover:border-red-400/60",
  },
};
</script>

<template>
  <section
    class="group relative flex min-h-[50vh] flex-1 cursor-pointer items-center overflow-hidden border-b border-white/10 bg-neutral-950 p-8 transition-colors duration-500 md:min-h-screen md:border-b-0 md:border-r"
    :class="themes[theme].hoverBg"
    role="link"
    tabindex="0"
    @click="emit(`link`)"
    @keydown.enter="emit('link')"
    @keydown.space.prevent="emit('link')"
  >
    <div class="relative z-10 mx-auto max-w-md text-center">
      <h1 class="mb-5 text-5xl font-bold tracking-tight md:text-7xl">
        {{ title }}
      </h1>

      <p
        class="mx-auto mb-10 max-w-sm text-base leading-7 text-neutral-400 md:text-lg"
      >
        {{ description }}
      </p>

      <button
        type="button"
        class="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-3.5 font-medium transition-all duration-300"
        :class="(themes[theme].buttonHover, themes[theme].groupBorder)"
        @click.stop="emit('link')"
      >
        {{ buttonText }}
      </button>
    </div>
  </section>
</template>
