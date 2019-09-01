<template lang="pug">
  auth-template
    .description Please log in using the form below.
    form(action='/api/login', method='POST', @submit='handleLoginSubmit')
      input(name='username', placeholder='Username')
      input(type='password', name='password', placeholder='Password')
      button(type='submit') Log In
    .authbox-bottom
      | If you have forgotten your password, please ask the owner&nbsp;
      | for a new one.
</template>

<script>
import AuthTemplate from 'components/Auth/AuthTemplate';
import Toaster from 'lib/toaster';
import errors from 'lib/errors';

export default {
  name: 'login-page',
  components: {
    'auth-template': AuthTemplate
  },
  methods: {
    handleLoginSubmit: function (e) {
      e.preventDefault();
      fetch('/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value
        })
      })
        .then(data => data.json())
        .then(json => {
          if (json.ok) {
            this.$store.commit('setUser', json.user);
            Toaster.create('success', `Welcome back, ${json.user.name}!`);
            this.$router.push('/dashboard/home');
          } else if (json.errors && json.errors.length) {
            json.errors.forEach(error => Toaster.create('danger', errors[error.code]));
          } else {
            Toaster.create('danger', 'Something bad happened...', 'Ouch!');
          }
        });
    }
  }
};
</script>
