const partArray = (arr, size) => {
  const res = []
  for (let i = 0; i < arr.length; i = i + size) res.push(arr.slice(i, i + size))
  return res
}

const rgbToHsv = (rgb) => {
  const r = rgb[0] / 255
  const g = rgb[1] / 255
  const b = rgb[2] / 255

  let h = 0
  let s = 0
  let v = 0

  const minRGB = Math.min(r, Math.min(g, b))
  const maxRGB = Math.max(r, Math.max(g, b))

  if (minRGB === maxRGB) {
    v = minRGB
    return [0, 0, v]
  }

  const x = r === minRGB ? g - b : b === minRGB ? r - g : b - r
  const y = r === minRGB ? 3 : b === minRGB ? 1 : 5
  h = 60 * (y - x / (maxRGB - minRGB))
  s = (maxRGB - minRGB) / maxRGB
  v = maxRGB

  return [h, s, v]
}

onmessage = ({ data: { imageData, sortColor } }) => {
  let arr = []

  const pixelArray = partArray(Array.from(imageData.data), 4)

  if (sortColor === '3') {
    // Sort by hue
    arr = pixelArray
      .map((c, i) => ({ color: rgbToHsv(c), index: i }))
      .sort((a, b) => b.color[0] - a.color[0])
      .map((data) => pixelArray[data.index])
  } else {
    arr = pixelArray.sort((a, b) => a[sortColor] - b[sortColor])
  }

  // big brain hack to avoid Array.flat (bloody mobile browsers...)
  const sortedPixelArray = (arr + '').split(',')

  const sortedImageData = new ImageData(
    new Uint8ClampedArray(sortedPixelArray),
    imageData.width,
    imageData.height
  )

  postMessage(sortedImageData)
}
