<template>

    <b-container class="page">
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <a class="nav-link active" href="#">Active</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
            </li>
            <li class="nav-item">
                <a class="nav-link disabled" href="#">Disabled</a>
            </li>
        </ul>
    </b-container>
    <ul v-if="errors && errors.length">
        <li v-for="error of errors">
            {{error.message}}
        </li>
    </ul>

</template>

<script>
  import axios from 'axios';

  export default {
    data: () => ({
      albums: [],
      errors: []
    }),

    // Fetches albums when the component is created.
    async created() {
      try {
        const response = await axios.get(`http://music.zwartschaap.net.dev/api/albums`)
        this.albums = response.data
      } catch (e) {
        this.errors.push(e)
      }
    }
  }
</script>
<style>
    .md-card .md-card-media img {
        height:auto;
    }
</style>
