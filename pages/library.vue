<template>
  <div>
    <li v-for="i in image" :key="i.id">
      <picture>
        <source :srcset="i.url" media="(min-width: 800px)" />
        <img :src="i.url_small" />
      </picture>
    </li>
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
  },
  methods: {
    fetchImages(opts) {
      this.images = this.$apollo
        .query({
          query: GET_IMAGES
        })
        .then((response) => console.log(response.json()))

      // return {
      //   total: images.total,
      //   data: images.items
      // }
    }
  }
}
</script>
