import Vue from 'vue'

const state = {
  artists: [],
  sortedList: [],
  currentArtist: null,
  page: 1,
  sortBy: 'all'
}

const actions = {
  loadArtists({ commit }) {
    return new Promise((resolve, reject) => {
      Vue.axios.get(`/api/artist_list`).then(response => {
        commit('ADD_ARTISTS', { artists: response.data })
        resolve()
      }, err => {
        reject(err)
        console.log(err)
      })
    })
  },
  async loadArtistCollection({ commit }, artists) {
    return new Promise((resolve, reject) => {
      const collection = artists.filter(artist => (!state.artists[artist.id] || state.artists[artist.id].fullyLoaded === false));
      if (collection.length > 0) {
        const data = collection.reduce((formData, object) => {
          formData.append('objects[]', object.id)
          return formData
        }, new FormData())
        return Vue.axios.post(`app_dev.php/api/artist_collection`, data).then(response => {
          response.data.forEach((artistData) => commit('ADD_ARTIST', {
            artist: artistData,
            index: artistData.id
          }))
          resolve()
        }, err => {
          reject(err)
        })
      }
      resolve()
    })
  },
  loadArtist({ commit, state }, artistId) {
    if (!state.artists[artistId] || state.artists[artistId].fullyLoaded === false) {
      Vue.axios.get(`/api/artist/` + artistId).then(response => {
        commit('ADD_ARTIST', { artist: response.data, index: artistId })
      }, err => {
        console.log(err)
      })
    }
  },
  updateArtist({ commit, state }, artistId) {
    Vue.axios.get(`/api/artist/update/` + artistId).then(response => {
      commit('ADD_ARTIST', { artist: response.data, index: artistId })
    }, err => {
      console.log(err)
    })
  },
  viewArtist({ commit }, artistId) {
    commit('SET_CURRENT_ARTIST', { index: artistId })
  },
  paginate({ commit }, page) {
    commit('PAGINATE', { page })
  },
  sortBy({ commit }, sort) {
    commit('SORT_BY', { sort })
  }
}

const mutations = {
  ADD_ARTISTS: (state, { artists }) => {
    for (const artist of artists) {
      if (state.artists[artist.id] == null || state.artists[artist.id].albums == null) {
        artist.fullyLoaded = false
        Vue.set(state.artists, artist.id, artist)
      }
    }
    state.sortedList = state.artists.map(artist => ({
      id: artist.id,
      date: new Date(artist.createdAt.date),
      playCount: artist.playCount
    }))
    state.sortedList.splice(0, 1)
    if (state.sortBy === 'recent') {
      state.sortedList.sort((a, b) => b.date - a.date)
    } else if (state.sortBy === 'most-played') {
      state.sortedList.sort((a, b) => b.playCount - a.playCount)
    }
  },
  ADD_ARTIST: (state, { artist, index }) => {
    artist.fullyLoaded = true
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
      if (sort === 'recent') {
        state.sortedList.sort((a, b) => b.date - a.date)
      } else if (sort === 'most-played') {
        state.sortedList.sort((a, b) => b.playCount - a.playCount)
      } else {
        state.sortedList.sort((a, b) => a.id - b.id)
      }
      state.sortBy = sort
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
  artists: state => {
    if (state.artists.length >= 12) {
      const start = (12 * (state.page - 1))
      return state.sortedList.slice(start, start + 12).map(artist => state.artists[artist.id])
    }
    return state.artists.slice
  },
  getArtistById: state => artistId => {
    if (state.artists) {
      return state.artists[artistId]
    }
  },
  getLogoForArtist: state => artistId => {
    if (state.artists && state.artists[artistId] && typeof state.artists[artistId].logo !== 'undefined' && state.artists[artistId].logo.length > 0) {
      return state.artists[artistId].logo[Math.max(Math.floor(Math.random() * state.artists[artistId].logo.length), state.artists[artistId].logo.length - 1)]
    }
    return null
  },
  getBackgroundForArtist: state => artistId => {
    if (state.artists && state.artists[artistId] && typeof state.artists[artistId].background !== 'undefined' && state.artists[artistId].background.length > 0) {
      return state.artists[artistId].background[Math.max(Math.floor(Math.random() * state.artists[artistId].background.length), state.artists[artistId].background.length - 1)]
    }
    return null
  },
  getBannerForArtist: state => artistId => {
    if (state.artists && state.artists[artistId] && typeof state.artists[artistId].banner !== 'undefined' && state.artists[artistId].banner.length > 0) {
      return state.artists[artistId].banner[Math.max(Math.floor(Math.random() * state.artists[artistId].banner.length), state.artists[artistId].banner.length - 1)]
    }
    return null
  },
  getThumbForArtist: state => artistId => {
    if (state.artists && state.artists[artistId] && typeof state.artists[artistId].thumbs !== 'undefined' && state.artists[artistId].thumbs.length > 0) {
      return state.artists[artistId].thumbs[Math.max(Math.floor(Math.random() * state.artists[artistId].thumbs.length), state.artists[artistId].thumbs.length - 1)]
    }
    return null
  },
  search: state => artists => {
    return artists.map(artist => state.artists[artist.id])
  },
  detailLink: state => artist => {
    return {
      name: 'detail_artist',
      params: { artist: artist.name, id: artist.id }
    }
  },
  getImportedByMonth: state => {
    if (state.artists && state.artists.length > 0) {
      const year = (new Date()).getFullYear()
      const groups = state.artists.reduce((r, o) => {
        const date = new Date(o.createdAt.date)
        const m = date.getMonth()
        if (year === date.getFullYear()) {
          (r[m]) ? r[m]++ : r[m] = 1
        }
        return r
      }, Array(12).fill(0))
      for (let i = 1; i < 12; i++) {
        groups[i] = groups[i] + groups[i - 1]
      }
      return groups
    }
    return Array(12).fill(0)
  },
  getUpdatedByMonth: state => {
    if (state.artists && state.artists.length > 0) {
      const year = (new Date()).getFullYear()
      const groups = state.artists.reduce((r, o) => {
        const date = new Date(o.updatedAt.date)
        const m = date.getMonth()
        if (year === date.getFullYear()) {
          (r[m]) ? r[m]++ : r[m] = 1
        }
        return r
      }, Array(12).fill(0))
      return groups
    }
    return Array(12).fill(0)
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
