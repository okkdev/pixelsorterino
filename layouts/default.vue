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

<style>
.button {
  @apply px-3 py-2 font-medium text-center bg-gray-300 rounded-lg text-gray-900;
}

.button:hover {
  @apply bg-gray-400;
}

.button:focus {
  @apply outline-none bg-gray-400;
}

.button:disabled {
  @apply opacity-50;
}
</style>
