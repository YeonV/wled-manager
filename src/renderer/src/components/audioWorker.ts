const essentia = require('essentia.js')

addEventListener('message', (e) => {
  console.log(e.data)

  const audio = e.data.channelData[0]
  const inputSignalVector = essentia.arrayToVector(audio)
  const key = essentia.KeyExtractor(inputSignalVector)
  const bpm = essentia.RhythmExtractor(inputSignalVector)

  const data = {
    bpm: bpm.bpm,
    key: key.key,
    scale: key.scale
  }

  postMessage(data)
})
