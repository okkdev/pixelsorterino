<template>
  <div>
    <FileSelector v-model="file"></FileSelector>

    <div v-if="file">
      <div
        class="p-3 my-2 rounded-lg border-2 border-solid border-gray-300 bg-gray-200"
      >
        <img v-if="!sortedImage" ref="sourceImage" :src="file" alt="source" />
        <img v-if="sortedImage" :src="sortedImage" />
      </div>

      <button
        class="button mr-2"
        :disabled="file === null || sortedImage !== null"
        @click="sort"
      >
        Sort
      </button>

      <button v-if="sortedImage !== null" class="button" @click="reset">
        Reset
      </button>
    </div>

    <canvas ref="canvas" style="display:none"></canvas>
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

      this.sortPixels(pixelArray).then(() => {
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
    reset() {
      this.sortedImage = null
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
