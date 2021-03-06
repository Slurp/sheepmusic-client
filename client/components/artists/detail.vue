<template>
    <article class="library-detail artist-detail" :id="id">
        <div v-if="artist && artist.fullyLoaded">
            <breadcrumbs :artist="artist"></breadcrumbs>
            <div class="backdrop">
                <div class="image-backdrop artist-backdrop" v-bind:style="{ 'background-image': 'url(' + background + ')' }"></div>
            </div>
            <section>
                <div class="detail-info-wrapper">
                    <div class="detail-art">
                        <div class="detail-art-img">
                            <img
                                    v-lazyload
                                    :alt="artist.name"
                                    src="/media/general/default.png"
                                    :data-src=cover
                                    data-err="/media/general/default.png"
                            />
                        </div>
                    </div>
                    <div class="detail-info">
                        <div class="actions">
                            <play_btn :artist=artist></play_btn>
                            <queue_btn :artist=artist></queue_btn>
                            <edit_btn :artist=artist></edit_btn>
                        </div>
                        <h1 class="artist-name" v-if="logo == null">{{ artist.name }}</h1>
                        <h1 class="artist-name" v-if="logo != null"><img :src="logo"></h1>
                        <div class="meta">
                            <span class="chip"><span class="chip-icon"><i class="material-icons">album</i></span>{{ artist.albums.length }}</span>
                            <span class="chip" v-if="genres" v-for="genre in genres">
                                <span class="chip-icon"><i class="material-icons">receipt</i></span>
                                <router-link
                                        :to="{ name: 'detail_genres', params: { genre: genre.name, id: genre.id }}">
                                    {{ genre.name }}
                                </router-link>
                            </span>
                        </div>
                        <truncate clamp="..." :length="90" less="Show Less" :text="artist.biography"></truncate>
                    </div>
                </div>
                <section class="list">
                    <h2 class="section-header">Albums</h2>
                    <div class="col" v-for="album in albums" :key="album.id">
                        <album :album-id=album.id :album=storedAlbum(album.id) :key="album.id"></album>
                    </div>
                </section>

                <section class="list" v-if="artist.similar.length > 0">
                    <h2 class="section-header">Similar Artists</h2>
                    <div class="col" v-for="similarArtist in artist.similar" :key="similarArtist">
                        <artist-card :artist-id=similarArtist :artist=storedArtist(similarArtist) :key="similarArtist"></artist-card>
                    </div>
                </section>

            </section>
        </div>
        <loading-circle v-else></loading-circle>
    </article>

</template>

<script>
  import songList from 'components/songs/list'
  import breadcrumbs from 'components/misc/breadcrumbs'
  import album from 'components/albums/album'
  import artistCard from 'components/artists/artist'
  import truncate from './bio'
  import play_btn from './play-btn'
  import queue_btn from './queue-btn'
  import edit_btn from './edit-btn'
  import config from 'config/index'
  import loadingCircle from 'components/misc/loading-circle';

  export default {
    components: {
      songList,
      breadcrumbs,
      album,
      artistCard,
      truncate,
      play_btn,
      queue_btn,
      edit_btn,
      loadingCircle
    },
    props: ['id'],
    created () {
      this.loadArtistDetail()
    },
    methods: {
      loadArtistDetail () {
        if (this.artist == null || typeof this.artist.albums == 'undefined') {
          this.$store.dispatch('artists/loadArtist', this.id)
        }
        this.$store.dispatch('artists/viewArtist', this.id)
      },
      storedAlbum (albumId) {
        return this.$store.getters['albums/getAlbumById'](albumId)
      },
      storedArtist (artistId) {
        console.log(artistId)
        console.log(this.$store.getters['artists/getArtistById'](artistId))
        return this.$store.getters['artists/getArtistById'](artistId)
      },
    },
    computed: {
      genres () {
        return this.artist.genres
      },
      logo () {
        return this.$store.getters['artists/getLogoForArtist'](this.id)
      },
      cover () {
        if (this.$store.getters['artists/getThumbForArtist'](this.id)) {
          return this.$store.getters['artists/getThumbForArtist'](this.id)
        }
        if (this.artist.image && this.artist.image !== '') {
          return new URL(this.artist.image,config.baseUrl)
        }
        if (this.artist.albumArt && this.artist.albumArt !== '') {
          return new URL(this.artist.albumArt, config.baseUrl)
        }
        return config.defaultCover;

      },
      background () {
        if (this.$store.getters['artists/getBackgroundForArtist'](this.id)) {
          return this.$store.getters['artists/getBackgroundForArtist'](this.id)
        }
        if (this.$store.getters['artists/getBannerForArtist'](this.id)) {
          return this.$store.getters['artists/getBannerForArtist'](this.id)
        }
        return this.artist.albumArt
      },
      artist () {
        return this.$store.getters['artists/getArtistById'](this.id)
      },
      albums () {
        if (this.artist.albums !== 'undefined') {
          return this.artist.albums.sort((a, b) => b.year - a.year)
        }
      }
    },
  }
</script>
<style>

</style>
