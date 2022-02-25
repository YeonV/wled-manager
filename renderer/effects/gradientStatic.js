import { getMultipleGradientSteps } from "./utils"

const GradientStatic = ({ ampValues, pixel_count, color, bgColor, activeFb, volume, timeStarted, gcolor }) => {
    getMultipleGradientSteps(gcolor.match(/rgb\([^()]*\)|#\w+/g).map(c=>c.match(/\d+/g)), pixel_count)
}

export default GradientStatic
