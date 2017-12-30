<template>
    <div>
        <ul class="nav nav-tabs">
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{ name: 'all-genres'}">
                    <span class="font-weight-normal">All</span>
                </router-link>
            </li>
            <li class="nav-item">
                <router-link class="nav-item nav-link" :to="{name:'recent-genres'}">
                    <span class="font-weight-normal">Recent</span>
                </router-link>
            </li>
        </ul>
        <transition-group name="list" tag="ul" class="nav nav-pills flex-column flex-sm-row" v-if="genrePage">
            <li class="nav-item" v-for="(genre, index) in genrePage" :key="index" :name="genre.slug">
                <router-link  class="nav-link" :to="{ name: 'detail_genres', params: { genre: genre.slug, id: genre.id }}">
                    {{ genre.name }}
                </router-link>
            </li>
        </transition-group>
        <pagination for="genres" :records="totalGenres" :vuex="true"></pagination>
    </div>
</template>

<script>
  import Toaster from 'services/toast'

  export default {
    name: 'genre-overview',
    props: ['type'],
    data () {
      return {
        toast: new Toaster(),
      }
    },
    beforeDestroy () {
      this.toast = null
      delete this.toast
    },
    watch: {
      type: function () {
        this.$store.dispatch('genres/sortBy', this.type)
      }
    },
    computed: {
      genrePage () {
        return this.$store.getters['genres/getGenres']
      },
      totalGenres () {
        return this.$store.getters['genres/totalGenres']
      },

    },
    created: function () {
        this.$store.dispatch('genres/loadGenres').then(() => {
          this.toast.toast('loaded genres')
        }).catch(() => {
          this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
        })
    },
  }
</script>
<style>
    .md-card .md-card-media img {
        height: auto;
    }
</style>
