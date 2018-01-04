<template>
    <div v-bind:class="loginScreen">
        <navbar v-if="$auth.check()"></navbar>
        <sidebar v-if="$auth.check() && loaded"></sidebar>
        <div class="container-fluid">
            <main class="router-view" role="main">
                <div class="left-column">
                    <router-view></router-view>
                </div>
                <playlist v-show="$auth.check()"></playlist>
            </main>
            <player-overlay v-if="(isPlaying && isAppIdle)"></player-overlay>
        </div>
        <player v-show="$auth.check()"></player>
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
        if(this.$auth.check() == false) {
          this.loaded == false;
        }
        if(this.$auth.check() && this.loaded == false) {
          console.log('loading')
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
        const idleTime = 60 * 1000
        const keepTracking = true
        const startAtIdle = false
        const idle = new IdleJs({
          idle:idleTime,
          events:['mousemove', 'keydown', 'mousedown', 'touchstart'],
          keepTracking,
          startAtIdle,
          onIdle: () => {
            if(this.$store) {
              this.$store.dispatch('changeIdle', true)
            }
          }
        })
        idle.start();
      }
    }
  }
</script>

<style lang="scss">
    @import '../scss/style.scss';
</style>
