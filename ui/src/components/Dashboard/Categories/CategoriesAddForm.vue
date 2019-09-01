<template lang="pug">
  form(@submit='handleSubmit').category-add-form
    .input-container
      input(name='name', placeholder='Category name')
      button(type='submit') Save
      button(@click='handleCancel') Cancel
</template>

<script>
import Toaster from 'lib/toaster';
import errors from 'lib/errors';

export default {
  name: 'category-add-form',
  methods: {
    save: function (body) {
      fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(body)
      })
        .then(data => data.json())
        .then(json => {
          if (json.ok) {
            this.$store.commit('createCategory', json.data);
            const message = `Category "${json.data.name}" created successfully!`;
            Toaster.create('success', message, 'Yay!');
            this.$emit('cancel');
          } else if (json.errors) {
            json.errors.forEach(error => Toaster.create('danger', errors.categoryCreation[error.code]));
          } else {
            Toaster.create('danger', 'Something went wrong');
          }
        });
    },

    handleSubmit: function (e) {
      e.preventDefault();
      this.save({
        name: e.target.name.value
      });
    },

    handleCancel: function (e) {
      e.preventDefault();
      this.$emit('cancel');
    }
  }
};
</script>

<style lang="scss" scoped>
  .category-add-form {
    .input-container {
      display: flex;
      align-items: center;
      justify-content: space-between;

      input, button {
        margin-right: 10px;
      }

      button {
        width: auto;

        &:last-child {
          margin-right: 0;
        }
      }

      @media only screen and ( max-width: 660px ) {
        display: block;

        button {
          display: inline-block;
        }
      }
    }
  }
</style>
