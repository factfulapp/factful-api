<template lang="pug">
  .authbox
    router-link.logo(to='/') Factful App
    .wrapper
      slot
</template>

<script>
export default {
  name: 'auth-template'
};
</script>

<style lang="scss">
  @import 'src/styles/base';
  @import 'src/styles/colors';

  .authbox {
    text-align: center;
    background: #fff;
    box-sizing: border-box;
    border-radius: 5px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    padding: 30px;

    .logo {
      display: inline-block;
      font-size: 34px;
      font-weight: 700;
      color: $blue;
    }

    .description {
      color: #555;
      margin-bottom: 15px;
    }

    .authbox-bottom {
      font-size: 14px;
      margin-top: 20px;
    }

    @media only screen and ( max-width: 460px ) {
      width: auto;
      position: static;
      transform: none;
    }
  }
</style>
