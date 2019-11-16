<template>
  <svg viewBox="0 0 100 100" :width="width" :height="height">
    <circle cx="50" cy="50" r="50" :fill="baseColor" />
    <circle id="timer" cx="50" cy="50" r="25" stroke-width="50" :stroke="timeColor" :fill="baseColor" :style="timerStyle"/>
  </svg>
</template>

<script>
export default {
  name: 'TimeStatus',
  props: ['timer', "width", "height"],

  data() {
    return {
      baseColor: '#888',
      totalLength: 156.07,  
    };
  },

  computed: {
    timeColor() {
      if (this.timer < 0.5) return 'red';
      if (this.timer < 0.75) return 'yellow';
      else return 'green';
    },
    timerStyle() {
      return `stroke-dasharray: ${this.totalLength * (1 - this.timer)} ${this.totalLength * this.timer }`;
    },
  },

}
</script>

<style lang="css" scoped>

#timer {
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

</style>