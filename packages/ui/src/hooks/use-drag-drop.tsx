import { useState, DragEvent } from 'react'

export interface DragDropState {
  dragActive: boolean
}

export interface DragDropHandlers {
  handleDrag: (e: DragEvent<HTMLDivElement>) => void
  handleDrop: (e: DragEvent<HTMLDivElement>) => void
}

export function useDragDrop(onDrop: (file: File) => void): [DragDropState, DragDropHandlers] {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onDrop(e.dataTransfer.files[0])
    }
  }

  return [
    { dragActive },
    { handleDrag, handleDrop }
  ]
}