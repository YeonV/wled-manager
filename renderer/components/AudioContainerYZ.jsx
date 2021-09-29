import React, { useState, useEffect, useRef } from 'react';
import VisualDemo from './Visualizer';
// import soundFile from '../audio/GummyBearz.mp3'
import { Button } from '@material-ui/core';




const AudioDataContainer = (props) => {

    const frequencyBandArray = [...Array(48).keys()]
    const [state, setState] = useState({})
    const [dataPlaying, setDataPlaying] = useState(false);
    const audioContextRef = useRef();

    let s

    useEffect(() => {
        const audioContext = new AudioContext();

        getMedia().then(stream => {
            if (!audioContext || audioContext.state === 'closed') {
                return
            }
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 4096;
            source.connect(analyser);
            setState({
                audioData: analyser
            })
            audioContextRef.current = audioContext;
            audioContext.suspend();
        })


        return () => source.disconnect(analyser);
    }, []);

    const toggleAnalyser = () => {
        if (dataPlaying) {
            audioContextRef.current.suspend();
        } else {
            audioContextRef.current.resume();
        }
        setDataPlaying((play) => !play);
    };

    const initializeAudioAnalyser = () => {
        if (audioContext) {

            getMedia().then(stream => {

                s = stream
                if (!audioContext || audioContext.state === 'closed') {
                    return
                }
                setActiveAudio(true)
                console.log(audioContext)
                const source = audioContext.createMediaStreamSource(stream);
                const analyser = audioContext.createAnalyser();
                analyser.fftSize = 4096;
                // source.connect(audioContext.destination);
                source.connect(analyser);
                console.log(analyser)
                setState({
                    audioData: analyser
                })
            })
        }

    }

    const getFrequencyData = (styleAdjuster) => {
        const bufferLength = state.audioData && state.audioData.frequencyBinCount;
        const amplitudeArray = new Uint8Array(bufferLength);
        state.audioData && state.audioData.getByteFrequencyData(amplitudeArray)
        styleAdjuster(amplitudeArray)
    }
    const getMedia = async () => {
        try {
            return await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            })
        } catch (err) {
            console.log('Error:', err)
        }
    }


    return (
        <div style={{ height: 255 }}>
            <button onClick={toggleAnalyser} data-playing={dataPlaying}>
                <span>{dataPlaying ? "Pause" : "Play"}</span>
            </button>
            <VisualDemo
                initializeAudioAnalyser={initializeAudioAnalyser}
                frequencyBandArray={frequencyBandArray}
                getFrequencyData={getFrequencyData}
                audioData={state.audioData}
                stop={() => {
                    console.log("Stopping")
                    if (audioContext) {
                        console.log("Stopping2")
                        s.getTracks().forEach(track => track.stop())
                        console.log("Stopping3")
                        audioContext.close()
                        console.log("Stopping4")
                    }
                    console.log("Stopping5")
                    setState({
                        audioData: null
                    })
                }}
            />
        </div>
    );

}

export default AudioDataContainer;
