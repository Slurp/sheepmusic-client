import Vue from 'vue'

const state = {
  artists: [],
  sortedList: [],
  currentArtist: null,
  page: 1,
  sortBy: 'all'
}

const actions = {
  loadArtists: function ({ commit }) {
    Vue.axios.get(`/api/artist_list`).then((response) => {
      commit('ADD_ARTISTS', { artists: response.data })
    }, (err) => {
      console.log(err)
    })
  },
  loadArtist: function ({ commit, state }, artistId) {
    if (state.artists[artistId] == null || state.artists[artistId].songs == null) {
      Vue.axios.get(`/api/artist/` + artistId).then((response) => {
        commit('ADD_ARTIST', { artist: response.data, index: artistId })
      }, (err) => {
        console.log(err)
      })
    }
  },
  viewArtist: function ({ commit }, artistId) {
    commit('SET_CURRENT_ARTIST', { index: artistId })
  },
  paginate: function ({ commit }, page) {
    commit('PAGINATE', { page: page })
  },
  sortBy: function ({ commit }, sort) {
    commit('SORT_BY', { 'sort': sort })
  }
}

const mutations = {
  ADD_ARTISTS: (state, { artists }) => {
    for (const artist of artists) {
      if (state.artists[artist.id] == null || state.artists[artist.id].artist == null) {
        Vue.set(state.artists, artist.id, artist)
      }
    }
    state.sortedList = state.artists.map(artist => ({ id: artist.id, date: new Date(artist.createdAt.date) }))
    if (state.sortBy === 'recent') {
      state.sortedList.sort((a, b) => b.date - a.date)
    }
  },
  ADD_ARTIST: (state, { artist, index }) => {
    Vue.set(state.artists, index, artist)
  },
  SET_CURRENT_ARTIST: (state, { index }) => {
    state.currentArtist = state.artists[index]
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
  totalArtists: state => {
    return state.artists.length
  },
  artists: (state) => {
    if (state.artists.length >= 12) {
      const start = (12 * (state.page - 1)) + 1
      return state.sortedList.slice(start, start + 12).map(artist => state.artists[artist.id])
    }
    return state.artists.slice
  },
  getArtistById: (state) => (artistId) => {
    return state.artists[artistId]
  }
}

const artists = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default artists
