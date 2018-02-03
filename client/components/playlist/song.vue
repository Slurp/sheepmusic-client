<template>
    <li>
        <cover :id="song.album.id"></cover>
        <div class="playlist-item-info">
            <h5>{{ song.title }}</h5>
            <h6>{{ song.artist.name }} - {{ song.album.name }}</h6>
        </div>
        <div class="playlist-item-actions">
            <a class="playlist-item-actions__select" v-on:click.stop.prevent="select">
                <i class="material-icons">play_arrow</i>
            </a>
            <a class="playlist-item-actions__remove" v-on:click.stop.prevent="remove">
                <i class="material-icons">remove_from_queue</i>
            </a>
        </div>
    </li>
</template>
<script>
  import cover from 'components/albums/cover'
  export default {
    props: ['song','index'],
    components: {
      cover,
    },
    methods: {
      select: function (event) {
        this.$store.dispatch('playlist/selectSong', this.index)
      },
      remove: function (event) {
        this.$store.dispatch('playlist/removeSong', this.index)
      }
    }
  }
</script>
<style>

</style>
