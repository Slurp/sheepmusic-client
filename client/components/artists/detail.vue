<template>
    <div class="artist-detail" :id="artist.id" v-if="artist && artist.albums">
        <breadcrumbs :artist="artist"></breadcrumbs>
        <div class="artist-backdrop backdrop" v-bind:style="{ 'background-image': 'url(' + artist.albumArt + ')' }">
            <div class="info-bar artist media">
                <img class="info-bar-image" :src="cover"/>
                <div class="info-bar-content media-body">
                    <h1 class="artist-name">{{ artist.name }}</h1>
                    <h3 class="artist-name">
                        <router-link
                                :to="{ name: 'detail_artist', params: { artist: artist.name, id: artist.id }}">
                            {{artist.name}}
                        </router-link>
                    </h3>

                    <play_btn :artist=artist></play_btn>
                    <queue_btn :artist=artist></queue_btn>
                    <truncate clamp="..." :length="90" less="Show Less" :text="artist.biography" ></truncate>
                </div>
            </div>
        </div>
        <div class="list">
            <div class="col" v-for="album in artist.albums" :key="album.id" :name="album.id">
                <album :album-id=album.id :album=album></album>
            </div>
        </div>
    </div>
</template>

<script>
  import songList from 'components/songs/list'
  import breadcrumbs from 'components/misc/breadcrumbs'
  import album from 'components/albums/album'
  import truncate from './bio';
    import play_btn from './play-btn'
    import queue_btn from './queue-btn'

  export default {
    components: {
      songList,
      breadcrumbs,
      album,
      truncate,
      play_btn,
      queue_btn
    },
    props: ['id'],
    created: function () {
      this.$store.dispatch('artists/loadArtist', this.id)
      this.$store.dispatch('artists/viewArtist', this.id)
    },
    computed: {
      cover () {
        if (this.artist.image !== '') {
          return this.artist.image
        }
        return this.artist.albumArt

      },
      artist () {
        return this.$store.getters['artists/getArtistById'](this.id)
      }
    },
  }
</script>
<style>

</style>
