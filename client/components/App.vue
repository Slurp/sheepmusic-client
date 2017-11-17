<template>
    <div v-bind:class="loginScreen">
        <navbar v-if="$auth.check()"></navbar>
        <sidebar v-if="$auth.ready() && loaded"></sidebar>
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
    </div>
</template>
<script>
  import navbar from 'components/header/index'
  import player from 'components/player/index'
  import playlist from 'components/playlist/playlist'
  import overlay from 'components/misc/overlay'
  import sidebar from 'components/sidebar/index'

  export default {
    components: { navbar, player, playlist, overlay, sidebar },
    data () {
      return {
        loaded: false,
      }
    },
    computed: {
      loginScreen: function () {
        return {
          'playlist-show': this.loaded && this.$auth.check(),
          'main-background': !this.$auth.check()
        }
      },
      loading () {
        return this.$store.getters['loading']
      }
    },
    created () {
      let _this = this
      this.$store.dispatch('toggleLoading')
      this.$auth.ready(function () {
        this.$store.dispatch('toggleLoading')
        _this.loaded = true
      })
    }
  }
</script>

<style lang="scss">
    @import '../scss/style.scss';
</style>
