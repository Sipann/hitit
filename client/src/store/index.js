import Vue from 'vue'
import Vuex from 'vuex'

import moment from 'moment';
import { deepCopy } from '../utils';

// import { defaultClient as apolloClient } from '../main.js'

// import { createProvider } from '../vue-apollo'
// // let apolloClient = this.$apollo.provider.defaultClient;
// console.log('createProvider', createProvider().defaultClient);
// let apolloClient = createProvider().defaultClient;

// import { 
//   GET_USER_DATA, 
//   UPDATE_USER_DATA,
// } from '../queries';


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      display_preference: '',
      username: '',
      target_categories: [],
      targets: [],
    },
  },
  mutations: {

    addCategory: (state, payload) => {
      // const currentCategoriesLength = state.user.target_categories.length;
      // const newCategory = {
      //   color: '#555555',
      //   order: currentCategoriesLength,
      //   title: payload,
      // };
      // state.user.target_categories = [...state.user.target_categories, newCategory];
      console.log('addCategory payload', payload);
      state.user.target_categories = [...state.user.target_categories, { ...payload }];
    },

    addTarget: (state, payload) => {
      // state.user.targets = [...state.user.targets, payload];
      console.log('addTarget payload', payload);
      state.user.targets = [...state.user.targets, { ...payload }];
    },

    deleteTarget: (state, payload) => {
      console.log('deleteTarget payload', payload);
      let targets = deepCopy(state.user.targets);
      targets = targets.filter(target => target.title !== payload);
      state.user.targets = deepCopy(targets);

    },
    
    resetRecurringTarget: (state, payload) => {
      const resetTarget = {...payload};
      const currentPeriodEnd = moment().endOf(payload.period);
      const newStart = moment(currentPeriodEnd).add(1, 'seconds');
      const newEnd = moment(newStart).endOf(payload.period);
      resetTarget.done = false;
      resetTarget.time_start = newStart._d.getTime();
      resetTarget.time_limit = newEnd._d.getTime();
      state.user.targets = [...state.user.targets, resetTarget];
    },
    
    setTargetDone: (state, payload) => {
      let i = state.user.targets.findIndex(target => target.title === payload.target.title);
      state.user.targets[i].done = payload.e;
    },
    
    // setUser: (state, { data }) => {
    //   state.user = data.user;
    // },

    setUser: (state, {username, display_preference, targets, target_categories}) => {
      console.log('store setUser mutation with payload : username', username, 'display_preference', display_preference, 'targets', targets, 'target_categories', target_categories);
      if (!username) {
        state.user = '';
        state.user.display_preference = '';
        state.user.targets = [];
        state.user.target_categories = [];
      } else {
        state.user.username = username;
        state.user.display_preference = display_preference;
        let target_categories_clean = target_categories.map(cat => {
          return {title: cat.title, order: cat.order, color: cat.color};
        });
        console.log('target_categories_clean', target_categories_clean);
        let targets_clean = targets.map(target => {
          return { 
            title: target.title, 
            category: target.category, 
            duration: target.duration,
            end_date: target.end_date, 
            recurring: target.recurring,
            time_limit: target.time_limit,
            time_start: target.time_start, 
          };
        });
        console.log('targets sent', targets);
        console.log('targets_clean', targets_clean);
        state.user.targets = targets_clean;
        state.user.target_categories = target_categories_clean;
        // state.user.targets = deepCopy(targets);
        // state.user.target_categories = deepCopy(target_categories);
      }
    },

    updateLocalTargetCategories: (state, payload) => {
      state.user.target_categories = payload;
    },

    updateTarget: (state, payload) => {
      console.log('updateTarget payload', payload);
      let targetIndex = state.user.targets.findIndex(item => item.title === payload.title);
      console.log('targetIndex', targetIndex);
      state.user.targets[targetIndex] = payload;
    },

    updateTargets: (state, payload) => {
      state.user.targets = payload;
    },

  },

  actions: {
    addCategory: ({ commit }, payload) => {
      commit('addCategory', payload);
    },

    addTarget: ({ commit }, payload) => {
      commit('addTarget', payload);
    },

    deleteTarget: ({ commit }, payload) => {
      commit('deleteTarget', payload);
    },

    resetRecurringTarget: ({ commit }, payload) => {
      commit('resetRecurringTarget', payload);
    },

    setTargetDone: ({ commit }, payload) =>  {
      commit('setTargetDone', payload);
    },

    updateTarget: ({ commit}, payload) => {
      commit('updateTarget', payload);
    },

    updateTargets: ({ commit }, payload) => {
      commit('updateTargets', payload);
    },

  },
  getters: {
    categories: state => {
      if (state.user) {
        return state.user.target_categories.reduce((acc, curr) => {
          acc.push(curr.title);
          return acc;
        }, []);
      } else { return []; }
    },

    categoriesColors: state => {
      if (state.user) {
        return state.user.target_categories.reduce((acc,curr) => {
          acc[curr.title] = curr.color;
          return acc;
        }, {});
      } else { return []; }
    },

    categoriesOrder: state => {
      if (state.user) {
        return state.user.target_categories.reduce((acc,curr) => {
          acc[curr.title] = curr.order;
          return acc;
        }, {});
      } else { return []; }
    },

    display_options: () => {
      return ['category', 'deadline'];
    },

    timeUnits: () => {
      // return ['minute(s)', 'hour(s)', 'day(s)'];
      return [ 'MINUTES', 'HOURS', 'DAYS' ];
    },

    frequencies: () => {
      // return ['day', 'week', 'month', 'quarter', 'semester', 'year'];
      return ['DAY', 'WEEK', 'MONTH', 'QUARTER', 'SEMESTER', 'YEAR']; 
    },

    initial: state => {
      if (state.user.username) {
        let username = state.user.username;
        return username[0].toUpperCase();
      } else { return ''; }
    },
  },

  modules: {
  }

})
