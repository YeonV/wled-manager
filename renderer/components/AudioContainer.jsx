import React from 'react';
import VisualDemo from './Visualizer';
import { Button } from '@material-ui/core';

var theStream
var theSource
var theAnalyser
var theGain

class AudioDataContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.frequencyBandArray = [...Array(48).keys()]
    }

    initializeAudioAnalyser = () => {
        const audioContext = new AudioContext();
        this.getMedia().then(stream => {
            theStream = stream
            if (!audioContext || audioContext.state === 'closed') {
                return
            }
            const source = audioContext.createMediaStreamSource(stream);
            theSource = source
            const analyser = audioContext.createAnalyser();
            theAnalyser = analyser
            analyser.fftSize = 4096;
            // source.connect(audioContext.destination);
            const gain = audioContext.createGain()
            theGain = gain.gain
            source.connect(gain)
            gain.connect(analyser)
            this.setState({
                audioData: analyser
            })
        })
    }

    getFrequencyData = (styleAdjuster) => {
        const bufferLength = this.state.audioData && this.state.audioData.frequencyBinCount;
        const amplitudeArray = new Uint8Array(bufferLength);
        this.state.audioData && this.state.audioData.getByteFrequencyData(amplitudeArray)
        styleAdjuster(amplitudeArray)
    }
    getMedia = async () => {
        try {
            return await navigator.mediaDevices.getUserMedia({
                // waiting for state-management
                // audio: navigator.mediaDevices.enumerateDevices()
                // .then(function (devices) {
                //   (clientDevice === null || devices.indexOf(clientDevice === -1)) ? true : { deviceId: { exact: clientDevice } }
                // }),
                audio: true,
                video: false,
            })
        } catch (err) {
            console.log('Error:', err)
        }
    }
    render() {

        return (
            <div style={{ height: 255 }}>
                <VisualDemo
                    initializeAudioAnalyser={this.initializeAudioAnalyser}
                    frequencyBandArray={this.frequencyBandArray}
                    getFrequencyData={this.getFrequencyData}
                    stop={() => {
                        theGain.value = 0
                        setTimeout(() => {
                            theStream.getTracks().forEach(track => track.stop())
                            this.setState({
                                audioData: null
                            })
                        }, 1000);

                    }}
                />
            </div>
        );
    }
}

export default AudioDataContainer;
