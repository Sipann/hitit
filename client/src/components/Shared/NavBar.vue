<template>

  <v-container fluid>

    <v-navigation-drawer app temporary fixed v-model="sideNav">
      <v-toolbar dark text>
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">Hit It!</h1>
        </router-link>
      </v-toolbar>
      <v-divider></v-divider>
      <v-list>
        <v-list-item ripple v-for="item in sideNavItems" :key="item.title" :to="item.link">
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" dark app>
    <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
    <v-toolbar-title class="hidden-xs-only">
      <router-link to="/" tag="span" style="cursor: pointer">HiT iT!</router-link>
    </v-toolbar-title>

    <v-spacer></v-spacer>

    <v-toolbar-items class="hidden-xs-only">
      <v-btn text v-for="item in horizontalNavItems" :key="item.title" :to="item.link">
        <v-icon class="hidden-sm-only" left>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-btn>

      <v-btn text v-if="user" @click="signoutUser">
        <v-icon class="hidden-sm-only" left>mdi-exit-to-app</v-icon>Sign Out
      </v-btn>
    </v-toolbar-items>

    <router-link to="/profile" v-if="user">
      <v-avatar color="teal" size="48">
        <span class="white--text ">{{ initial }}</span>  
      </v-avatar>
    </router-link>


  </v-app-bar>
  </v-container>

  
</template>

<script>
import firebase from 'firebase';
import { GET_USER_DATA } from '../../queries';

export default {
  name: 'NavBar',

  data() {
    return {
      sideNav: false,
      user: null,    
    };
  },

  computed: {

    // user() {
    //   return this.$store.state.user;
    // },


    horizontalNavItems() {
      let items = [];
      if (this.user) {
        items = [
          { icon: 'mdi-target', title: 'Targets', link: '/targets' },
        ];
      } else {
        items = [
          { icon: 'mdi-lock-open', title: 'Enter', link: '/enter' },
        ];
      }
      return items;
    },

    initial() {
      return this.$store.getters.initial;
    },

    sideNavItems() {
      let items = [];
      if (this.user) {
        items= [
          { icon: 'mdi-target', title: 'Targets', link: '/targets' },
          { icon: 'mdi-pencil', title: 'Create Target', link: '/targets/add' },
          { icon: 'mdi-account', title: 'Profile', link: '/profile' },
        ];
      } else {
        items = [
           { icon: 'mdi-lock-open', title: 'Enter', link: '/enter' },
        ];
      }
      return items;
    },

    username() {
      return this.$store.state.user ? this.$store.state.user.username : '';
    },
  },

  created() {
    firebase.auth().onAuthStateChanged(user => {
       if (user) {
         this.user = user;
         console.log('auth state changed, we have a user');
         console.log('this.user', this.user);
         console.log('this.user.uid', this.user.uid);
         this.$emit('logged');
         this.getUserData();
       } else {
         console.log('auth state changed, user is NULL');
         this.user = null;
       }
     })
   },
  

  // created() {
  //   firebase.auth().onAuthStateChanged(user => {
  //     if (user) {
  //       this.user = user;
  //       // console.log('this.user.uid', this.user.uid);
  //       this.getUserData();
  //     } else {
  //       this.user = null;
  //     }
  //   })
  // },

  methods: {

    async getUserData() {
      try {
        let userData = await this.$apollo.query({
          query: GET_USER_DATA,
          variables: { userId: this.user.uid }
        });
        // console.log('userData', userData);
        let user = userData.data.user;
        this.$store.commit('setUser', user);
      } catch (err) {
        console.log('err', err);
      }
    },

    

    signoutUser() {
      firebase.auth().signOut()
        .then(() => {
          this.$router.push('/enter/signin');
        });
    },
    
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },

  }

}
</script>