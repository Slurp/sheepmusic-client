<template>
    <div class="genre-detail" :id="genre.id" v-if="genre && genre.songs">
        <breadcrumbs></breadcrumbs>
        <div class="album-backdrop backdrop" v-bind:style="{ 'background-image': 'url(' + cover + ')' }">
            <div class="info-bar album media">
                <img class="info-bar-image" :src="cover"/>
                <div class="info-bar-content media-body">
                    <div class="info-bar-content__header">
                        <h1 class="album-name">{{ genre.name }}</h1>
                        <play_btn :genre=genre></play_btn>
                        <queue_btn :genre=genre></queue_btn>
                    </div>
                </div>
            </div>
        </div>
        <song-list :songs="genre.songs"></song-list>
    </div>
</template>

<script>
  import config from 'config/index'
  import songList from 'components/songs/list'
  import breadcrumbs from 'components/misc/breadcrumbs'
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'

  export default {
    name: 'genre-detail',
    components: {
      songList,
      breadcrumbs,
      play_btn,
      queue_btn
    },
    props: ['id'],
    created: function () {
      this.$store.dispatch('genres/loadGenre', this.id)
      this.$store.dispatch('genres/viewGenre', this.id)
    },
    computed: {
      cover () {
        if (this.genre.cover) {
          return config.baseUrl + '/' + this.genre.cover
        }
      },
      genre () {
        return this.$store.getters['genres/getGenreById'](this.id)
      }
    },
  }
</script>
<style>

</style>
