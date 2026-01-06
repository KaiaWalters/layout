<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import { useShapes } from '../composables/useShapes'

const { removeSelected } = useShapes()

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Backspace' || e.key === 'Delete') {
    e.preventDefault()
    removeSelected()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div>
    <UPageHero
      title="Room Layout planner for your home"
      description="A production-ready starter template powered by Nuxt UI. Build beautiful, accessible, and performant applications in minutes, not hours."
    />
    <ToolBar />
    <CanvasStage />
  </div>
</template>
