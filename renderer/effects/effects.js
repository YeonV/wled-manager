export const effects = [
    'BladePower (Left FB)',
    'BladeWave (Range)',
    'BladeWaveBg (Range)',
]

const BladePower = ({ ampValues, pixel_count, color, bgColor, activeFb, volume }) =>
    activeFb > -1
        ? Array(pixel_count)
            .fill([color.r, color.g, color.b])
            .fill(
                [bgColor.r, bgColor.g, bgColor.b],
                (ampValues[activeFb] - volume * 2.55) > 0
                    ? parseInt(pixel_count * ((ampValues[activeFb] - volume * 2.55) / 255))
                    : 0)
        : null

const BladeWave = ({ ampValues, pixel_count, color, bgColor, activeFb, activeRightFb, volume }) =>
    [...Array(pixel_count).keys()].map(v => [
        ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.r,
        ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.g,
        ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.b])

const BladeWaveBg = ({ ampValues, pixel_count, color, bgColor, activeFb, activeRightFb, volume }) =>
    [...Array(pixel_count).keys()].map(v => [
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.r + bgColor.r) / 2,
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.g + bgColor.g) / 2,
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.b + bgColor.b) / 2])


const Effect = ({ type, config }) => {
    switch (type) {
        case 'BladePower (Left FB)':
            return BladePower(config)

        case 'BladeWave (Range)':
            return BladeWave(config)

        case 'BladeWaveBg (Range)':
            return BladeWaveBg(config)

        default:
            return BladePower(config)
    }
}

export default Effect