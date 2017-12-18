import Vue from 'vue'

const state = {
  albums: [],
  sortedList: [],
  currentAlbum: null,
  page: 1,
  sortBy: 'all'
}

const actions = {
  async loadAlbums ({ commit, state }) {
    return new Promise((resolve, reject) => {
      Vue.axios.get(`/api/album_list`).then((response) => {
        if (response.data.length !== state.albums.length) {
          commit('ADD_ALBUMS', { albums: response.data })
          resolve()
        }
      }, (err) => {
        reject(err);
        console.log(err)
      })
    })
  },
  async loadAlbum ({ commit, state }, albumId) {
    if (state.albums[albumId] == null || state.albums[albumId].songs == null) {
      Vue.axios.get(`/api/album/` + albumId).then((response) => {
        commit('ADD_ALBUM', { album: response.data, index: albumId })
        commit('songs/ADD_SONGALBUM', { songs: response.data.songs }, { root: true })
      }, (err) => {
        console.log(err)
      })
    }
  },
  async viewAlbum ({ commit }, albumId) {
    commit('SET_CURRENT_ALBUM', { index: albumId })
  },
  async paginate ({ commit }, page) {
    commit('PAGINATE', { page: page })
  },
  async sortBy ({ commit }, sort) {
    commit('SORT_BY', { 'sort': sort })
  }
}

const mutations = {
  ADD_ALBUMS: (state, { albums }) => {
    for (const album of albums) {
      if (state.albums[album.id] == null || state.albums[album.id].album == null) {
        Vue.set(state.albums, album.id, album)
      }
    }
    state.sortedList = state.albums.map(album => ({
      id: album.id,
      name: album.name,
      date: new Date(album.createdAt.date)
    }))
    if (state.sortBy === 'recent') {
      state.sortedList.sort((a, b) => b.date - a.date)
    } else {
      state.sortedList.sort((a, b) => a.name.localeCompare(b.name))
    }
    console.log('added albums')
  },
  ADD_ALBUM: (state, { album, index }) => {
    Vue.set(state.albums, index, album)
  },
  SET_CURRENT_ALBUM: (state, { index }) => {
    state.currentAlbum = state.albums[index]
  },
  PAGINATE: (state, { page }) => {
    state.page = page
  },
  SORT_BY: (state, { sort }) => {
    if (sort !== state.sortBy) {
      console.log('sorting')
      if (sort === 'recent') {
        state.sortedList.sort((a, b) => b.date - a.date)
      } else {
        state.sortedList.sort((a, b) => a.name.localeCompare(b.name))
      }
      state.sortBy = sort
      state.page = 1
      console.log('sorted')
    }
  }
}

const getters = {
  pageNumber: state => {
    return state.page
  },
  totalAlbums: state => {
    return state.albums.length
  },
  albums: (state) => {
    if (state.albums.length >= 12) {
      const start = (12 * (state.page - 1)) + 1
      return state.sortedList.slice(start, start + 12).map(album => state.albums[album.id])
    }
    return state.albums.slice
  },
  getAlbumById: (state) => (albumId) => {
    return state.albums[albumId]
  },
  detailLink: (state) => (album) => {
    return {
      name: 'detail_album',
      params: { artist: album.name, id: album.id }
    }
  }
}

const albums = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default albums
