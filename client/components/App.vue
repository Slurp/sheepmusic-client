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
        </div>
        <player v-show="$auth.check()"></player>
        <overlay v-if="!$auth.ready() || !loaded || loading"></overlay>
        <modal-screens></modal-screens>
    </div>
</template>
<script>
  import navbar from 'components/header/index'
  import player from 'components/player/index'
  import playlist from 'components/playlist/playlist'
  import overlay from 'components/misc/overlay'
  import sidebar from 'components/sidebar/index'
  import modalScreens from 'components/modals/screens'
  import Toaster from 'services/toast'

  export default {
    components: { navbar, player, playlist, overlay, sidebar, modalScreens },
    data () {
      return {
        loaded: false,
        toast: new Toaster()
      }
    },
    computed: {
      loginScreen: function () {
        return {
          'playlist-show': this.loaded && this.$auth.check() && this.showPlaylist,
          'main-background': !this.$auth.check()
        }
      },
      loading () {
        return this.$store.getters['loading']
      },
      showPlaylist () {
        return this.$store.getters['showPlaylist']
      },
      isLoggedIn()
      {
        if(this.$auth.check()) {
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
    }
  }
</script>

<style lang="scss">
    @import '../scss/style.scss';
</style>
