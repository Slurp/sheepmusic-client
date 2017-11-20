import Vue from 'vue'

const state = {
  playlists: [],
  sortedList: [],
  currentArtist: null,
  page: 1,
  sortBy: 'all'
}

const actions = {
  loadPlaylists: function ({ commit }) {
    Vue.axios.get(`/api/playlist_list`).then((response) => {
      commit('ADD_PLAYLISTS', { playlists: response.data })
    }, (err) => {
      console.log(err)
    })
  },
  loadPlaylist: function ({ commit, state }, playlistId) {
    if (state.playlists[playlistId] == null || state.playlists[playlistId].songs == null) {
      Vue.axios.get(`/api/playlist/` + playlistId).then((response) => {
        commit('ADD_PLAYLIST', { playlist: response.data, index: playlistId })
      }, (err) => {
        console.log(err)
      })
    }
  },
  viewPlaylist: function ({ commit }, playlistId) {
    commit('SET_CURRENT_PLAYLIST', { index: playlistId })
  },
  paginate: function ({ commit }, page) {
    commit('PAGINATE', { page: page })
  },
  sortBy: function ({ commit }, sort) {
    commit('SORT_BY', { 'sort': sort })
  }
}

const mutations = {
  ADD_PLAYLISTS: (state, { playlists }) => {
    for (const playlist of playlists) {
      if (state.playlists[playlist.id] == null || state.playlists[playlist.id].playlist == null) {
        Vue.set(state.playlists, playlist.id, playlist)
      }
    }
    state.sortedList = state.playlists.map(playlist => ({ id: playlist.id, date: new Date(playlist.createdAt.date) }))
    if (state.sortBy === 'recent') {
      state.sortedList.sort((a, b) => b.date - a.date)
    }
  },
  ADD_PLAYLIST: (state, { playlist, index }) => {
    Vue.set(state.playlists, index, playlist)
  },
  SET_CURRENT_PLAYLIST: (state, { index }) => {
    state.currentArtist = state.playlists[index]
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
        state.sortedList.sort((a, b) => a.id - b.id)
      }
      state.sortBy = sort
      console.log('sorted')
    }
  }
}

const getters = {
  pageNumber: state => {
    return state.page
  },
  totalPlaylists: state => {
    return state.playlists.length
  },
  getPlaylists: (state) => {

    const start = (12 * (state.page - 1)) + 1
    return state.sortedList.slice(start, start + 12).map(playlist => state.playlists[playlist.id])

  },
  getPlaylistById: (state) => (playlistId) => {
    return state.playlists[playlistId]
  }
}

const playlists = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default playlists