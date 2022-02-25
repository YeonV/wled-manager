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

export default Power