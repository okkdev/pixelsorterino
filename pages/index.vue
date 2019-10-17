<template>
  <div class="container mx-auto">
    <div>
      <h1 class="title">
        pixelsorterino
      </h1>

      <FileSelector v-model="file"></FileSelector>
      <button
        class="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
        :disabled="file === null"
        @click="sort"
      >
        Sort
      </button>

      <img v-if="file" ref="sourceImage" :src="file" alt="source" />

      <canvas ref="canvas" style="display:none"></canvas>
      <img v-if="sortedImage" :src="sortedImage" />
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
      file: null,
      sortedImage: null
    }
  },
  methods: {
    sort() {
      const image = this.$refs.sourceImage
      const cv = this.$refs.canvas
      const cx = cv.getContext('2d')

      cv.width = image.naturalWidth
      cv.height = image.naturalHeight

      cx.drawImage(image, 0, 0)

      const imageData = cx.getImageData(
        0,
        0,
        image.naturalWidth,
        image.naturalHeight
      )

      let pixelArray = this.partArray(Array.from(imageData.data), 4)

      const sortPixels = () => {
        // // Sort by hue
        // const sortedPixelArray = pixelArray
        //   .map((c, i) => ({ color: this.rgbToHsl(c), index: i }))
        //   .sort((a, b) => b.color[0] - a.color[0])
        //   .map((data) => pixelArray[data.index])
        return new Promise((resolve) => {
          resolve(pixelArray.sort((a, b) => a[0] - b[0]))
        })
      }

      sortPixels().then(() => {
        // big brain hack to avoid Array.flat (bloody mobile browsers...)
        pixelArray = pixelArray + ''
        pixelArray = pixelArray.split(',')

        const sortedImageData = new ImageData(
          new Uint8ClampedArray(pixelArray),
          imageData.width,
          imageData.height
        )

        cx.putImageData(sortedImageData, 0, 0)

        this.sortedImage = cv.toDataURL()
      })
    },
    sortPixels(arr) {
      return new Promise((resolve) => {
        // // Sort by hue
        // const sortedPixelArray = pixelArray
        //   .map((c, i) => ({ color: this.rgbToHsl(c), index: i }))
        //   .sort((a, b) => b.color[0] - a.color[0])
        //   .map((data) => pixelArray[data.index])

        arr.sort((a, b) => a[0] - b[0])
        resolve('sorted')
      })
    },
    partArray(arr, size) {
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
