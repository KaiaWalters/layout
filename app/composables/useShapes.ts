// composables/useShapes.ts
export type ShapeType = 'rect' | 'circle' | 'icon'

export type Shape = {
  id: string
  type: ShapeType
  x: number
  y: number
  w?: number
  h?: number
  r?: number
  fill?: string
  name?: string // for icons: 'texas' | 'house'
  size?: number // for icons: icon size in pixels
}

type Tool = ShapeType | 'select' | 'texas' | 'house'

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function useShapes() {
  const shapes = useState<Shape[]>('shapes', () => [])
  const selectedToolId = useState<string | null>('selectedId', () => null)
  const activeTool = useState<Tool>('activeTool', () => 'select')

  console.log('shapes', shapes.value)

  const selectedShape = computed(() =>
    shapes.value.find(s => s.id === selectedToolId.value) ?? null
  )

  function setTool(tool: Tool) {
    activeTool.value = tool
  }

  function select(id: string | null) {
    selectedToolId.value = id
  }

  function addShape(type: ShapeType | 'texas' | 'house', x: number, y: number) {
    // Handle icon tools (texas, house)
    if (type === 'texas' || type === 'house') {
      const shape: Shape = {
        id: uid(),
        type: 'icon',
        x,
        y,
        name: type,
        size: 48
      }
      console.log('addShape (icon)', shape)
      shapes.value = [...shapes.value, shape]
      selectedToolId.value = shape.id
      return
    }

    // Handle regular shapes (rect, circle)
    const base = {
      id: uid(),
      type,
      x,
      y,
      fill: type === 'rect' ? '#60a5fa' : ''
    } satisfies Omit<Shape, 'w' | 'h' | 'r'>

    const shape: Shape = type === 'rect' ? { ...base, w: 90, h: 60 } : { ...base, r: 30 }
    console.log('addShape', shape)
    shapes.value = [...shapes.value, shape]
    selectedToolId.value = shape.id
  }

  function updateShape(id: string, patch: Partial<Shape>) {
    shapes.value = shapes.value.map(s => (s.id === id ? { ...s, ...patch } : s))
  }

  function removeSelected() {
    if (!selectedToolId.value) return
    const id = selectedToolId.value
    shapes.value = shapes.value.filter(s => s.id !== id)
    selectedToolId.value = null
  }

  function clearAll() {
    shapes.value = []
    selectedToolId.value = null
  }

  return {
    // state
    shapes,
    selectedToolId,
    activeTool,
    selectedShape,

    // actions
    setTool,
    select,
    addShape,
    updateShape,
    removeSelected,
    clearAll
  }
}
