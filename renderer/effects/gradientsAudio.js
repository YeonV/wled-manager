import { getMultipleGradientSteps } from "./utils"

const GradientAudio = ({ ampValues, pixel_count, color, bgColor, activeFb, volume, timeStarted, gcolor, lastShift, lastAudio }) => {
    let tmp = getMultipleGradientSteps(gcolor.match(/rgb\([^()]*\)|#\w+/g).map(c=>c.match(/\d+/g)), pixel_count)
    let audio = (ampValues[activeFb] - volume * 2.55) > 0
    let speed =  audio ? 64 : 512
    
    // ToDo: Fix: speedChange produces jump in shift
    const shift = parseInt(((performance.now() - timeStarted.current)/speed) )% pixel_count

    if (lastShift.current && lastShift.current !== shift) {
        const slicePreA = tmp.slice(0,lastShift.current)
        const slicePreB = tmp.slice(lastShift.current)
        tmp = [...slicePreB, ...slicePreA]        
    }
    
    if (audio !== lastAudio.current) {
        timeStarted.current = performance.now()
        lastAudio.current = audio
        lastShift.current = shift
    } else {
        lastShift.current = 0
    }    
    console.log(shift)
    const sliceA = tmp.slice(0,shift)
    const sliceB = tmp.slice(shift)
    
    return [...sliceB, ...sliceA]
}

export default GradientAudio