<template>
    <nav class="navbar navbar-expand-sm sticky" v-stick="stickyOptions" role="navigation">
        <a href="#" aria-controls="doc_navdrawer" aria-expanded="false" aria-label="Toggle Navdrawer" class="navbar-brand" data-target="#doc_navdrawer" data-toggle="navdrawer" data-type="permanent">
            <span class="brand-logo"></span>
        </a>
        <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown ">
                <a class="nav-link" data-toggle="dropdown" href="#" role="button" aria-haspopup="true"
                   aria-expanded="false">
                    <i class="material-icons mx-auto">more_vert</i>
                </a>
                <div class="dropdown-menu dropdown-menu-right">
                    <span class="dropdown-item">{{ $auth.user().user }}</span>
                    <a class="dropdown-item" v-on:click.prevent="logout()">Logout</a>
                </div>
            </li>
        </ul>

    </nav>
</template>

<script>
  import config from '../../config'
  import Sticky from 'sticky-js'

  export default {
    name: 'header',
    data () {
      return {
        appTitle: config.appTitle,
        stickyOptions: {
          marginTop: 0,
          for: 0,
          className: 'is-sticky',
          wrap: true
        }
      }
    },
    directives: {
      stick: {
        inserted (el, binding) {
          el.parentNode.setAttribute('data-sticky-container', '')
          if (binding.value) {
            if (binding.value.marginTop) { el.setAttribute('data-margin-top', binding.value.marginTop) }
            if (binding.value.for) { el.setAttribute('data-sticky-for', binding.value.for) }
            if (binding.value.className) { el.setAttribute('data-sticky-class', binding.value.className) }
            if (binding.value.wrap) { el.setAttribute('data-sticky-wrap', binding.value.wrap) }
          }

          new Sticky('.sticky')
        }
      }
    },
    methods: {
      logout () {
        this.$auth.logout({
          makeRequest: true,
          success () {

          },
          error () {
          }
        })
      },
    }
  }
</script>

<style>
</style>
