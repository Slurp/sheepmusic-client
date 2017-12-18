<template>
    <article>
        <h1>Search results for {{ query }}</h1>
        <h2>Albums</h2>
        <transition-group name="list" tag="div" class="list" v-if="albums">
            <div class="col" v-for="album in albums" :key="album.id" :name="album.id">
                <album :album-id=album.id :album=album></album>
            </div>
        </transition-group>
        <h2>Artists</h2>
        <transition-group name="list" tag="div" class="list" v-if="artists">
            <div class="col" v-for="artist in artists" :key="artist.id" :name="artist.id">
                <artist :artist-id=artist.id :artist=artist></artist>
            </div>
        </transition-group>
    </article>
</template>

<script>
  import album from 'components/albums/album'
  import artist from 'components/artists/artist'

  export default {
    name: 'search-results',
    props: ['query'],
    components: {
      album,
      artist
    },
    data () {
      return {
        results: null
      }
    },
    created () {
      this.search()
    },
    watch: {
      query (newQuery, oldQuery) {
        if (newQuery !== oldQuery) {
          this.search()
        }
      }
    },
    methods: {
      search () {
        this.axios.get(`app_dev.php/api/search/` + this.query).then((response) => {
          this.results = response.data
        }, (err) => {
          console.log(err)
        })
      }
    },
    computed: {
      searchResults () {
        if (this.results) {
          return this.results
        }
        return null
      },
      albums () {
        if (this.searchResults) {
          return this.$store.getters['albums/search'](this.searchResults.albums)
        }
        return null
      },
      artists () {
        if (this.searchResults) {
          return this.$store.getters['artists/search'](this.searchResults.artists)
        }
        return null
      }
    }
  }
</script>

<style>
</style>
