<script setup lang="ts">
import { useShapes } from '../composables/useShapes'

const { activeTool, setTool, selectedId, removeSelected, clearAll } = useShapes()

const tools = [
  { id: 'select', label: 'Select' },
  { id: 'rect', label: 'Rect' },
  { id: 'circle', label: 'Circle' },
  { id: 'texas', label: 'Texas' },
  { id: 'house', label: 'House' }
] as const
</script>

<template>
  <div class="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
    <div class="flex items-center gap-2">
      <button
        v-for="t in tools"
        :key="t.id"
        class="rounded-md border px-3 py-1.5 text-sm transition"
        :class="activeTool === t.id
          ? 'border-neutral-900 bg-neutral-900 text-white'
          : 'border-neutral-200 bg-white hover:bg-neutral-50'"
        @click="setTool(t.id)"
      >
        {{ t.label }}
      </button>
    </div>

    <div class="mx-2 h-6 w-px bg-neutral-200" />

    <button
      class="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
      :disabled="!selectedId"
      @click="removeSelected"
    >
      Delete Selected
    </button>

    <button
      class="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50"
      @click="clearAll"
    >
      Clear
    </button>

    <div class="ml-auto text-xs text-neutral-500">
      Tool: <span class="font-medium text-neutral-800">{{ activeTool }}</span>
    </div>
  </div>
</template>
