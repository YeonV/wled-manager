import { getMultipleGradientSteps } from "./utils"

const GradientRolling = ({ ampValues, pixel_count, color, bgColor, activeFb, volume, timeStarted, gcolor }) => {   
    const tmp = getMultipleGradientSteps(gcolor.match(/rgb\([^()]*\)|#\w+/g).map(c=>c.match(/\d+/g)), pixel_count)
    let speed = 8

    const sliceA = tmp.slice(0,parseInt(((performance.now() - timeStarted.current)/speed) )% pixel_count)
    const sliceB = tmp.slice(parseInt(((performance.now() - timeStarted.current)/speed) )% pixel_count)
    return [...sliceB, ...sliceA]
}

export default GradientRolling
