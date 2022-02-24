import React, { useState, useRef } from 'react';
import Visualizer from './Visualizer';

const AudioDataContainer = ({ audioDeviceId, fft, bandCount }) => {
  const [frequencyBandArray] = useState([...Array(bandCount).keys()]);
  const audioData = useRef(null);
  const audioContext = useRef(new AudioContext());
  const theStream = useRef(null);
  const theGain = useRef(null);

  const initializeAudioAnalyser = () => {
    getMedia(audioDeviceId).then((stream) => {
      stream.current = stream;
      if (!audioContext.current || audioContext.current.state === 'closed') {
        return;
      }
      const source = audioContext.current.createMediaStreamSource(stream);
      const analyser = audioContext.current.createAnalyser();
      analyser.fftSize = fft;
      const gain = audioContext.current.createGain();
      theGain.current = gain.gain;
      source.connect(gain);
      gain.connect(analyser);
      audioData.current = analyser;
    });
  };

  const getFrequencyData = (styleAdjuster) => {
    if (!audioData.current) {
      return;
    }
    const bufferLength = audioData.current.frequencyBinCount;
    const amplitudeArray = new Uint8Array(bufferLength);

    audioData.current.getByteFrequencyData(amplitudeArray);
    styleAdjuster(amplitudeArray);
  };

  const getMedia = async (clientDevice) => {
    const ad = await navigator.mediaDevices
      .enumerateDevices()
      .then((devices) =>
        !!(
          clientDevice !== null &&
          devices.find((d) => d.deviceId === clientDevice)
        )
          ? clientDevice
          : null
      );
    if (ad) {
      try {
        return await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: ad } },
          video: false,
        });
      } catch (err) {
        console.log('Error:', err);
      }
    } else {
      try {
        return await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      } catch (err) {
        console.log('Error:', err);
      }
    }
  };

  return (
    <div style={{ height: 255, position: 'relative' }}>
      <Visualizer
        fft={fft}
        bandCount={bandCount}
        key={bandCount}
        initializeAudioAnalyser={initializeAudioAnalyser}
        audioContext={audioContext.current}
        frequencyBandArray={frequencyBandArray}
        getFrequencyData={getFrequencyData}
        refresh={() => {
          if (
            audioContext.current &&
            audioContext.current.state === 'running'
          ) {
            audioContext.current.state !== 'closed' &&
              theStream.current &&
              theStream.current.getTracks().forEach((track) => track.stop());

            audioContext.current.state !== 'closed' &&
              audioContext.current.suspend();

            audioContext.current.state !== 'closed' &&
              audioContext.current.resume();
            audioData.current = null;
          }
        }}
        stop={() => {
          if (
            audioContext.current &&
            audioContext.current.state === 'running'
          ) {
            if (theGain.current) {
              theGain.current.value = 0;
            }
            setTimeout(() => {
              if (audioContext.current) {
                audioContext.current.state !== 'closed' &&
                  theStream.current &&
                  theStream.current
                    .getTracks()
                    .forEach((track) => track.stop());

                audioContext.current.state !== 'closed' &&
                  audioContext.current.suspend();

                audioContext.current.state !== 'closed' &&
                  audioContext.current.resume();

                audioData.current = null;
              }
            }, 800);
          }
        }}
      />
    </div>
  );
};

export default AudioDataContainer;
