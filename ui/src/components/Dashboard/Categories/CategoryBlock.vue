<template lang="pug">
  .card(:class='{ "opened": editMode }')
    .left
      form(@submit='handleSubmit', v-if='editMode').name-input
        input(name='name', :value='category.name', autocomplete='off')
      .name(v-else=true) {{ category.name }}
    .right
      .actions
        a(
          href='javascript://'
          v-tooltip.bottom='editButtonText'
          @click='toggleEditMode'
        )
          i.fa.fa-times(v-if='editMode')
          i.fa.fa-pencil(v-else=true)
</template>

<script>
import Toaster from 'lib/toaster';
import errors from 'lib/errors';
export default {
  name: 'category-block',
  props: {
    category: { type: Object, required: true }
  },
  data: function () {
    return {
      editButtonText: 'Edit Category',
      cancelText: 'Cancel',
      editMode: false
    };
  },
  computed: {
    fetchUrl: function () {
      return `/api/categories/${this.category.id}`;
    }
  },
  methods: {
    save: function (body) {
      fetch(this.fetchUrl, {
        method: 'PATCH',
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
            this.editMode = false;
            this.$store.commit('updateCategory', json.data);
            const message = `${json.data.name} updated successfully!`;
            Toaster.create('success', message, 'Yay!');
          } else if (json.errors) {
            json.errors.forEach(error => Toaster.create('danger', errors.categoryUpdate[error.code]));
          } else {
            Toaster.create('danger', 'Something bad happened');
          }
        });
    },

    toggleEditMode: function () {
      this.editMode = !this.editMode;
      if (this.editMode) {
        this.editButtonText = 'Cancel';
      } else {
        this.editButtonText = 'Edit Category';
      }
    },

    handleSubmit: function (e) {
      e.preventDefault();
      this.save({ name: e.target.name.value });
    }
  }
};
</script>

<style lang="scss" scoped>
  @media only screen and ( max-width: 660px ) {
    .card {
      display: flex;

      .left .name-input input {
        width: 180px;
      }
    }
  }
</style>
