"use client"

import { useEffect, useRef } from 'react'
import QRCode from 'qrcode'

interface QRCodeComponentProps {
  url: string
  size?: number
  className?: string
}

export function QRCodeComponent({ url, size = 200, className = "" }: QRCodeComponentProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch((err) => {
        console.error('Error generating QR code:', err)
      })
    }
  }, [url, size])

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <canvas ref={canvasRef} />
      <p className="text-sm text-gray-600 mt-2 text-center">
        Scan to view project
      </p>
    </div>
  )
}
