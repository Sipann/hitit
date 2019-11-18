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

    <v-avatar color="teal" size="48">
      <span class="white--text ">VA</span>  
      <!-- Content of Span: TBU -->
    </v-avatar>


  </v-app-bar>
  </v-container>

  
</template>

<script>
import firebase from 'firebase';

export default {
  name: 'NavBar',

  data() {
    return {
      sideNav: false,
      user: null,    
    };
  },

  computed: {
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
  },

  created() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }
    })
  },

  methods: {
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