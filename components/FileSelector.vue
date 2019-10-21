<template>
  <div>
    <input
      type="file"
      class="border-4 border-dashed border-teal-500 rounded-lg p-4 my-3 w-full text-center"
      accept="image/jpeg, image/png, image/gif"
      @change="handleFileChange"
      @drop="dropFile"
    />
  </div>
</template>

<script>
export default {
  methods: {
    handleFileChange(e) {
      const reader = new FileReader()
      reader.onload = (ev) => this.$emit('input', ev.target.result)
      reader.readAsDataURL(e.target.files[0])
    },
    dropFile(e) {
      const reader = new FileReader()
      reader.onload = (ev) => this.$emit('input', ev.target.result)
      reader.readAsDataURL(e.dataTransfer.files[0])
    }
  }
}
</script>
