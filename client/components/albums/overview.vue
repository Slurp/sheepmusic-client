<template>
    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{ name: 'all-albums'}">
                    <span class="font-weight-normal">All</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'recent-albums'}">
                    <span class="font-weight-normal">Recent</span>
                </router-link>
            </li>
        </ul>
        <transition-group name="list" tag="div" class="list">
            <div class="col" v-for="album in albumPage" :key="album.id" :name="album.id">
                <album :album-id=album.id :album=album></album>
            </div>
        </transition-group>
        <pagination for="albums" :records="totalAlbums" :vuex="true"></pagination>
    </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import album from './album'
  import Toaster from 'services/toast'

  export default {
    props: ['type'],
    components: {
      album
    },
    data(){
      return {
        loadAlbums: false,
        toast: new Toaster()
      }
    },
    watch: {
      type: function () {
        this.$store.dispatch('albums/sortBy', this.type).then(() => {
          console.log('sorted')
        })
      }
    },
    computed: {
      albumPage () {
        return this.$store.getters['albums/albums']
      },
      totalAlbums () {
        return this.$store.getters['albums/totalAlbums']
      }

    },
    created: function () {
      if(this.albums == null) {
        this.$store.dispatch('toggleLoading')
        this.$store.dispatch('albums/loadAlbums').then(() => {
          this.$store.dispatch('albums/sortBy', this.type).then(() => {
            console.log('sorted')
            this.$store.dispatch('toggleLoading')
          })
          this.toast.toast('loaded albums')
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
