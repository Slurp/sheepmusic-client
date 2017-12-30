import Vue from 'vue'

const state = {
  genres: [],
  sortedList: [],
  current: null,
  page: 1,
  sortBy: 'all',
  fetchedOverview: false
}

const actions = {
  loadGenres: function ({ commit, state }) {
    if (state.fetchedOverview === false) {
      Vue.axios.get(`/api/genre_list`).then((response) => {
        commit('ADD_GENRES', { genres: response.data })
      }, (err) => {
        console.log(err)
      })
    }
  },
  loadGenre: function ({ commit, state }, genreId) {
    if (state.genres[genreId] == null || state.genres[genreId].songs == null) {
      Vue.axios.get(`app_dev.php/api/genre/` + genreId).then((response) => {
        commit('ADD_GENRE', { genre: response.data, index: genreId })
      }, (err) => {
        console.log(err)
      })
    }
  },
  viewGenre: function ({ commit }, genreId) {
    commit('SET_CURRENT_GENRE', { index: genreId })
  },
  paginate: function ({ commit }, page) {
    commit('PAGINATE', { page: page })
  },
  sortBy: function ({ commit }, sort) {
    commit('SORT_BY', { 'sort': sort })
  }
}

const mutations = {
  ADD_GENRES: (state, { genres }) => {
    state.fetchedOverview = true
    state.genres = genres.filter(Boolean)
    state.sortedList = state.genres.map(genre => ({
      id: genre.id,
      name: genre.slug,
      date: new Date(genre.createdAt.date)
    }))
    //remove first value is null
    state.sortedList.splice(0, 1)
    state.sortedList.sort((a, b) => {
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
    if (state.sortBy === 'recent') {
      state.sortedList.sort((a, b) => b.date - a.date)
    }
  },
  ADD_GENRE: (state, { genre, index }) => {
    Vue.set(state.genres, index, genre)
  },
  SET_CURRENT_GENRE: (state, { index }) => {
    state.current = state.genres[index]
  },
  PAGINATE: (state, { page }) => {
    state.page = page
  },
  SORT_BY: (state, { sort }) => {
    if (sort !== state.sortBy) {
      if (sort === 'recent') {
        state.sortedList.sort((a, b) => b.date - a.date)
      } else {
        state.sortedList.sort((a, b) => {
          if (a.name < b.name) return -1
          if (a.name > b.name) return 1
          return 0
        })
      }
      state.sortBy = sort
    }
  }
}

const getters = {
  pageNumber: state => {
    return state.page
  },
  totalGenres: state => {
    return state.genres.length
  },
  getGenres: (state) => {
    if (state.genres.length >= 50) {
      const start = (50 * (state.page - 1))
      return state.sortedList.slice(start, start + 50).map(genre => state.genres[genre.id]).filter(Boolean)
    }
    return state.genres
  },
  getGenreById: (state) => (genreId) => {
    return state.genres[genreId]
  }
}

const genres = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default genres
