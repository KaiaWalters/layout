<script setup lang="ts">
import { computed } from 'vue'
import type { Shape } from '../composables/useShapes'

const props = defineProps<{
  shape: Shape
  selected: boolean
}>()

const emit = defineEmits<{
  (e: 'pointerdown', ev: PointerEvent): void
  (e: 'click', ev: MouseEvent): void
}>()

const stroke = computed(() => (props.selected ? '#111827' : 'transparent'))
const strokeWidth = computed(() => (props.selected ? 2 : 0))

const iconPath = computed(() => {
  if (props.shape.type !== 'icon') return ''
  const iconName = props.shape.name === 'texas' ? 'texas.svg' : 'house-1.png'
  return `/icons/${iconName}`
})
</script>

<template>
  <g>
    <rect
      v-if="shape.type === 'rect'"
      :x="shape.x"
      :y="shape.y"
      :width="shape.w"
      :height="shape.h"
      :fill="shape.fill"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      rx="10"
      class="cursor-move"
      @pointerdown="emit('pointerdown', $event)"
      @click.stop="emit('click', $event)"
    />
    <circle
      v-else-if="shape.type === 'circle'"
      :cx="shape.x"
      :cy="shape.y"
      :r="shape.r"
      :fill="shape.fill"
      :stroke="stroke"
      :stroke-width="strokeWidth"
      class="cursor-move"
      @pointerdown="emit('pointerdown', $event)"
      @click.stop="emit('click', $event)"
    />

    <!-- Icon shapes -->
    <g
      v-else-if="shape.type === 'icon' && shape.size"
      class="cursor-move"
      @pointerdown="emit('pointerdown', $event)"
      @click.stop="emit('click', $event)"
    >
      <rect
        :x="shape.x - shape.size / 2"
        :y="shape.y - shape.size / 2"
        :width="shape.size"
        :height="shape.size"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        fill="transparent"
        rx="4"
      />
      <foreignObject
        :x="shape.x - shape.size / 2"
        :y="shape.y - shape.size / 2"
        :width="shape.size"
        :height="shape.size"
      >
        <img
          :src="iconPath"
          :width="shape.size"
          :height="shape.size"
          style="display: block; object-fit: contain;"
          alt=""
        >
      </foreignObject>
    </g>
  </g>
</template>
