import React, { useState, useRef, useEffect } from 'react';
import Visualizer from './Visualizer';
// const aubio = require('../../../aubiojs')
// import Essentia from './essentia.js-core.es.js';
// // import essentia-wasm-module
// import { EssentiaWASM } from './essentia-wasm.es.js';

// create essentia object with all the methods to run various algorithms
// by loading the wasm back-end.
// here, `EssentiaModule` is an emscripten module object imported to the global namespace



const AudioDataContainer = ({ audioDeviceId, fft, bandCount, drawerBottomHeight }) => {
  const [frequencyBandArray] = useState([...Array(bandCount).keys()]);
  const audioData = useRef(null);
  const audioContext = useRef(new AudioContext());
  const theStream = useRef(null);
  const theGain = useRef(null);

  // const theTempo = useRef(null);
  // const theAubio = useRef(null);

  const initializeAudioAnalyser = () => {
    getMedia(audioDeviceId).then((stream) => {
      stream.current = stream;
      if (!audioContext.current || audioContext.current.state === 'closed') {
        return;
      }
      const source = audioContext.current.createMediaStreamSource(stream);
      const analyser = audioContext.current.createAnalyser();

      // const audioBuffer = audioContext.current.createBuffer(1, 1024, audioContext.current.sampleRate);
      // let esPkg = require('essentia.js');

      // let essentia = new esPkg.Essentia(esPkg.EssentiaWASM);
      // const inputSignalVector = essentia.arrayToVector(audioBuffer.getChannelData(0));
      // let outputRG = essentia.ReplayGain(inputSignalVector, // input
      //   44100); // sampleRate (parameter optional)


      // console.log(outputRG.replayGain);

      // const scriptProcessor = audioContext.current.createScriptProcessor(
      //   1024,
      //   1,
      //   1
      // );
      // const buf = audioContext.current.createBuffer(1, 1024, audioCtx.sampleRate);
      // if (theTempo.current) {
      //   if (theTempo.current.do(buf.getChannelData(0))) {
      //     console.log('confidence', theTempo.current.getConfidence());
      //     beat(theTempo.current.getBpm());
      //   }
      // }
      // console.log("WTF0", scriptProcessor)
      // scriptProcessor.onaudioprocess = (event) => {
      //   console.log("WTF", event)
      //   if (theTempo.current) {
      //     if (theTempo.current.do(event.inputBuffer.getChannelData(0))) {
      //       console.log('confidence', theTempo.current.getConfidence());
      //       beat(theTempo.current.getBpm());
      //     }
      //   }
      // scriptProcessor.addEventListener('audioprocess', function (event) {
      //   console.log("WTF", event)
      //   if (theTempo.current) {
      //     if (theTempo.current.do(event.inputBuffer.getChannelData(0))) {
      //       console.log('confidence', theTempo.current.getConfidence());
      //       beat(theTempo.current.getBpm());
      //     }
      //   }
      // }
      // );
      // }

      
      analyser.fftSize = fft;
      const gain = audioContext.current.createGain();
      theGain.current = gain.gain;
      source.connect(gain);
      gain.connect(analyser);
      // source.connect(scriptProcessor);
      audioData.current = analyser;
    });
  };

  const getFrequencyData = (styleAdjuster) => {
    if (!audioData.current) {
      return;
    }
    // const worker = new Worker('./audioWorker.js', { type: 'module' });
    // await worker.postMessage(audioData.current);

    // worker.onmessage = ({ data }) => {
    //     console.log(`page got message: ${data}`);      
    // };
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

  // useEffect(() => {
  //   const init = async () => {
  //     const { Tempo } = await aubio();
  //     const tempo = new Tempo(4096, 1024, audioContext.current.sampleRate);
  //     theTempo.current = tempo;
  //   };
  //   init();
  // }, []);

  // useEffect(() => {
  //     console.log("YZ2", theTempo.current)
  //     const audioBuffer = audioContext.current.createBuffer(1, 1024, audioContext.current.sampleRate);
  //     theTempo.current && theTempo.current.do(audioBuffer);
  //     const bpm = theTempo.current && theTempo.current.getBpm();
  //     console.log(bpm)
  // }, [theTempo.current, audioContext.current]);
  return (
    <div style={{ height: 255, position: 'relative', top: drawerBottomHeight === 800 ? 390 : 0 }}>
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
