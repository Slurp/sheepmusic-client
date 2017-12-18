<template>
    <form class="form-inline ml-auto form-search" v-on:submit.prevent="search()">
        <input class="form-control mr-sm-2" name="query" type="text" v-model="query" placeholder="Search">
        <button class="btn btn-sm btn-outline-secondary my-2 my-sm-0" type="submit">Search</button>
    </form>
</template>

<script>
  export default {
    name: 'search',
    data () {
      return {
        query: null,
        error: null
      }
    },
    methods: {
      search () {
        console.log(this.query)
        this.$router.push({ name: 'search_results', params: { query: this.query }})

      }
    },
  }
</script>

<style>
.form-search {
    background: white;
}
</style>
