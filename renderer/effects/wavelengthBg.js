const WavelengthBg = ({ ampValues, pixel_count, color, bgColor, activeFb, activeRightFb, volume }) =>
    [...Array(pixel_count).keys()].map(v => [
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.r + bgColor.r) / 2,
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.g + bgColor.g) / 2,
        (((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.b + bgColor.b) / 2])

export default WavelengthBg