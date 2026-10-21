import { useEffect, useRef } from 'react'

/*
 * Adapted from "2TC 15 Psychedelic Sand Dunes" by Reinder Nijhoff (2015).
 * https://www.shadertoy.com/view/MtlGWM
 * Licensed under CC BY-NC-SA 4.0:
 * https://creativecommons.org/licenses/by-nc-sa/4.0/
 *
 * Changes: Shadertoy uniforms and output ported to Canvas 2D, color mapped
 * to monochrome, and resolution, ray-march steps, and frame rate reduced for
 * a lightweight page background.
 */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let width = 1
    let height = 1
    let animationTimeout = 0
    let startTime = 0

    const draw = (seconds: number) => {
      const frame = context.createImageData(width, height)
      const pixels = frame.data
      let pixel = 0

      for (let y = 0; y < height; y += 1) {
        const rayY = (height - y - 0.5) / height - 0.5

        for (let x = 0; x < width; x += 1) {
          const rayX = (x + 0.5) / width - 0.5
          const rayZ = 0.5
          let pointX = 0
          let pointY = 0
          let pointZ = 0
          let originX = rayX
          let originY = rayY
          let originZ = rayZ + seconds * 4
          let i = 0

          for (; i < 9; i += 0.15) {
            const cosineZ = Math.cos(pointZ)
            const surface = cosineZ - Math.abs(Math.sin(pointX * 0.7 + cosineZ))
            pointY += 1
            if (!(surface < pointY)) break

            originX += rayX * i * 0.05
            originY += rayY * i * 0.05
            originZ += rayZ * i * 0.05
            pointX = originX * 0.3
            pointY = originY * 0.3
            pointZ = originZ * 0.3
          }

          const mixAmount = i / 9
          const duneR = (3 + pointY) * 0.6
          const duneG = (3 + pointY) * 0.3
          const red = duneR * (1 - mixAmount) + rayX * mixAmount
          const green = duneG * (1 - mixAmount) + rayY * mixAmount
          const blue = rayZ * mixAmount
          const luminance = Math.max(
            0,
            Math.min(255, (red * 0.2126 + green * 0.7152 + blue * 0.0722) * 255),
          )

          pixels[pixel] = luminance
          pixels[pixel + 1] = luminance
          pixels[pixel + 2] = luminance
          pixels[pixel + 3] = 255
          pixel += 4
        }
      }

      context.putImageData(frame, 0, 0)
    }

    const resize = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      width = Math.max(96, Math.min(180, Math.round(viewportWidth * 0.12)))
      height = Math.max(90, Math.round(width * (viewportHeight / viewportWidth)))
      canvas.width = width
      canvas.height = height
      draw(0)
    }

    const animate = () => {
      draw((performance.now() - startTime) / 1000)
      animationTimeout = window.setTimeout(animate, 250)
    }

    const startAnimation = () => {
      window.clearTimeout(animationTimeout)
      if (reducedMotion.matches || document.hidden) {
        draw(0)
        return
      }
      startTime = performance.now()
      animationTimeout = window.setTimeout(animate, 250)
    }

    const handleVisibilityChange = () => {
      if (document.hidden) window.clearTimeout(animationTimeout)
      else startAnimation()
    }

    resize()
    window.addEventListener('resize', resize)
    reducedMotion.addEventListener('change', startAnimation)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    startAnimation()

    return () => {
      window.clearTimeout(animationTimeout)
      window.removeEventListener('resize', resize)
      reducedMotion.removeEventListener('change', startAnimation)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return (
    <div className="shader-background" aria-hidden="true">
      <canvas ref={canvasRef} className="shader-background__canvas" />
    </div>
  )
}
