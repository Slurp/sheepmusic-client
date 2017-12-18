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
            <div v-if="isEmpty == false" class="playlist-actions" role="group">
                <a href="#" class='btn' v-on:click.stop.prevent="shuffle">
                    <i class="material-icons">shuffle</i>
                </a>
                <a href="#" class='btn' v-bind:class="repeatMode" v-bind:title="repeatStatus" v-on:click.stop.prevent="changeRepeatMode">
                    <i v-if="repeatMode == 'REPEAT_ONE'" class="material-icons">repeat_one</i>
                    <i v-if="repeatMode == 'NO_REPEAT'" class="material-icons">repeat</i>
                    <i v-if="repeatMode == 'REPEAT_ALL'" class="material-icons">repeat</i>
                </a>
                <a href="#" class='btn' data-toggle="modal" data-target="#playlistModal">
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
    data () {
      return {
        repeatStatus: ''
      }
    },
    methods: {
      isActive (index) {
        if (this.playing && this.currentSong !== null) {
          return (this.currentIndex === index)
        }
        return false
      },
      shuffle () {
        this.$store.dispatch('playlist/shuffle')
      },
      changeRepeatMode () {
        this.$store.dispatch('playlist/setRepeatMode', this.repeatMode)
      }
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
      },
      repeatMode () {
        return this.repeatStatus = this.$store.getters['playlist/repeatMode']
      }
    },
  }
</script>
