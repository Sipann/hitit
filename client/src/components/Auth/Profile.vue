<template>
  <v-container>
    <!-- User info -->
    <v-row>
      <v-col cols="12">
        <CustomProfile />
      </v-col>
    </v-row>

    <!-- User Customization - Categories Titles && Colors -->
    <v-row>
      <v-col>
        <CustomCategories />
        <CustomDisplayOrder />
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import CustomProfile from './CustomProfile.vue';
import CustomCategories from './CustomCategories.vue';
import CustomDisplayOrder from './CustomDisplayOrder.vue';

export default {
  name: 'Profile',
  components: { CustomProfile, CustomCategories, CustomDisplayOrder },
}
</script>