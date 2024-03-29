/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const getGradientSteps = (colorStart, colorEnd, colorCount) => {
  let alpha = 0.0
  const color = [] as any[]
  for (let i = 0; i < colorCount; i++) {
    const c = [] as any[]
    alpha += 1.0 / colorCount
    c[0] = colorStart[0] * alpha + (1 - alpha) * colorEnd[0]
    c[1] = colorStart[1] * alpha + (1 - alpha) * colorEnd[1]
    c[2] = colorStart[2] * alpha + (1 - alpha) * colorEnd[2]
    color.push(c)
  }
  return color
}

export const getMultipleGradientSteps = (colors, count) => {
  const output = [] as any[]
  for (let i = 0; i < colors.length - 2; i++) {
    const gradient = getGradientSteps(
      colors[i + 1],
      colors[i],
      i === colors.length - 1
        ? count - (colors.length - 2) * Math.floor(count / (colors.length - 1))
        : Math.floor(count / (colors.length - 1))
    )
    output.push(gradient)
  }
  return output.flat()
}

export const getMultipleGradientStepsInverted = (colors, count) => {
  const output = [] as any[]
  for (let i = 0; i < colors.length - 2; i++) {
    const gradient = getGradientSteps(
      colors[i],
      colors[i + 1],
      i === colors.length - 1
        ? count - (colors.length - 2) * Math.floor(count / (colors.length - 1))
        : Math.floor(count / (colors.length - 1))
    )
    output.push(gradient)
  }
  return output.flat()
}
