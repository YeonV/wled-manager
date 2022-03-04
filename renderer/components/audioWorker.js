const essentia = require('essentia.js');

addEventListener('message', e => {
  console.log(e.data);

  let audio = e.data.channelData[0];
  let inputSignalVector = essentia.arrayToVector(audio);
  let key = essentia.KeyExtractor(inputSignalVector);
  let bpm = essentia.RhythmExtractor(inputSignalVector);

  let data = {
    bpm : bpm.bpm, 
    key : key.key,
    scale : key.scale
  }

  postMessage(data);

});