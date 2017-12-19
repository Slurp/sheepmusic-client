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
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'most-played-albums'}">
                    <span class="font-weight-normal">Most Played</span>
                </router-link>
            </li>
        </ul>
        <transition-group name="list" tag="div" class="list">
            <div class="col" v-for="album in albumPage" :key="album.id" :name="album.id">
                <album :album-id=album.id :album=album :key="album.id"></album>
            </div>
        </transition-group>
        <pagination for="albums" :records="totalAlbums" :vuex="true"></pagination>
    </div>
</template>

<script>
  import album from './album'
  import Toaster from 'services/toast'

  export default {
    props: {
      type: {
        type: String,
        required: false,
        default: 'all'
      }
    },
    components: {
      album
    },
    data () {
      return {
        loadAlbums: false,
        toast: new Toaster(),
      }
    },
    created () {
      this.toast.toast(this.type)
      this.$store.dispatch('albums/sortBy', this.type)
    },
    beforeDestroy () {
      this.toast = null
      delete this.toast
      delete this.loadAlbums
    },

    watch: {
      type: function () {
        this.$store.dispatch('albums/sortBy', this.type)
      }
    },
    computed: {
      albumPage () {
        return this.$store.getters['albums/albums']
      },
      totalAlbums () {
        return this.$store.getters['albums/totalAlbums'];
      }
    }
  }
</script>
