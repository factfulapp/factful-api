<template lang="pug">
  span.search-highlight
    span.before-q {{ beforeq }}
    span.q-highlight {{ displayq }}
    span.after-q {{ afterq }}
</template>

<script>
import Vue from 'vue';

export default Vue.component('text-with-search-highlight', {
  props: {
    text: { type: String, required: true },
    q: { type: String }
  },
  computed: {
    beforeq: function () {
      if (this.q && this.q.length && this.text.toLowerCase().includes(this.q.toLowerCase())) {
        return this.text.substr(0, this.text.toLowerCase().indexOf(this.q.toLowerCase()));
      } else {
        return this.text;
      }
    },

    displayq: function () {
      if (this.q && this.q.length && this.text.toLowerCase().includes(this.q.toLowerCase())) {
        return this.text.substr(this.text.toLowerCase().indexOf(this.q.toLowerCase()), this.q.length);
      } else {
        return null;
      }
    },

    afterq: function () {
      if (this.q && this.q.length && this.text.toLowerCase().includes(this.q.toLowerCase())) {
        return this.text.substr(this.text.toLowerCase().indexOf(this.q.toLowerCase()) + this.q.length);
      } else {
        return null;
      }
    }
  }
});
</script>

<style lang="scss">
  .q-highlight {
    background: yellow;
  }
</style>
