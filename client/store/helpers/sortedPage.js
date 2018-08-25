import { set } from 'store/helpers/mutations'

export const sortedState = {
  sortedList: [],
  page: 1,
  sortBy: 'all',
  itemsPerPage: 24
}

export const sortedActions = {
  async paginate({ commit }, page) {
    commit('PAGINATE', page)
  },
  async sortBy({ commit }, sort) {
    commit('SORT_BY', { sort })
  }
}

export const sortedMutations = {
  PAGINATE: set('page'),
  SORT_BY: (state, { sortBy }) => {
    if (sortBy !== state.sortBy) {
      if (sortBy === 'recent') {
        state.sortedList.sort((a, b) => b.date - a.date)
      } else if (sortBy === 'most-played') {
        state.sortedList.sort((a, b) => b.playCount - a.playCount)
      } else {
        state.sortedList.sort((a, b) => a.id - b.id)
      }
      state.sortBy = sortBy
    }
  }
}
