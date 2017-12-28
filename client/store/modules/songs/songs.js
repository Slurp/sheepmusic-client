import Vue from 'vue'

const state = {
  songs: []
}

const actions = {
  announceSong: function ({ dispatch, commit, state }, song) {
    Vue.axios.get(song.events.now_playing).then(() => {
      dispatch('albums/loadAlbum', this.albumId, {root:true})
      console.log('announced song')
    }, (err) => {
      console.log(err)
    })
  },
  playedSong: function ({ commit, state }, song) {
    Vue.axios.get(song.events.played).then(() => {
      console.log('played song')
    }, (err) => {
      console.log(err)
    })
  }
}

const mutations = {

  ADD_SONGALBUM: (state, { songs }) => {
    for (let song of songs) {
      Vue.set(state.songs, song.id, song)
    }
  }
}

const getters = {
  songs: (state) => {
    return state.songs
  },
  getSongsAlbumById: (state, getters) => (albumId) => {
    return state.songs.filter((song) => song.album.id === albumId)
  }
}

const songs = {
  namespaced: true,
  actions,
  state,
  mutations,
  getters
}
export default songs
