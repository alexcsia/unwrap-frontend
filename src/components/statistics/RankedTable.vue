<script setup lang="ts">
export type RankedColumn = {
  key: string;
  label: string;
  format?: (row: any) => string;
};

defineProps<{
  title: string;
  columns: RankedColumn[];
  rows: any[];
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
}>();

function cell(col: RankedColumn, row: any): string {
  if (col.format) return col.format(row);
  const v = row[col.key];
  return v == null ? "-" : String(v);
}
</script>

<template>
  <section
    class="p-5 border border-[#303030] rounded-xl bg-[#191919] text-white"
  >
    <header class="flex items-center justify-between gap-3 mb-3">
      <h2 class="text-lg font-semibold m-0">{{ title }}</h2>
      <slot name="actions" />
    </header>

    <p v-if="loading" class="text-neutral-400 m-1">Loading…</p>
    <p v-else-if="error" class="text-red-300 m-1" role="alert">{{ error }}</p>
    <p v-else-if="rows.length === 0" class="text-neutral-400 m-1">
      {{ emptyMessage ?? "No data yet." }}
    </p>

    <table v-else class="w-full border-collapse">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            class="text-left px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 border-b border-[#262626]"
          >
            {{ col.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(row, i) in rows"
          :key="row.rank ?? i"
          class="border-b border-[#262626] last:border-b-0"
        >
          <td v-for="col in columns" :key="col.key" class="px-3 py-2 text-sm">
            {{ cell(col, row) }}
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
