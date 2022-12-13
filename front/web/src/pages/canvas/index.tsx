import React, { useEffect, useRef } from 'react'

export const PubKeyDisc = () => {
  const canvasRef = useRef(null)

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current

    return canvas.getContext('2d')
  }

  useEffect(() => {
    const ctx: CanvasRenderingContext2D = getContext()
    ctx.fillRect(0, 0, 100, 100)
    ctx.save()
  })

  return (
    <div>
      <canvas className='canvas' ref={canvasRef} />
    </div>
  )
}

export default PubKeyDisc
