<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <v-btn color="primary" dark @click.stop="dialogTarget = true">Add a New Target</v-btn>
    <v-dialog v-model="dialogTarget" max-width="650px">
      <TargetComponent @clearTarget="dialogTarget = false" />
    </v-dialog>
  </div>
</template>

<script>
import TargetComponent from '@/components/TargetComponent.vue'

export default {
  name: 'home',
  components: {
    TargetComponent
  },
  data() {
    return {
      dialogTarget: false,
    };
  },
}
</script>
