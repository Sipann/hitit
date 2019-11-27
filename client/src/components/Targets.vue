<template>
  <v-container>
    <v-row text-center v-if="targets.length">
      <v-col :cols="4">
        <v-checkbox v-model="showDone" label="Show Hit Targets"></v-checkbox>
      </v-col>
      <v-col :cols="4">
        <v-btn @click="isCreating = true">New Target</v-btn>
      </v-col>
      <v-col :cols="4">
        <v-select label="Display First By..." 
        :items="display_options"
        :value="displayPreference" @change="display = $event"></v-select>
      </v-col>
    </v-row>
    <v-row v-if="targets.length"> 
      <v-col cols="12" md="6" offset-md="3">
        <transition-group name="list" tag="ul" class="ul-list">
          <li v-for="target in targetsInitial" :key="target.title" class="list-item">
            <v-card hover
              class="mb-3"
              max-height="5rem"
              :class="{ future: isFuture(target.time_start) }"
              :color="categoriesColors[target.category]">
              <v-card-title class="pa-2">
                <v-icon class="mr-2" @click="editTarget(target)">mdi-pencil</v-icon>
                <v-toolbar-title>{{ target.title }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon v-if="isPast(target.time_limit)" class="time-status">mdi-alert-circle-outline</v-icon>
                <v-icon v-else-if="isFuture(target.time_start)" class="time-status">mdi-dots-horizontal</v-icon>
                <TimeStatus v-else-if="target.time_limit" class="time-status" width="30px" height="30px" 
                  base-color="#888"
                  :time-colors="['#04a777', '#f2c57c', '#fb4d3d']"
                  :timer="getTimeRemaining(target.time_start, target.time_limit)" />
                <!-- <v-spacer></v-spacer> -->
                <!-- TBU transition group sur le changement de status -->
                <v-checkbox @change="changeDoneStatus(target, $event)"
                  v-bind="target.done"></v-checkbox>
              </v-card-title>
            </v-card>
          </li>
        </transition-group>
      </v-col>
    </v-row>

    <v-dialog v-model="isEditing">
      <Target v-if="isEditing" :target="editedTarget" 
        @targetIssue="setError"
        @clearTarget="stopEditTarget" />
    </v-dialog>

    <v-dialog v-model="isCreating">
      <Target v-if="isCreating" 
        @targetIssue="setError"
        @clearTarget="stopEditTarget" />
    </v-dialog>

    <v-row v-if="showDone">
      <v-col cols="12" md="6" offset-md="3">
        <h3>Archived Targets</h3>
        <v-card v-for="target in archivedTargets" :key="target.title"
          hover
          class="mb-3"
          max-height="5rem"
          :color="categoriesColors[target.category]">
          <v-card-title class="pa-2">
            <v-toolbar-title>{{ target.title }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-checkbox v-model="archived"></v-checkbox>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="!targets.length">
      <v-card>
        <v-container>
          <h3>Welcome to your dashboard!</h3>
          <h4>What about setting your first target?</h4>
          <v-col :cols="4">
            <v-btn @click="isCreating = true">New Target</v-btn>
          </v-col>
        </v-container>
      </v-card>
    </v-row>

    <v-snackbar color="alert" bottom left
       v-model="errorSnackbar"
       :timeout="5000">
       <v-icon class="mr-3">mdi-check-circle</v-icon>
       <h3>{{ errorMessage }}</h3>
       <v-btn dark text @click="errorSnackbar = false">Close</v-btn>
    </v-snackbar>


  </v-container>
</template>

<script>

// import firebase from 'firebase'
import Target from '@/components/Target.vue';
import { mapGetters } from 'vuex';
import TimeStatus from '@/components/TimeStatus.vue';
import { deepCopy } from '@/utils';
// import { SET_TARGET_DONE } from '../queries';

export default {
  name: 'Targets',
  components: { TimeStatus, Target },
  data() {
    return {
      archived: true,
      display: null,
      editedTarget: null,
      errorMessage: '',
      errorSnackbar: false,
      isCreating: false,
      isEditing: false,
      showDone: false,
      targetsInitial: [],
    };
  },

  computed: {
    ...mapGetters(['categoriesColors', 'categoriesOrder', 'display_options']),

    displayChoice() {
      return this.display ? this.display : this.displayPreference;
    },

    displayPreference() {
      return this.$store.state.user ? this.$store.state.user.display_preference : '';
    },

    archivedTargets() {
      let archived = deepCopy(this.targets);
      return archived.filter(target => target.done);
    },



    // targets() {
    //   return this.$store.state.user.targets;
    // },

    targets: {
      get() {
        return this.$store.state.user.targets;
      },
      // set(newValue) {
      //   this.targetsInitial = deepCopy(newValue);
      // }
    },

    // displayedTargets() {
    //   let targets = [...this.orderedTargets];
    //   return targets.filter(target => !target.done);
    // },

    displayedTargets: {
      get() {
        let targets = deepCopy(this.orderedTargets);
        return targets.filter(target => !target.done);
      },
      set(newValue) {
        this.targetsInitial = deepCopy(newValue); 
      }
    },

    orderedTargets() {
      // let sorted = [...this.targets];
      let sorted = deepCopy(this.targets);
      if (this.displayChoice === 'deadline') {
        return sorted.sort((a, b) => a.time_limit - b.time_limit || this.categoriesOrder[a.category] - this.categoriesOrder[b.category]);
      } 
      return sorted.sort((a, b) => this.categoriesOrder[a.category] - this.categoriesOrder[b.category] || a.time_limit - b.time_limit);
    },

    

  },

  mounted() {
    this.targetsInitial = this.displayedTargets;
  },

  watch: {
    // targets: function (newValue) {
    //   console.log('targets is changing to', newValue);
    //   this.targetsInitial = deepCopy(newValue);
    // },
    displayedTargets: function (newValue) {
      this.targetsInitial = deepCopy(newValue);
    },
  },

  methods: {

    setError(e) {
      this.errorMessage = e;
      this.errorSnackbar = true;
    },

    async changeDoneStatus(target, e) {
      // Vuex store
      setTimeout(async () => {
        await this.$store.dispatch('setTargetDone', {target, e});
        if (target.recurring) {
          await this.$store.dispatch('resetRecurringTarget', target);
        }
      }, 500);
      
      // db firestore
      const variables = {
        userId: this.$store.state.user.username,
        targets: this.$store.state.user.targets,
      };
      console.log('sending graphql request with variables', variables);
      // await this.$apollo.mutate({
      //   mutation: SET_TARGET_DONE,
      //   variables,
      // });

    },

    editTarget(target) {
      this.isEditing = true;
      this.editedTarget = {...target};
    },
    
    getTimeRemaining(timeStart, timeLimit) {
      let currentTime = Date.now();
      // let currentTime = 1574636399000;
      let timeAlloted = timeLimit - timeStart;
      let timeRemaining = timeLimit - currentTime;
      return (timeRemaining / timeAlloted);
    },
    
    isFuture(timeStart) {
      return Date.now() < timeStart ? true : false;
    },

    isPast(timeLimit) {
      return Date.now() > timeLimit ? true : false;
    },

    stopEditTarget() {
      this.isCreating = false;
      this.isEditing = false;
      this.editedTarget = null;
    },

    updateDisplay(e) {
      this.display = e;
    },
  },

}
</script>

<style lang="css" scoped>

* {
  --list-time: .6s;
  --list-delay: .6s;
}

.ul-list {
  position: relative;
}

.list-leave-active {
  transition: transform var(--list-time) ease-in;
  position: absolute;
}

.list-enter,
.list-leave-to {
  transform: translateX(-100vw);
}

.list-move {
  transition-property: transform;
  transition-duration: var(--list-time); 
  transition-delay: var(--list-delay);
}

.list-item {
  width: 100%;
  list-style-type: none;
}

.time-status {
  margin-right: 2rem;
}

.future {
  opacity: 0.5;
}



</style>