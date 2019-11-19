import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import firebase from 'firebase';
import { createProvider } from './vue-apollo'

Vue.config.productionTip = false

let app = null;

// firebase auth init
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      vuetify,
      apolloProvider: createProvider(),
      render: h => h(App)
    }).$mount('#app')
  }
});

