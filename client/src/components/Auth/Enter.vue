<template>
  <v-container>
    <transition name="flip" mode="out-in">
      <router-view></router-view>    
    </transition>
  </v-container>
</template>

<script>

export default {
  name: 'Enter',

  data() {
    return {

    };
  },

  

  methods: {
    
  },


}
</script>

<style lang="css">

.flip-enter-active,
.flip-leave-active {
  transition-property: transform;
  transition-duration: .6s;
  transition-timing-function: linear;
  backface-visibility: hidden;
}

.flip-enter {
  transform: rotate3d(0, 1, 0, -90deg);
}

.flip-leave-to {
  transform: rotate3d(0, 1, 0, 90deg);
}


</style>