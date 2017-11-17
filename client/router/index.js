import Vue from 'vue'
import VueRouter from 'vue-router'
import AlbumOverview from 'components/albums/overview'
import ArtistOverview from 'components/artists/overview'
import AlbumDetail from 'components/albums/detail'
import ArtistDetail from 'components/artists/detail'
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
      path: '/artist/:artist/:id',
      name: 'detail_artist',
      component: ArtistDetail,
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
