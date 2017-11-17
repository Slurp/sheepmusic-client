<template>
    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{ name: 'all-artists'}">
                    <span class="font-weight-normal">All</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'recent-artists'}">
                    <span class="font-weight-normal">Recent</span>
                </router-link>
            </li>
        </ul>
        <transition-group name="list" tag="div" class="list">
            <div class="col" v-for="artist in artistPage" :key="artist.id" :name="artist.id">
                <artist :artist-id=artist.id :artist=artist></artist>
            </div>
        </transition-group>
        <pagination for="artists" :records="totalArtists" :vuex="true"></pagination>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import artist from './artist'
  import Toaster from 'services/toast'

  export default {
    props: ['type'],
    components: {
      artist
    },
    data () {
      return {
        loadArtists: false,
        toast: new Toaster()
      }
    },
    watch: {
      type: function () {
        this.$store.dispatch('artists/sortBy', this.type)
      }
    },
    computed: {
      artistPage () {
        return this.$store.getters['artists/artists']
      },
      totalArtists () {
        return this.$store.getters['artists/totalArtists']
      }

    },
    created: function () {
      if (this.artists == null) {
        this.$store.dispatch('artists/loadArtists').then(() => {
          this.toast.toast('loaded artists')
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
