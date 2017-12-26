import Vue from 'vue'
import arrayFunctions from 'services/array-helper'

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
        reject(err)
        console.log(err)
      })
    })
  },
  async loadAlbum ({ commit, state }, albumId) {
    if (state.albums[albumId] == null || state.albums[albumId].songs == null) {
      Vue.axios.get(`/api/album/` + albumId).then((response) => {
        commit('ADD_ALBUM', { album: response.data, index: albumId })
        //commit('songs/ADD_SONGALBUM', { songs: response.data.songs }, { root: true })
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
      playCount: album.playCount,
      date: new Date(album.createdAt.date)
    }))
    if (state.sortBy === 'recent') {
      state.sortedList.sort((a, b) => b.date - a.date)
    } else if (state.sortBy === 'most-played') {
      state.sortedList.sort((a, b) => b.playCount - a.playCount)
    }
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
      if (sort === 'recent') {
        state.sortedList.sort((a, b) => b.date - a.date)
      } else if (sort === 'most-played') {
        state.sortedList.sort((a, b) => b.playCount - a.playCount)
      } else {
        state.sortedList.sort((a, b) => a.id - b.id)
      }
      state.sortBy = sort
      state.page = 1
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
  search: (state) => (albums) => {
    return albums.map(album => state.albums[album.id])
  },
  getAlbumById: (state) => (albumId) => {
    return state.albums[albumId]
  },
  detailLink: (state) => (album) => {
    return {
      name: 'detail_album',
      params: { artist: album.name, id: album.id }
    }
  },
  getImportedByMonth: (state) => {
    if (state.albums.length > 0) {
      const year = (new Date()).getFullYear()
      const groups = state.albums.reduce((r, o) => {
        const date = new Date(o.createdAt.date)
        let m = date.getMonth();
        if(year === date.getFullYear()) {
          (r[m]) ? r[m]++ : r[m] = 1
        }
        return r
      }, arrayFunctions.initializeArrayWithValues(12,0));
      for(let i =1; i < 12; i++) {
        groups[i] = groups[i] + groups[i -1];
      }
      return groups
    }
    return []
  },
  getUpdatedByMonth: (state) => {
    if (state.albums.length > 0) {
      const year = (new Date()).getFullYear()
      const groups = state.albums.reduce((r, o) => {
        const date = new Date(o.updatedAt.date)
        let m = date.getMonth();
        if(year === date.getFullYear()) {
          (r[m]) ? r[m]++ : r[m] = 1
        }
        return r
      }, arrayFunctions.initializeArrayWithValues(12,0))
      return groups;

    }
    return []
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
