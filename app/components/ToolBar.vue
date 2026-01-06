<script setup lang="ts">
import { useShapes } from '../composables/useShapes'
import { ref } from 'vue'

const { activeTool, setTool, selectedToolId, removeSelected, clearAll } = useShapes()
const toolListOpen = ref(false)

const menuItems = [
  { id: 'select', label: 'Select' },
  {
    id: 'shapes',
    label: 'Shapes',
    tools: [
      { id: 'rect', label: 'Rect' },
      { id: 'circle', label: 'Circle' },
      { id: 'texas', label: 'Texas' },
      { id: 'house', label: 'House' }
    ]
  }
] as const

function openShapesMenu() {
  console.log('openShapesMenu')
}
</script>

<template>
  <div class="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
    <div class="flex items-center gap-2">
      <button
        v-for="tool in menuItems.filter(tool => tool.id !== 'shapes')"
        :key="tool.id"
        class="rounded-md border px-3 py-1.5 text-sm transition"
        :class="activeTool === tool.id
          ? 'border-neutral-900 bg-neutral-900 text-white'
          : 'border-neutral-200 bg-white hover:bg-neutral-50'"
        @click="setTool(tool.id)"
      >
        {{ tool.label }}
      </button>

      <UDropdownMenu
        v-if="toolListOpen"
        v-slot="{ open }"
        :modal="false"
        :items="menuItems.find(tool => tool.id === 'shapes')?.tools"
      >
        <UButton
          label="Shapes"
          variant="subtle"
          trailing-icon="i-lucide-chevron-down"
          size="xs"
          class="-mb-[6px] font-semibold rounded-full truncate"
          :class="[open && 'bg-primary/15']"
          :ui="{ trailingIcon: ['transition-transform duration-200', open ? 'rotate-180' : undefined].filter(Boolean).join(' ') }"
        />
      </UDropdownMenu>
    </div>

    <div class="mx-2 h-6 w-px bg-neutral-200" />

    <button
      class="rounded-md border border-neutral-200 px-3 py-1.5 text-sm hover:bg-neutral-50 disabled:opacity-50"
      :disabled="!selectedToolId"
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
