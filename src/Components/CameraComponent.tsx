import React, { useRef, useEffect, forwardRef, useImperativeHandle, useState } from 'react'

interface CameraComponentProps {
  onCapture: (imageDataUrl: string, blob: Blob | null | undefined) => void
}

export interface CameraComponentRef {
  captureImage: () => void
  startCamera: () => void
  closeCamera: () => void
  resetCanvas: () => void
}

const CameraComponent: React.ForwardRefRenderFunction<CameraComponentRef, CameraComponentProps> = (
  { onCapture },
  ref,
) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  useEffect(() => {
    startCamera()
    return () => {
      closeCamera()
      resetCanvas()
    }
  }, [])

  const startCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((newStream) => {
        const video = videoRef.current
        if (video) {
          video.srcObject = newStream
          video.play()
          setStream(newStream)
        }
      })
      .catch((err) => {
        console.error('Error accessing the camera', err)
      })
  }

  const closeCamera = () => {
    if (stream) {
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      setStream(null)
    }
  }

  const resetCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const context = canvas.getContext('2d')
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
    }
  }

  const captureImage = () => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (canvas && video) {
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageDataURL = canvas.toDataURL('image/png')
        // create blob from base64
        const blob = dataURItoBlob(imageDataURL)
        onCapture(imageDataURL, blob)
      }
    }
  }

  const dataURItoBlob = (dataURI: string) => {
    // convert base64 to raw binary data held in a string
    const byteString = atob(dataURI.split(',')[1])

    // write the bytes of the string to an ArrayBuffer
    const ab = new ArrayBuffer(byteString.length)

    // create a view into the buffer
    const ia = new Uint8Array(ab)

    // set the bytes of the buffer to the correct values
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }

    // write the ArrayBuffer to a blob, and you're done
    const blob = new Blob([ab], { type: 'image/png' })
    return blob
  }
  

  // Expose the captureImage, startCamera, closeCamera, and resetCanvas functions through the ref
  useImperativeHandle(ref, () => ({
    captureImage,
    startCamera,
    closeCamera,
    resetCanvas,
  }))

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        textAlign: 'center',
        backgroundColor: 'black',
        zIndex: 1000,
      }}
    >
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%' }}
      ></video>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          border: '2px solid green',
        }}
      ></canvas>
      <button
        onClick={captureImage}
        style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '2.5rem',
          borderRadius: '50%',
          border: '10px solid red',
        }}
      ></button>
    </div>
  )
}

export default forwardRef<CameraComponentRef, CameraComponentProps>(CameraComponent)
