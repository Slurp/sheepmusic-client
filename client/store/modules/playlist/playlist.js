const state = {
  songs: [],
  currentIndex: null,
  currentSong: null,
  isPlaying: false,
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
  }
}

const mutations = {
  CLEAR: (state) => {
    state.songs = []
    state.currentIndex = null
  },
  PREV: (state) => {
    if (state.currentIndex === null || state.currentIndex === 0) {
      state.currentIndex = state.songs.length
    }
    state.currentIndex--
  },
  NEXT: (state) => {
    if (state.currentIndex !== null) {
      state.currentIndex++
    }
    if (state.currentIndex === null || state.currentIndex >= state.songs.length) {
      state.currentIndex = 0
    }
    state.currentSong = state.songs[state.currentIndex]
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
  SHUFFLE: (state, { index }) => {
    for (let i = state.songs.length; i; i--) {
      const j = Math.floor(Math.random() * i);
      [state.songs[i - 1], state.songs[j]] = [state.songs[j], state.songs[i - 1]]
    }
  },
  PLAYING: (state, { playing }) => {
    state.isPlaying = playing
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
