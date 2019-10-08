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

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

      // sort image here

      context.putImageData(imageData, 0, 0)
    }
  }
}
</script>
