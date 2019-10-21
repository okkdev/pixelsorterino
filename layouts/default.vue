<template>
  <div>
    <Navbar></Navbar>
    <div class="container mx-auto">
      <nuxt />
    </div>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'

export default {
  components: {
    Navbar
  }
}
</script>

<style></style>
