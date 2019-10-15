<template>
  <div class="container">
    <div>
      <h1 class="title">
        pixelsorterino
      </h1>

      <img id="SourceImage" :src="file" alt="source" />
      <canvas id="Canvas"></canvas>

      <FileSelector v-model="file"></FileSelector>
      <button @click="sort">Sort</button>
    </div>
  </div>
</template>

<script>
import FileSelector from '~/components/FileSelector'

export default {
  components: {
    FileSelector
  },
  data() {
    return {
      file: null
    }
  },
  methods: {
    sort() {
      // eslint-disable-next-line
      console.log(this.file)

      const image = document.getElementById('SourceImage')
      const canvas = document.getElementById('Canvas')
      const context = canvas.getContext('2d')

      canvas.width = image.width
      canvas.height = image.height

      context.drawImage(image, 0, 0)

      const imageData = context.getImageData(0, 0, image.width, image.height)

      const pixelArray = this.spliceArray(
        Array.from(imageData.data).flat(Infinity),
        4
      )

      // const sortedPixelArray = pixelArray
      //   .map((c, i) => ({ color: this.rgbToHsl(c), index: i }))
      //   .sort((a, b) => b.color[0] - a.color[0])
      //   .map((data) => pixelArray[data.index])

      const sortedPixelArray = pixelArray.sort((a, b) => a[0] > b[0])

      const sortedImage = new ImageData(
        new Uint8ClampedArray(sortedPixelArray.flat(Infinity)),
        imageData.width,
        imageData.height
      )

      context.putImageData(sortedImage, 0, 0)
    },
    spliceArray(arr, size) {
      const res = []
      for (let i = 0; i < arr.length; i = i + size)
        res.push(arr.slice(i, i + size))
      return res
    },
    rgbToHsl(rgb) {
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
  }
}
</script>
