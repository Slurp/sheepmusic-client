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
            <!-- Disabled as backend doens't support it yet-->
            <!--<li class="nav-item">-->
                <!--<router-link class="nav-item nav-link" :to="{name:'most-played-artists'}">-->
                    <!--<span class="font-weight-normal">Most Played</span>-->
                <!--</router-link>-->
            <!--</li>-->
        </ul>
        <transition-group name="list" tag="div" class="list">
            <div class="col" v-for="artist in artists" :key="artist.id" :name="artist.id">
                <artist :artist-id=artist.id :artist=artist></artist>
            </div>
        </transition-group>
        <pagination for="artists" :records="totalArtists" :vuex="true"></pagination>
    </div>
</template>

<script>
  import artist from './artist'

  export default {
    props: ['type'],
    components: {
      artist
    },
    data () {
      return {
        loadedArtists: false,
      }
    },
    watch: {
      type: function () {
        this.$store.dispatch('artists/sortBy', this.type)
      }
    },
    computed: {
      artists () {
        if (this.artistPage) {
          this.$store.dispatch('artists/loadArtistCollection', this.artistPage).then(() => {
            this.loadedArtists = true
          }).catch(() => {
            this.loadedArtists = true
          })
        }
        if(this.loadedArtists) {
          return this.artistPage
        }
        return null
      },
      artistPage () {
        this.loadedArtists = false;
        return this.$store.getters['artists/artists']
      },
      totalArtists () {
        return this.$store.getters['artists/totalArtists']
      }
    },
  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
