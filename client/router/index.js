import Vue from 'vue'
import VueRouter from 'vue-router'

// Promised based routing
// Is really buggy at the moment..
// const AlbumOverview = () => import('components/albums/overview')
// const ArtistOverview = () => import('components/artists/overview')
// const PlaylistOverview = () => import('components/playlists/overview')
// const AlbumDetail = () => import('components/albums/detail')
// const ArtistDetail = () => import('components/artists/detail')
// const PlaylistDetail = () => import('components/playlists/detail')
// const SearchResults = () => import('components/search/search-results')
// const UserProfile = () => import('components/user/profile')
// const Charts = () => import('components/charts/charts')

import AlbumOverview from 'components/albums/overview'
import ArtistOverview from 'components/artists/overview'
import PlaylistOverview from 'components/playlists/overview'
import AlbumDetail from 'components/albums/detail'
import ArtistDetail from 'components/artists/detail'
import PlaylistDetail from 'components/playlists/detail'
import SearchResults from 'components/search/search-results'
import UserProfile from 'components/user/profile'
import Charts from 'components/charts/charts'

import Login from 'components/pages/login'
import NotFound from 'components/not-found.vue'

Vue.use(VueRouter)

export default new VueRouter({
  hashbang: false,
  linkActiveClass: 'active',
  mode: 'history',
  routes: [
    {
      path: '/',
      component: AlbumOverview,
      name: 'home',
      meta: { auth: true }
    }, {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { auth: false }
    },
    {
      path: '/albums',
      name: 'all-albums',
      component: AlbumOverview,
      props: { type: 'all' },
      meta: { auth: true }
    },
    {
      path: '/albums/recent',
      name: 'recent-albums',
      component: AlbumOverview,
      props: { type: 'recent' },
      meta: { auth: true }
    },
    {
      path: '/albums/most-played',
      name: 'most-played-albums',
      component: AlbumOverview,
      props: { type: 'most-played' },
      meta: { auth: true }
    },
    {
      path: '/artist/:artist/album/:album/:id',
      name: 'detail_album',
      component: AlbumDetail,
      props: true,
      meta: { auth: true }
    },
    {
      path: '/artists/',
      name: 'all-artists',
      component: ArtistOverview,
      props: { type: 'all' },
      meta: { auth: true }
    },
    {
      path: '/artists/recent',
      name: 'recent-artists',
      component: ArtistOverview,
      props: { type: 'recent' },
      meta: { auth: true }
    },
    {
      path: '/artists/most-played',
      name: 'most-played-artists',
      component: ArtistOverview,
      props: { type: 'most-played' },
      meta: { auth: true }
    },
    {
      path: '/artist/:artist/:id',
      name: 'detail_artist',
      component: ArtistDetail,
      props: true,
      meta: { auth: true }
    },
    {
      path: '/playlists/',
      name: 'all-playlists',
      component: PlaylistOverview,
      props: { type: 'all' },
      meta: { auth: true }
    },
    {
      path: '/playlists/recent',
      name: 'recent-playlists',
      component: PlaylistOverview,
      props: { type: 'recent' },
      meta: { auth: true }
    },
    {
      path: '/playlist/:id',
      name: 'detail_playlists',
      component: PlaylistDetail,
      props: true,
      meta: { auth: true }
    },
    {
      path: '/search/:query',
      name: 'search_results',
      component: SearchResults,
      props: true,
      meta: { auth: true }
    },
    {
      path: '/you',
      name: 'user_profile',
      component: UserProfile,
      props: true,
      meta: { auth: true }
    },
    {
      path: '/donuts-and-pies',
      name: 'charts',
      component: Charts,
      props: true,
      meta: { auth: true }
    },
    // not found handler
    {
      path: '*',
      component: NotFound
    }
  ]
})
