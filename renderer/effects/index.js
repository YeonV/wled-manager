export const effects = [
    'BladePower',
    'BladeWave (Test)',
    'BladeWaveBg (Test)',
]

const BladePower = ({ ampValues, pixel_count, color, bgColor, activeFb }) => activeFb > -1 ? Array(pixel_count)
    .fill([color.r, color.g, color.b])
    .fill([bgColor.r, bgColor.g, bgColor.b], parseInt(pixel_count * (ampValues[activeFb] / 256))) : null




const BladeWave = ({ ampValues, pixel_count, color, bgColor, activeFb }) => [...Array(pixel_count).keys()].map(v=>[(ampValues[v]/255)*color.r, (ampValues[v]/255)*color.g, (ampValues[v]/255)*color.b])

const BladeWaveBg = ({ ampValues, pixel_count, color, bgColor, activeFb }) => [...Array(pixel_count).keys()].map(v=>[((ampValues[v]/255)*color.r+bgColor.r)/2, ((ampValues[v]/255)*color.g+bgColor.g)/2, ((ampValues[v]/255)*color.b+bgColor.b)/2])


const Effect = ({type, config}) => {
    switch (type) {
        case 'BladePower':
            return BladePower(config)
    
        case 'BladeWave (Test)':
            return BladeWave(config)

        case 'BladeWaveBg (Test)':
            return BladeWaveBg(config)
    
        default:
            return BladePower(config)
    }
}

export default Effect