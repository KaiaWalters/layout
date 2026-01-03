<script setup lang="ts">
import type { Shape } from '../composables/useShapes'
import { useShapes } from '../composables/useShapes'
import { ref } from 'vue'

// NOTE: State is retrieved and managed from a central location to avoid circular dependencies and bugs.

const { shapes, selectedId, activeTool, select, addShape, updateShape } = useShapes()

// convert this to useState()

const stageRef = ref<SVGSVGElement | null>(null)

// drag state (local, transient)
const draggingId = ref<string | null>(null)
const dragOffset = ref({ dx: 0, dy: 0 })

function getPointFromEvent(ev: PointerEvent) {
  const svg = stageRef.value
  if (!svg) return { x: 0, y: 0 }

  const rect = svg.getBoundingClientRect()
  const x = ev.clientX - rect.left
  const y = ev.clientY - rect.top
  return { x, y }
}

function onStagePointerDown(ev: PointerEvent) {
  // click empty space
  const isPrimary = ev.button === 0
  if (!isPrimary) return

  if (activeTool.value === 'rect' || activeTool.value === 'circle' || activeTool.value === 'texas' || activeTool.value === 'house') {
    const p = getPointFromEvent(ev)

    // For rect we interpret x,y as top-left.
    // For circle we interpret x,y as center.
    // For icons we interpret x,y as center.
    addShape(activeTool.value, p.x, p.y)
    return
  }

  // select tool: clicking empty space clears selection
  select(null)
}

function onShapeClick(shape: Shape) {
  select(shape.id)
}

function onShapePointerDown(shape: Shape, ev: PointerEvent) {
  // start drag
  ev.preventDefault()
  ev.stopPropagation()

  draggingId.value = shape.id
  select(shape.id)

  const p = getPointFromEvent(ev)

  // determine offset so shape doesn't "jump"
  if (shape.type === 'rect') {
    dragOffset.value = { dx: p.x - shape.x, dy: p.y - shape.y }
  } else {
    // circle uses cx/cy
    dragOffset.value = { dx: p.x - shape.x, dy: p.y - shape.y }
  }

  stageRef.value?.setPointerCapture(ev.pointerId)
}

function onStagePointerMove(ev: PointerEvent) {
  if (!draggingId.value) return

  const id = draggingId.value
  const shape = shapes.value.find(s => s.id === id)
  if (!shape) return

  const p = getPointFromEvent(ev)
  const nx = p.x - dragOffset.value.dx
  const ny = p.y - dragOffset.value.dy

  // Update the shape's position
  updateShape(id, { x: nx, y: ny })
}

function onStagePointerUp() {
  draggingId.value = null
}

function onStagePointerLeave() {
  draggingId.value = null
}
</script>

<template>
  <div class="rounded-lg border border-neutral-200 bg-white shadow-sm">
    <div class="border-b border-neutral-200 px-4 py-2 text-sm text-neutral-600">
      Click to place shapes. Drag to move. Click shape to select.
    </div>

    <div class="p-3">
      <svg
        ref="stageRef"
        class="h-[520px] w-full select-none rounded-md bg-neutral-50"
        role="application"
        @pointerdown="onStagePointerDown"
        @pointermove="onStagePointerMove"
        @pointerup="onStagePointerUp"
        @pointerleave="onStagePointerLeave"
      >
        <defs>
          <pattern
            id="dotGrid"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx="1"
              cy="1"
              r="1"
              fill="#e5e7eb"
            />
          </pattern>
        </defs>

        <ShapeItem
          v-for="s in shapes"
          :key="s.id"
          :shape="s"
          :selected="s.id === selectedId"
          @click="onShapeClick(s)"
          @pointerdown="onShapePointerDown(s, $event)"
        />
      </svg>
    </div>
  </div>
</template>
