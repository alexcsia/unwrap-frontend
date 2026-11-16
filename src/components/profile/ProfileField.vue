<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  label: string;
  value: string;
  type?: "text" | "email";
}>();

const emit = defineEmits<{
  save: [value: string];
}>();

const editing = ref(false);
const inputValue = ref(props.value);

watch(
  () => props.value,
  (value) => {
    inputValue.value = value;
  },
);

function cancel() {
  inputValue.value = props.value;
  editing.value = false;
}

function save() {
  const value = inputValue.value.trim();

  if (!value || value === props.value) {
    cancel();
    return;
  }

  emit("save", value);
  editing.value = false;
}
</script>

<template>
  <div
    class="flex flex-col gap-3 border-b border-white/10 py-5 sm:flex-row sm:items-center sm:justify-between"
  >
    <div class="min-w-0">
      <p class="mb-1 text-sm font-medium text-white/50">{{ label }}</p>

      <p v-if="!editing" class="break-all text-base text-white">
        {{ value }}
      </p>

      <input
        v-else
        v-model="inputValue"
        :type="type ?? 'text'"
        class="w-full max-w-sm rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
    </div>

    <div class="flex shrink-0 items-center gap-2">
      <template v-if="editing">
        <button
          type="button"
          class="rounded-lg px-3 py-2 text-sm text-white/60 transition hover:text-white"
          @click="cancel"
        >
          Cancel
        </button>

        <button
          type="button"
          class="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-surface transition hover:brightness-110"
          @click="save"
        >
          Save
        </button>
      </template>

      <button
        v-else
        type="button"
        class="rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-white transition hover:border-brand/50 hover:text-brand"
        @click="editing = true"
      >
        Change
      </button>
    </div>
  </div>
</template>
