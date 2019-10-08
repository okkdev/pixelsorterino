<template>
  <input type="file" accept="image/*" @change="handleFileChange" />
</template>

<script>
export default {
  methods: {
    handleFileChange(e) {
      const reader = new FileReader()
      reader.onload = (ev) => this.$emit('input', ev.target.result)
      reader.readAsDataURL(e.target.files[0])
    }
  }
}
</script>
