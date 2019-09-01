<template lang="pug">
  .loading-container
    img(
      src='./loading.svg'
      alt='Loading...'
    )
</template>

<script>
import Vue from 'vue';

export default Vue.component('loading-spinner', {});
</script>

<style lang="scss">
  .loading-container {
    text-align: center;
    margin: 30px auto;
  }
</style>
