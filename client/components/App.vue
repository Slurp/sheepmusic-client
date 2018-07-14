<template>
    <div v-bind:class="loginScreen">
        <navbar v-if="$auth.check()"></navbar>
        <sidebar v-if="$auth.check() && loaded && !loading"></sidebar>
        <div class="container-fluid" v-if="loaded && !loading">
            <main class="router-view" role="main">
                <div class="left-column">
                    <router-view></router-view>
                </div>
                <playlist v-show="$auth.check() && !loading"></playlist>
            </main>
            <player-overlay v-if="(isPlaying && isAppIdle)"></player-overlay>
        </div>
        <player v-show="$auth.check() && !loading"></player>
        <overlay v-if="(!$auth.ready() && !loaded ) || loading"></overlay>
        <modal-screens></modal-screens>
    </div>
</template>

<script>
  import navbar from 'components/header/index'
  import player from 'components/player/index'
  import playerOverlay from 'components/player/overlay'
  import playlist from 'components/playlist/playlist'
  import overlay from 'components/misc/overlay'
  import sidebar from 'components/sidebar/index'
  import modalScreens from 'components/modals/screens'
  import Toaster from 'services/toast'
  import IdleJs from 'idle-js'

  export default {
    components: { navbar, player, playlist, overlay, sidebar, modalScreens, playerOverlay },
    data () {
      return {
        loaded: false,
        toast: new Toaster(),
        showNowPlaying: false,
        playing: null
      }
    },
    computed: {
      loginScreen: function () {
        return {
          'playlist-show': this.loaded && this.$auth.check() && this.showPlaylist,
          'main-background': !this.$auth.check()
        }
      },
      isAppIdle () {
         return this.$store.getters['isIdle']
      },
      isPlaying () {
        return this.$store.getters['playlist/isPlaying']
      },
      loading () {
        return this.$store.getters['loading']
      },
      showPlaylist () {
        return this.$store.getters['showPlaylist']
      },
      isLoggedIn()
      {
        if(this.$auth.check() === false) {
          this.loaded = false;
        }
        if(this.$auth.check() && this.loaded === false) {
          this.$store.dispatch('toggleLoading')
          this.$store.dispatch('albums/loadAlbums').then(() => {
            this.$store.dispatch('artists/loadArtists').then(() => {
              this.loaded = true
              this.$store.dispatch('toggleLoading')
            }).catch(() => {
              this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
            })
          }).catch(() => {
            this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
          })
        }
      }
    },
    created () {
      this.readyState();
      this.watchIdle();
    },
    methods: {
      readyState(){
        this.$auth.ready( () => {
          this.$store.dispatch('toggleLoading')
          if(this.$auth.check()) {
            this.$store.dispatch('albums/loadAlbums').then(() => {
              this.$store.dispatch('artists/loadArtists').then(() => {
                this.loaded = true
                this.$store.dispatch('toggleLoading')
              }).catch(() => {
                this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
              })
            }).catch(() => {
              this.toast.toast('@#@#*(&@#*&@#(*!@^!@&@!')
            })
          } else {
            this.$store.dispatch('toggleLoading')
            this.loaded = true;
          }
        })
      },
      watchIdle(){
        const idle = new IdleJs({
          idle:60 * 1000,
          events:['keydown', 'mousedown', 'touchstart'],
          keepTracking:true,
          startAtIdle:false,
          onIdle: () => {
            if(this.$store) {
              this.$store.dispatch('changeIdle', true)
            }
          },
          onActive:() => {
            if(this.$store) {
              this.$store.dispatch('changeIdle', false)
            }
          },
        })
        idle.start();
      }
    }
  }
</script>

<style lang="scss">
    @import '../scss/style.scss';
</style>
