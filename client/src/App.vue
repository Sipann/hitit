<template>
  <v-app>
    <NavBar @logged="authSnackbar = true" />
    <v-content>
      <router-view />
    </v-content>
    
    <!-- Auth Snackbar -->
    <v-snackbar color="success" bottom left
       v-model="authSnackbar"
       :timeout="5000">
       <v-icon class="mr-3">mdi-check-circle</v-icon>
       <h3>You are now signed in!</h3>
       <v-btn dark text @click="authSnackbar = false">Close</v-btn>
    </v-snackbar>

    
  </v-app>
</template>

<script>
import NavBar from './components/Shared/NavBar';

export default {
  name: 'App',

  components: { NavBar, },

  data: () => ({
    authSnackbar: false,
  }),

};
</script>
