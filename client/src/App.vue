<template>
  <v-app>
    <NavBar />
    <v-content>
      <Home />
    </v-content>
  </v-app>
</template>

<script>
import Home from './views/Home';
import NavBar from './components/Shared/NavBar';

export default {
  name: 'App',

  components: {
    NavBar,
    Home,
  },

  data: () => ({
    //
  }),
};
</script>
