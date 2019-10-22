<template>
  <div>
    <input
      type="file"
      class="border-4 border-dashed border-teal-500 rounded-lg p-4 my-3 w-full text-center"
      accept="image/jpeg, image/png, image/gif"
      @change="handleFileChange"
      @drop="handleFileChange"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleFileChange(e) {
      let file = null

      if (!e.target.files[0]) {
        file = e.dataTransfer.files[0]
      } else {
        file = e.target.files[0]
      }

      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
      ) {
        // smaller than 20mb
        if (file.size < 20000000) {
          const reader = new FileReader()

          reader.onload = (ev) => {
            const img = new Image()

            img.onload = () => {
              if (img.width > 2000 || img.height > 2000) {
                this.$toast.show('Image too large!')
              } else {
                this.$emit('input', reader.result)
              }
            }

            img.src = reader.result
          }

          reader.readAsDataURL(file)
        } else {
          this.$toast.show('Image size too big!')
        }
      } else {
        this.$toast.show('File type not supported!')
      }
    }
  }
}
</script>
