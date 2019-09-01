<template lang="pug">
  .zds
    i.fa.fa-frown-o
    span
      | It's pretty empty here!
</template>

<script>
import Vue from 'vue';

export default Vue.component('zero-data-state', {});
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .zds {
    font-weight: 500;
    color: $gray;

    i, span {
      display: inline-block;
      vertical-align: middle;
    }

    i {
      font-size: 5em;
      margin-right: 15px;
    }
  }
</style>
