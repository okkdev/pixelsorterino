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

      <button v-if="sortedImage === null" class="button mr-2" @click="sort">
        Sort
      </button>

      <button
        v-if="sortedImage !== null"
        class="button mr-2"
        @click="uploadAction"
      >
        Upload
      </button>

      <button v-if="sortedImage !== null" class="button" @click="reset">
        Back
      </button>
    </div>

    <canvas ref="canvas" style="display:none"></canvas>
    <canvas ref="canvasSmall" style="display:none"></canvas>
  </div>
</template>

<script>
import gql from 'graphql-tag'

import FileSelector from '~/components/FileSelector'

const UPLOAD_IMAGE = gql`
  mutation insert_image($url: String!, $urlSmall: String!) {
    insert_image(objects: { url: $url, url_small: $urlSmall }) {
      affected_rows
    }
  }
`

export default {
  components: {
    FileSelector
  },
  data() {
    return {
      file: null,
      image: null,
      sortedImage: null,
      sortedImageSmall: null,
      imageURL: null,
      imageURLsmall: null,
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

      this.image = this.$refs.sourceImage

      const cv = this.$refs.canvas
      const cx = cv.getContext('2d')
      cv.width = this.image.naturalWidth
      cv.height = this.image.naturalHeight

      cx.drawImage(this.image, 0, 0)

      const imageData = cx.getImageData(0, 0, cv.width, cv.height)

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
    sortSmall() {
      return new Promise((resolve) => {
        if (this.image.naturalWidth > 1000 || this.image.naturalHeight > 1000) {
          const cvs = this.$refs.canvasSmall
          const cxs = cvs.getContext('2d')

          cvs.width = Math.round(this.image.naturalWidth / 2)
          cvs.height = Math.round(this.image.naturalHeight / 2)

          cxs.drawImage(this.image, 0, 0, cvs.width, cvs.height)

          const imageDataSmall = cxs.getImageData(0, 0, cvs.width, cvs.height)

          this.imageWorker.postMessage(imageDataSmall)
          this.imageWorker.onmessage = ({ data: sortedImageDataSmall }) => {
            cxs.putImageData(sortedImageDataSmall, 0, 0)

            this.sortedImageSmall = cvs.toDataURL()
            resolve()
          }
        }
      })
    },
    reset() {
      this.sortedImage = null
      this.sortedImageSmall = null
    },
    dataURLtoBlob(dataurl) {
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    async uploadAction() {
      this.$toast.show('Uploading...', {
        type: 'info',
        position: 'top-center'
      })

      this.imageURL = await this.upload(this.sortedImage)

      this.sortSmall().then(async () => {
        if (this.sortedImageSmall !== null) {
          this.imageURLsmall = await this.upload(this.sortedImageSmall)
        }
      })

      this.pushToDB()

      this.$toast.clear()
      this.$toast.show('Success!', {
        type: 'success',
        position: 'top-center',
        duration: 1000
      })
    },
    upload(image) {
      return new Promise((resolve) => {
        const file = this.dataURLtoBlob(image)
        const data = new FormData()
        data.append('reqtype', 'fileupload')
        data.append('userhash', '')
        data.append('fileToUpload', file)

        const config = {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
        this.$axios
          .post(
            'https://cors-anywhere.herokuapp.com/https://catbox.moe/user/api.php',
            data,
            config
          )
          .then((response) => {
            resolve(response.data)
          })
      })
    },
    pushToDB() {
      return new Promise((resolve) => {
        if (this.imageURLsmall === null) {
          this.imageURLsmall = this.imageURL
        }
        this.$apollo
          .mutate({
            mutation: UPLOAD_IMAGE,
            variables: {
              url: this.imageURL,
              urlSmall: this.imageURLsmall
            }
          })
          .then((response) => {
            resolve()
          })
      })
    }
  }
}
</script>
