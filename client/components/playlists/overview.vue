<template>
    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{ name: 'all-playlists'}">
                    <span class="font-weight-normal">All</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'recent-playlists'}">
                    <span class="font-weight-normal">Recent</span>
                </router-link>
            </li>
        </ul>
        <transition-group name="list" tag="div" class="list">
            <div class="col" v-for="playlist in playlistPage" :key="playlist.id" :name="playlist.id">
                <playlist :playlist-id=playlist.id :playlist=playlist :key="playlist.id"></playlist>
            </div>
        </transition-group>
        <pagination for="playlists" :records="totalArtists" :vuex="true"></pagination>
    </div>
</template>

<script>
  import playlist from './playlists'

  export default {
    name: 'playlist-overview',
    props: ['type'],
    components: {
      playlist
    },
    data () {
      return {
        loadArtists: false,
      }
    },
    watch: {
      type: function () {
        this.$store.dispatch('playlists/sortBy', this.type)
      }
    },
    computed: {
      playlistPage () {
        return this.$store.getters['playlists/getPlaylists']
      },
      totalArtists () {
        return this.$store.getters['playlists/totalPlaylists']
      }

    },
    created: function () {
      if (this.playlists == null) {
        this.$store.dispatch('playlists/loadPlaylists').then(() => {
          this.toast.toast('loaded playlists')
        }).catch(() => {
          this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
        })
      }
    },
  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
