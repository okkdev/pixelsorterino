<template>
  <div>
    <FileSelector v-if="!sortedImage" v-model="file"></FileSelector>

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
        Back
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
      sortedImage: null,
      imageWorker: null
    }
  },
  mounted() {
    this.imageWorker = new Worker('/workers/image_worker.js')
  },
  beforeDestroy() {
    this.imageWorker.terminate()
  },
  methods: {
    sort() {
      this.$toast.show('Sorting...', {
        type: 'info',
        position: 'top-center'
      })

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

      this.imageWorker.postMessage(imageData)
      this.imageWorker.onmessage = ({ data: sortedImageData }) => {
        cx.putImageData(sortedImageData, 0, 0)

        this.sortedImage = cv.toDataURL()

        this.$toast.clear()
        this.$toast.show('Success!', {
          type: 'success',
          position: 'top-center',
          duration: 1000
        })
      }
    },
    reset() {
      this.sortedImage = null
    }
  }
}
</script>
