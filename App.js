import React, {Component, useRef} from 'react'
import {Button, StyleSheet, View} from 'react-native'
import {Camera, useCameraDevices} from "react-native-vision-camera"

export default class App extends Component {

  state = {ok: false}

  async componentDidMount() {
    if (await perm())
      this.setState({ok:true})
  }

  render() {
    if (!this.state.ok) return <View />
    return <VisionCamera />
  }

}
function VisionCamera() {
  const devices = useCameraDevices('wide-angle-camera')
  const camera = useRef(null)
  const device = devices.back

  if (device == null) return <View />

  return (
      [<Camera
        key={'camera'}
        style={StyleSheet.absoluteFill}
        ref={camera}
        device={device}
        isActive={true}
        photo={true}
        video={true}
        audio={true}
        enableZoomGesture={true}
      />,
        <Button
          key={'btn'}
          title='press me!'
          onPress={async () => {
            getVideo(camera)
          }}
          style={{position: 'absolute'}}
        />,
        <Button
          key={'btn2'}
          title='stop recording'
          onPress={async () => {
            await camera.current.stopRecording()
          }}
          style={{position: 'absolute'}}
        />
      ]
  )
}

async function focus(camera) {
  await camera.current.focus({ x: 220, y: 200 })
}

async function getVideo(camera) {
  camera.current.startRecording({
    flash: 'on',
    onRecordingFinished: (video) => console.log('vidos', video),
    onRecordingError: (error) => console.error(error),
  })
}

async function takePhoto(camera) {
  let start = Date.now()
  const photo = await camera.current.takePhoto({
    flash: 'on'
  })
  console.log('photo', photo, 'time:', (Date.now() - start) / 1000 )
}

async function perm() {
  const cameraPermission = await Camera.requestCameraPermission()
  const microphonePermission = await Camera.requestMicrophonePermission()
  return cameraPermission == 'authorized' && microphonePermission == 'authorized'
}
