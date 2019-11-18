<template>
  <v-container>
    <v-row text-center>
      <v-col cols="4">
        <v-checkbox v-model="showDone" label="Show Hit Targets"></v-checkbox>
      </v-col>
      <v-col cols="4" offset="4">
        <v-select v-model="filter1" :items="displayOptions" label="Display First By..."></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
          <transition-group name="list" tag="ul" class="ul-list">
            <li v-for="target in targets" :key="target.title" class="list-item">
              <v-card hover
            class="mb-3"
            max-height="5rem"
            :color="categoriesColors[target.category]">
            <v-card-title class="pa-2">
              <v-icon class="mr-2">mdi-pencil</v-icon>
              <v-toolbar-title>{{ target.title }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <!-- <TimeStatus width="30px" height="30px" :timer="getTimeRemaining(target.timeStart, target.timeLimit)" /> -->
              <v-spacer></v-spacer>
              <!-- TBU transition group sur le changement de status -->
              <v-checkbox @change="changeDoneStatus(target.id, $event)"
                :value="target.done"></v-checkbox>
            </v-card-title>
          </v-card>
            </li>
          </transition-group>
      </v-col>
    </v-row>

    <v-row v-if="showDone">
      <v-col cols="12" md="6" offset-md="3">
        <h3>Archived Targets</h3>
        <v-card v-for="target in archivedTargets" :key="target.id"
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
    
  
  </v-container>
</template>

<script>
import firebase from 'firebase'
// import TimeStatus from '@/components/TimeStatus.vue';

export default {
  name: 'Targets',
  // components: { TimeStatus },
  data() {
    return {
      archived: true,
      categoriesColors: {
        perso: '#0000ff',
        pro: '#00ff00',
        home: '#ffff00',
      }, // TBU when state set up
      categoriesOrder: {
        perso: 3,
        pro: 1,
        home: 2,
      }, // TBU when state set up
      filter1: 'time',   // TBU when state set up (coming from User preferences)
      // targets: [
      //   { 
      //     title: 'Walking', 
      //     done: null, 
      //     category: 'perso', 
      //     recurring: true, 
      //     timeStart: 1573945200000,
      //     timeLimit: 1574031599000 
      //   },
      //   { 
      //     title: 'Reading', 
      //     done: null, 
      //     category: 'perso', 
      //     recurring: true,
      //     timeStart: 1573945200000,
      //     timeLimit: 1574031599000 
      //   },
      //   { 
      //     title: 'Target App', 
      //     done: null, 
      //     category: 'pro', 
      //     recurring: false, 
      //     timeStart: 1573945200000,
      //     timeLimit: 1573948800000  
      //   },
      //   {
      //     title: 'Tweening Node',
      //     done: null,
      //     category: 'pro',
      //     recurring: false,
      //     timeStart: 1573945200000,
      //     timeLimit: 1574208000000
      //   }
      // ],
      targets: [
        { id: 100, title: 'test100', category: 'perso', timeLimit: 100, done: null },
        { id: 101, title: 'test101', category: 'pro', timeLimit: 100, done: null },
        { id: 102, title: 'test102', category: 'home', timeLimit: 100, done: null },
        { id: 103, title: 'test103', category: 'home', timeLimit: 103, done: null },
        { id: 108, title: 'test108', category: 'pro', timeLimit: 108, done: true },
        { id: 104, title: 'test104', category: 'perso', timeLimit: 104, done: null },
        { id: 105, title: 'test105', category: 'pro', timeLimit: 104, done: null },
        { id: 106, title: 'test106', category: 'perso', timeLimit: 106, done: true },
        { id: 107, title: 'test107', category: 'pro', timeLimit: 107, done: null },
      ],  // TBD - used to test orderedTargets.

      displayOptions: ['category', 'time'],
      showDone: false,

    };
  },

  computed: {
    archivedTargets() {
      let archived = [...this.targets];
      return archived.filter(target => target.done);
    },
    orderedTargets() {
      let sorted = [...this.targets];
      if (this.filter1 === 'time') {
        return sorted.sort((a, b) => a.timeLimit - b.timeLimit || this.categoriesOrder[a.category] - this.categoriesOrder[b.category]);
      } 
      return sorted.sort((a, b) => this.categoriesOrder[a.category] - this.categoriesOrder[b.category] || a.timeLimit - b.timeLimit);
    },
    displayedTargets() {
      let targets = [...this.orderedTargets];
      if (this.showDone) return this.orderedTargets;
      return targets.filter(target => !target.done);
    },
  },

  mounted() {
    console.log('currentUser', firebase.auth().currentUser);
  },

  methods: {
    getTimeRemaining(timeStart, timeLimit) {
      // let currentTime = Date.now();
      let currentTime = 1573981200000;
      let timeAlloted = timeLimit - timeStart;
      let timeRemaining = timeLimit - currentTime;
      return (timeRemaining / timeAlloted);
    },
    changeDoneStatus(id, evt) {
      // TBU when back set up
      console.log('changeDoneStatus for id', id, evt);
      let i = this.targets.findIndex(target => target.id === id);
      this.targets = [...this.targets.slice(0, i), ...this.targets.slice(i+1)];
    },
  },

}
</script>

<style lang="css" scoped>

* {
  --list-time: .6s;
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
  transition-delay: var(--list-time);
}

.list-item {
  width: 100%;
  list-style-type: none;
}
</style>