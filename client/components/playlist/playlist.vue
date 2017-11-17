<template>
    <div class="playlist">
        <div class="playlist-dropup">
            <h5 class="playlist-header" data-playlistheader="">Current Playlist</h5>
            <div class="playlist-wrapper">
                <ul>
                    <li class="playlist-item" v-if="isEmpty">
                        <i class="material-icons">queue_music</i>
                        <div class="playlist-item-info">
                            <h5 class="mt-0">NO NO NO</h5>
                            <h6>There is no playlist</h6>
                        </div>
                    </li>
                    <song-item
                            v-if="isEmpty == false"
                            v-for="(song, index) in list"
                            :song="song"
                            :index="index"
                            class="playlist-item"
                            v-bind:class="{ playing: isActive(index) }"
                            :key="song.id"
                            :name="index">
                    </song-item>
                </ul>
            </div>
            <div class="playlist-actions">
                <a href="#" data-playlist_action="shuffle">
                    <i class="material-icons">shuffle</i>
                </a>
                <a href="#">
                    <i class="material-icons">save</i>
                </a>
            </div>
        </div>
    </div>
</template>
<script>
  import songItem from './song'

  export default {
    name: 'playlist',
    components: {
      songItem
    },
    methods: {
      isActive (index) {
        console.log(this.currentIndex + ' == ' + index)
        if (this.playing && this.currentSong !== null) {
          return (this.currentIndex === index)
        }
        return false
      },
    },
    computed: {
      playing () {
        return this.$store.getters['playlist/isPlaying']
      },
      currentIndex () {
        return this.$store.getters['playlist/getCurrentSelectedItem']
      },
      currentSong () {
        return this.$store.getters['playlist/getCurrentSong']
      },
      isEmpty () {
        return (this.list.length === 0)
      },
      list () {
        return this.$store.getters['playlist/list']
      }
    },
  }
</script>
