<template lang="pug">
  .abs-mid
    h1.title Page not found!
    p That's a 404. Maybe go back to the&nbsp;
      router-link(to='/') home page?
</template>

<script>
export default {
  name: 'not-found'
};
</script>

<style lang="scss">
  .abs-mid {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
