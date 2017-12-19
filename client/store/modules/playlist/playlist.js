import Vue from 'vue'

const state = {
  songs: [],
  repeatModes: ['NO_REPEAT', 'REPEAT_ALL', 'REPEAT_ONE'],
  repeatMode: 'REPEAT_ALL',
  currentIndex: null,
  currentSong: null,
  isPlaying: false,
  name: ''
}

const actions = {
  async nextSong ({ commit }) {
    commit('NEXT')
  },
  async prevSong ({ commit }) {
    commit('PREV')
  },
  async clearPlaylist ({ commit }) {
    commit('CLEAR')
  },
  async queueAlbum ({ commit }, album) {
    commit('ADD_ALBUM', { album: album })
  },
  async playAlbum ({ dispatch, commit }, album) {
    await dispatch('clearPlaylist')
    commit('ADD_ALBUM', { album: album })
    commit('NEXT')
  },
  async queueSong ({ commit }, song) {
    commit('ADD_SONG', { song: song })
  },
  async playSong ({ dispatch, commit }, song) {
    await dispatch('clearPlaylist')
    commit('ADD_SONG', { song: song })
  },
  async selectSong ({ commit }, index) {
    commit('SELECT_SONG', { index: index })
  },
  removeSong ({ commit }, index) {
    commit('REMOVE_SONG', { index: index })
  },
  shuffle ({ commit }) {
    commit('SHUFFLE')
  },
  setPlayingStatus ({ commit }, playing) {
    commit('PLAYING', { playing: playing })
  },
  setTitle ({ commit }, title) {
    console.log(title)
    commit('SAVE', { title: title })
  },
  setRepeatMode ({ commit }, mode) {
    commit('SET_REPEAT_MODE', { mode: mode })
  },
  async savePlaylist ({ commit }, title) {
    const data = new FormData()
    data.append('name', title)
    data.append('songs', state.songs.map(song => song.id))

    return Vue.axios.post(`app_dev.php/api/save/playlist`, data).then(response => {
      commit('SAVE', { title: response.name })
      return response;
    }).catch(e => {
      return (e)
    })

  }
}

const mutations = {
  CLEAR: (state) => {
    state.songs = []
    state.currentIndex = null
    state.currentRepeatMode = 'REPEAT_ALL'
  },
  PREV: (state) => {
    if (state.repeatMode !== 'REPEAT_ONE') {
      if (state.currentIndex === null || state.currentIndex === 0) {
        state.currentIndex = state.songs.length
      }
      state.currentIndex--
    }
    state.currentSong = state.songs[state.currentIndex]
  },
  NEXT: (state) => {
    if (state.repeatMode !== 'REPEAT_ONE') {
      if (state.currentIndex !== null) {
        state.currentIndex++
      }
      if (state.currentIndex === null || state.currentIndex >= state.songs.length) {
        if (state.currentIndex >= state.songs.length && state.repeatMode !== 'REPEAT_ALL') {
          state.isPlaying = false
        } else {
          state.currentIndex = 0
        }
      }
      state.currentSong = state.songs[state.currentIndex]
    } else {
      state.currentSong = state.songs[state.currentIndex]
    }

  },
  ADD_ALBUM: (state, { album }) => {
    for (const song of album.songs) {
      state.songs.push(song)
    }
  },
  ADD_SONG: (state, { song }) => {
    state.songs.push(song)
  },
  REMOVE_SONG: (state, { index }) => {
    if (index !== -1) {
      state.songs.splice(index, 1)
    }
  },
  SELECT_SONG: (state, { index }) => {
    if (index > -1 && index < state.songs.length) {
      state.currentIndex = index
      state.currentSong = state.songs[state.currentIndex]
    }
  },
  SHUFFLE: (state) => {
    for (let i = state.songs.length - 1; i >= 0; i--) {

      const randomIndex = Math.floor(Math.random() * (i + 1))
      const itemAtIndex = state.songs[randomIndex]
      Vue.set(state.songs, randomIndex, state.songs[i])
      Vue.set(state.songs, i, itemAtIndex)
      if (state.currentSong != null && itemAtIndex.id === state.currentSong.id) {
        state.currentIndex = i
      }
    }
    // for (let i = state.songs.length; i; i--) {
    //   console.log('shuffle')
    //   const j = Math.floor(Math.random() * i);
    //   [state.songs[i - 1], state.songs[j]] = [state.songs[j], state.songs[i - 1]]
    // }
  },
  PLAYING: (state, { playing }) => {
    state.isPlaying = playing
  },
  SAVE: (state, { title }) => {
    state.name = title
  },
  SET_REPEAT_MODE: (state, { mode }) => {
    if (state.repeatModes.includes(mode)) {
      let currentIndex = state.repeatModes.indexOf(mode) + 1
      if (currentIndex >= state.repeatModes.length) {
        currentIndex = 0
      }
      state.repeatMode = state.repeatModes[currentIndex]
    }
  }
}

const getters = {
  getPreloadSong: (state) => {
    if (state.currentIndex !== null) {
      return state.songs[state.currentIndex + 1]
    }
  },
  getCurrentSong: (state) => {
    return state.currentSong
  },
  getCurrentSelectedItem: (state) => {
    return state.currentIndex
  },
  list: (state) => {
    return state.songs
  },
  isPlaying: (state) => {
    return state.isPlaying
  },
  name: (state) => {
    return state.name
  },
  repeatModes: (state) => {
    return state.repeatModes
  },
  repeatMode: (state) => {
    return state.repeatMode
  }
}
const playlist = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
export default playlist
