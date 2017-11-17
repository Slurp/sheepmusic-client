import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'
import { CLEAR, TOGGLE_LOADING, TOGGLE_SIDE_BAR } from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules,
  state: {
    sideBarVisible: false,
    loadingScreen: false
  },

  actions: {
    /**
     * Call the CLEAR mutation on every module it exists on, thus clearing the store of any relevant data.
     * This action should be called by the authentication handler, when the user is logging out.
     *
     * That way, every module can handle clearing its data individually.
     *
     * @param commit
     */
    clearStore: ({ commit }) => Object.keys(modules).forEach((key) => {
      if (modules[key].mutations && modules[key].mutations[CLEAR]) {
        commit(`${key}/${CLEAR}`)
      }
    }),

    /**
     * Toggle visibility of sidebar.
     *
     * @param commit
     */
    toggleSideBar: ({ commit }) => commit(TOGGLE_SIDE_BAR),
    toggleLoading: ({ commit }) => commit(TOGGLE_LOADING)
  },

  mutations: {
    [TOGGLE_SIDE_BAR]: (state) => {
      state.sideBarVisible = !state.sideBarVisible
    },
    [TOGGLE_LOADING]: (state) => {
      state.loadingScreen = !state.loadingScreen
    }
  },
  getters: {
    loading: state => {
      return state.loadingScreen
    }
  }
})

export default store
