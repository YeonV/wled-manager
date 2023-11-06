/* eslint-disable @typescript-eslint/explicit-function-return-type */
const Wavelength = ({ ampValues, pixel_count, color, activeFb, activeRightFb, volume }) =>
  [...Array(pixel_count).keys()].map((v) => [
    ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.r,
    ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.g,
    ((ampValues.slice(activeFb, activeRightFb + 1)[v] - volume * 2.55) / 255) * color.b
  ])

export default Wavelength
