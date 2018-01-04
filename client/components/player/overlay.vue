<template>
    <div class="playing-overlay" v-if="song">
        <div class="background-image" v-bind:style="{ 'background-image': 'url(' + background + ')' }"></div>
        <div class="playing-overlay__content">
            <a class="btn btn-secondary btn-sm btn-float btn-close" v-on:click.stop.prevent="close"><i class="material-icons">close</i></a>
            <h1>Now playing</h1>
            <div class="album-cover">
                <img :src="song.album.cover">
            </div>
            <div class="info">
                <h3><img :src="logo" v-if="logo"><span v-else>{{ artist.name }}</span></h3>
                <h2>{{ song.title }}</h2>
                <h4>{{ album.name }}</h4>
                <p class="audio-info">
                   {{song.audio.dataformat }} {{ song.audio.bitrate_mode }} - {{ song.audio.sample_rate }}Hz - {{ song.audio.channelmode }}
                    <i class="material-icons" v-if="song.audio.lossless">hd</i>
                </p>
            </div>

            <!--<div id="bars">-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
                <!--<div class="bar"></div>-->
            <!--</div>-->
        </div>
    </div>
</template>

<script>
  export default {
    name: 'player-overlay',
    methods: {
      close: function (event) {
        this.$store.dispatch('changeIdle', false)
      }
    },
    computed: {
      song () {
        return this.$store.getters['playlist/getCurrentSong']
      },
      album () {
        if (this.song) {
          console.log(this.song.album.id);
          return this.$store.getters['albums/getAlbumById'](this.song.album.id)
        }
      },
      artist () {
        if (this.song) {
          this.$store.dispatch('artists/loadArtist',this.song.artist.id)
          return this.$store.getters['artists/getArtistById'](this.song.artist.id)
        }
      },
      background () {
        if (this.artist) {
          if (this.$store.getters['artists/getBackgroundForArtist'](this.artist.id)) {
            return this.$store.getters['artists/getBackgroundForArtist'](this.artist.id)
          }
          if (this.artist.albumArt) {
            return this.artist.albumArt
          }
        }
        return 'none'
      },
      logo () {
        if (this.artist) {
          return this.$store.getters['artists/getLogoForArtist'](this.artist.id)
        }
        return null
      },
    }
  }
</script>

