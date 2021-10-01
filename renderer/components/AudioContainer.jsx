import React from 'react';
import VisualDemo from './Visualizer';

class AudioDataContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.frequencyBandArray = [...Array(48).keys()]
    }

    audioContext = new AudioContext();
    theGain = null
    theStream = null

    initializeAudioAnalyser = () => {
        this.getMedia(this.props.audioDeviceId).then(stream => {
            this.theStream = stream
            if (!this.audioContext || this.audioContext.state === 'closed') {
                return
            }
            const source = this.audioContext.createMediaStreamSource(stream);
            const analyser = this.audioContext.createAnalyser();
            analyser.fftSize = 4096;
            const gain = this.audioContext.createGain()
            this.theGain = gain.gain
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
    getMedia = async (clientDevice) => {
        const ad = await navigator.mediaDevices.enumerateDevices()
            .then((devices) => !!(clientDevice !== null && devices.find(d => d.deviceId === clientDevice))
                ? clientDevice
                : null)
        if (ad) {
            try {
                return await navigator.mediaDevices.getUserMedia({
                    audio: { deviceId: { exact: ad } },
                    video: false,
                })
            } catch (err) {
                console.log('Error:', err)
            }
        } else {
            try {
                return await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                })
            } catch (err) {
                console.log('Error:', err)
            }
        }
    }
    render() {

        return (
            <div style={{ height: 255 }}>
                <VisualDemo
                    initializeAudioAnalyser={this.initializeAudioAnalyser}
                    audioContext={this.audioContext}
                    frequencyBandArray={this.frequencyBandArray}
                    getFrequencyData={this.getFrequencyData}
                    stop={() => {
                        if (this.audioContext && this.audioContext.state === 'running') {
                            if (this.theGain) {
                                this.theGain.value = 0
                            }
                            setTimeout(() => {
                                this.audioContext.state !== 'closed' && this.theStream && this.theStream.getTracks().forEach(track => track.stop())
                                this.audioContext && this.audioContext.state !== 'closed' && this.audioContext.suspend()
                                this.audioContext && this.audioContext.state !== 'closed' && this.audioContext.resume()
                                this.setState({
                                    audioData: null
                                })
                            }, 1000)
                        }
                    }}
                />
            </div>
        );
    }
}

export default AudioDataContainer;
