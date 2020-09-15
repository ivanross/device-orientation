import React, { useEffect, useState } from 'react'
import { SceneComponent } from './Scene'

const ORIENTATION_SUPPORTED = window.DeviceOrientationEvent && 'ontouchstart' in window

async function requestPermission() {
  if (typeof DeviceOrientationEvent.requestPermission !== 'function') return 'granted'

  try {
    const response = await DeviceOrientationEvent.requestPermission()
    return response
  } catch {
    // An error is thrown when the user is asked for permission
    // before an interaction in ios
    return 'error'
  }
}

export function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    ;(async () => {
      if (!ORIENTATION_SUPPORTED) {
        setMessage('not supported')
      } else {
        setMessage(await requestPermission())
      }
    })()
  }, [])

  return (
    <div>
      {message === 'error' ? (
        <button onClick={async () => setMessage(await requestPermission())}>
          click to enable orientation detect
        </button>
      ) : message === 'granted' ? (
        <SceneComponent />
      ) : message === 'denied' ? (
        <div>please allow orientation detect</div>
      ) : message === 'not supported' ? (
        <div>device orientation not supported</div>
      ) : (
        message
      )}
    </div>
  )
}
