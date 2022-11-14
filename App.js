import React, {Component, useRef} from 'react'
import {Alert, Button, StyleSheet, View} from 'react-native'
import {
  Camera,
  useCameraDevices,
  useFrameProcessor
} from "react-native-vision-camera"
import {scanOCR} from "vision-camera-ocr"
//import { labelImage } from "vision-camera-image-labeler";
import 'react-native-reanimated'


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
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const scannedOcr = scanOCR(frame)
    console.log('scanned', scannedOcr)
  }, [])
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
        onInitialized={() => console.log('initialized')}
        frameProcessor={frameProcessor}
      />,
        <Button
          key={'btn'}
          title='press me!'
          onPress={async () => {
            takePhoto(camera)
          }}
          style={{position: 'absolute'}}
        />,
        /*<Button
          key={'btn2'}
          title='stop recording'
          onPress={async () => {
            await camera.current.stopRecording()
          }}
          style={{position: 'absolute'}}
        />*/
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
  Alert.alert(`photo time: ${(Date.now() - start) / 1000 }`)
}

async function perm() {
  const cameraPermission = await Camera.requestCameraPermission()
  const microphonePermission = await Camera.requestMicrophonePermission()
  return cameraPermission == 'authorized' && microphonePermission == 'authorized'
}
