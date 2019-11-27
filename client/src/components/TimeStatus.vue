<template>
  <svg viewBox="0 0 100 100" :width="width" :height="height">
    <circle cx="50" cy="50" r="50" :fill="baseColor" />
    <circle id="timer" cx="50" cy="50" r="25" stroke-width="50" :stroke="timeColor" :fill="baseColor" :style="timerStyle"/>
  </svg>
</template>

<script>
export default {
  name: 'TimeStatus',
  props: {
    baseColor: {
      type: String,
      default: '#888',
    },
    height: {
      type: String,
      required: true,
    },
    timeColors: {
      type: Array,
      default: function() {
        return ['green', 'orangered', 'red']
      },
      validator: function (value) {
        return value.every(val => typeof val === 'string');
      },
    },
    timer: {
      type: Number,
      default: 0,
      validator: function (value) {
        return value >=0 && value <= 1;
      },
    },
    width: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      totalLength: 156.07,  
    };
  },

  computed: {
    timeColor() {
      if (this.timer < 0.5) return this.timeColors[2];
      if (this.timer < 0.75) return this.timeColors[1];
      else return this.timeColors[0];
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