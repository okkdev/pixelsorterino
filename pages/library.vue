<template>
  <div class="flex justify-center flex-wrap">
    <div
      v-for="i in image"
      :key="i.id"
      class="p-3 my-2 mr-3 h-40 w-40 rounded-lg border-2 border-solid border-gray-300 bg-gray-200 lg:h-56 lg:w-56"
    >
      <picture>
        <source :srcset="i.url" media="(min-width: 800px)" />
        <img class="max-w-full max-h-full mx-auto" :src="i.url_small" />
      </picture>
    </div>
  </div>
</template>

<script>
// import { createResource, createInstance } from 'vuex-pagination'
import gpl from 'graphql-tag'

const GET_IMAGES = gpl`{
  image{
    url
    url_small
  }
}`

export default {
  // data() {
  //   return {
  //     images: null
  //   }
  // },
  // computed: {
  //   images: createInstance('images', {
  //     page: 1,
  //     pageSize: 10
  //   })
  // },
  // mounted() {
  // createResource('images', this.fetchImages, {
  //   prefetch: true
  // })
  // this.fetchImages(10)
  // },
  apollo: {
    image: {
      query: GET_IMAGES
    }
  }
}
</script>
