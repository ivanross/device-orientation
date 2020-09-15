import { useState } from 'react'

export function useRender() {
  const [_, setState] = useState(0)
  const render = () => setState((s) => s + 1)
  return render
}
