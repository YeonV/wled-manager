export const effects = [
    'Power (Left FB)',
    'Wavelength (Range)',
    'WavelengthBg (Range)',
    'GradientStatic',
    'GradientRolling',
    'GradientAudio',
]

export const getGradientSteps = (colorStart,colorEnd,colorCount) => {
    let alpha = 0.0;  
    const color = [];    
    for (let i = 0; i < colorCount; i++) {
        var c = [];
        alpha += (1.0/colorCount);          
        c[0] = parseInt(colorStart[0] * alpha + (1 - alpha) * colorEnd[0]);
        c[1] = parseInt(colorStart[1] * alpha + (1 - alpha) * colorEnd[1]);
        c[2] = parseInt(colorStart[2] * alpha + (1 - alpha) * colorEnd[2]);  
        color.push(c);          
    }    
    return color;      
}

export const getMultipleGradientSteps = (colors, count) => {
    const output = []
    for (let i = 0; i < colors.length - 1; i++) {
        const gradient = getGradientSteps(
            colors[i], 
            colors[i+1], i === colors.length - 1 
                ? count - ((colors.length - 2) * Math.floor(count / (colors.length - 1)))
                : Math.floor(count / (colors.length - 1))
        )
        output.push(gradient)
    }
    return output.flat()
}

const Power = ({ ampValues, pixel_count, color, bgColor, activeFb, volume }) =>
    activeFb > -1
        ? Array(pixel_count)
            .fill([color.r, color.g, color.b])
            .fill(
                [bgColor.r, bgColor.g, bgColor.b],
                (ampValues[activeFb] - volume * 2.55) > 0
                    ? parseInt(pixel_count * ((ampValues[activeFb] - volume * 2.55) / 255))
                    : 0)
        : null


const GradientStatic = ({ ampValues, pixel_count, color, bgColor, activeFb, volume, timeStarted, gcolor }) => 
    getMultipleGradientSteps(gcolor.match(/rgb\([^()]*\)|#\w+/g).map(c=>c.match(/\d+/g)), pixel_count)

const GradientRolling = ({ ampValues, pixel_count, color, bgColor, activeFb, volume, timeStarted, gcolor }) => {       
    const tmp = getMultipleGradientSteps(gcolor.match(/rgb\([^()]*\)|#\w+/g).map(c=>c.match(/\d+/g)), pixel_count)
    let speed = 8
    const sliceA = tmp.slice(0,parseInt(((performance.now() - timeStarted)/speed) )% pixel_count)
    const sliceB = tmp.slice(parseInt(((performance.now() - timeStarted)/speed) )% pixel_count)
    return [...sliceB, ...sliceA]
}

const GradientAudio = ({ ampValues, pixel_count, color, bgColor, activeFb, volume, timeStarted, gcolor, lastShift, lastAudio }) => {
    // const a = gcolor.match(/rgb\([^()]*\)|#\w+/g).map(c=>c.match(/\d+/g))
    
    // console.log(a)
    
    let tmp = getMultipleGradientSteps(gcolor.match(/rgb\([^()]*\)|#\w+/g).map(c=>c.match(/\d+/g)), pixel_count)
    let audio = (ampValues[activeFb] - volume * 2.55) > 0
    let speed =  audio ? 64 : 512
    
    if (lastShift.current) {
        const slicePreA = tmp.slice(0,lastShift.current)
        const slicePreB = tmp.slice(lastShift.current)
        tmp = [...slicePreB, ...slicePreA]
        if (audio !== lastAudio.current) {
            timeStarted.current = performance.now()
            lastAudio.current = audio
        }
    }
    
    const shift = parseInt(((performance.now() - timeStarted.current)/speed) )% pixel_count
    // console.log(shift)
    const sliceA = tmp.slice(0,shift)
    const sliceB = tmp.slice(shift)
    lastShift.current = shift
    return [...sliceB, ...sliceA]
}

const Wavelength = ({ ampValues, pixel_count, color, bgColor, activeFb, activeRightFb, volume }) =>
    [...Array(pixel_count).keys()].map(v => [
        ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.r,
        ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.g,
        ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.b])

const WavelengthBg = ({ ampValues, pixel_count, color, bgColor, activeFb, activeRightFb, volume }) =>
    [...Array(pixel_count).keys()].map(v => [
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.r + bgColor.r) / 2,
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.g + bgColor.g) / 2,
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.b + bgColor.b) / 2])


const Effect = ({ type, config }) => {
    switch (type) {
        case 'Power (Left FB)':
            return Power(config)

        case 'Wavelength (Range)':
            return Wavelength(config)

        case 'WavelengthBg (Range)':
            return WavelengthBg(config)

        case 'GradientStatic':
            return GradientStatic(config)

        case 'GradientRolling':
            return GradientRolling(config)
            
        case 'GradientAudio':
            return GradientAudio(config)

        default:
            return Power(config)
    }
}

export default Effect