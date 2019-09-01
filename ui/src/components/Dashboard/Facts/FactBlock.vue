<template lang="pug">
  .card(:class='{ opened: editMode }')
    .left
      form(v-if='editMode', @submit='handleFormSubmit')
        .input-container
          label The fact:
          textarea(name='text', placeholder='Full text of the fact')
            | {{ fact.text }}
        .input-container
          label Category:
          select(name='category', :value='fact.category.id')
            option(
              v-for='cat in categories'
              :value='cat.id'
            ) {{ cat.name }}
        .input-container
          label Background:
          select(
            name='background'
            :value='fact.background.id'
            @change='handleBackgroundChange'
          )
            option(
              v-for='background in backgrounds'
              :value='background.id'
            ) {{ background.name }}
          .background-preview(v-if='previewImg')
            a(:href='this.previewImg.url', target='_blank')
              img(
                :src='createThumbnail(this.previewImg.url)'
                :alt='this.previewImg.name'
              )
        .input-container
          button(type='submit') Save
          button(@click='toggleEditMode') Cancel
      .info(v-else=true)
        .text
          text-with-search-highlight(
            :text='fact.text'
            :q='q'
          )
        .category Category: {{ fact.category.name }}
        .background
          | Background:&nbsp;
          a(:href='fact.background.url', target='_blank') {{ fact.background.url }}
    .right
      .actions
        a(
          href='javascript://'
          v-tooltip.bottom='editButtonText'
          @click='toggleEditMode'
        )
          i.fa.fa-times(v-if='editMode')
          i.fa.fa-pencil(v-else=true)
        a(
          href='javascript://'
          v-tooltip.bottom='removeButtonText'
          @click='handleRemoveClick'
        )
          i.fa.fa-trash-o
</template>

<script>
import Toaster from 'lib/toaster';
import errors from 'lib/errors';

export default {
  name: 'fact-block',
  props: {
    fact: { type: Object, required: true },
    q: { type: String }
  },
  data: function () {
    return {
      editButtonText: 'Edit Fact',
      removeButtonText: 'Remove Fact',
      editMode: false,
      previewImg: null
    };
  },
  computed: {
    fetchUrl: function () {
      return `/api/facts/${this.fact.id}`;
    },

    categories: function () {
      return this.$store.state.categories;
    },

    backgrounds: function () {
      return this.$store.state.backgrounds;
    }
  },
  mounted: function () {
    if (!this.categories) {
      this.$store.dispatch('fetchCategories');
    }
    if (!this.backgrounds) {
      this.$store.dispatch('fetchBackgrounds');
    }
  },
  methods: {
    toggleEditMode: function (e) {
      e.preventDefault();

      this.editMode = !this.editMode;
      if (this.editMode) {
        this.editButtonText = 'Cancel';
        this.previewImg = this.fact.background;
      } else {
        this.editButtonText = 'Edit Fact';
        this.previewImg = null;
      }
    },

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
            this.previewImg = null;
            this.$store.commit('updateFact', json.data);
            const message = 'Fact updated successfully!';
            Toaster.create('success', message, 'Yay!');
          } else if (json.errors) {
            json.errors.forEach(error => Toaster.create('danger', errors.factUpdate[error.code]));
          } else {
            Toaster.create('danger', 'Something bad happened');
          }
        });
    },

    handleRemove: function () {
      fetch(this.fetchUrl, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      })
        .then(data => data.json())
        .then(json => {
          if (json.ok) {
            this.$store.commit('removeFact', json.data);
            Toaster.create('success', 'Fact removed successfully!');
          } else {
            Toaster.create('danger', 'Failed to remove fact.');
          }
        });
      this.$modal.hide('dialog');
    },

    cancelRemove: function () {
      Toaster.create('info', 'Fact not removed.', 'Whew!');
      this.$modal.hide('dialog');
    },

    handleRemoveClick: function () {
      this.$modal.show('dialog', {
        title: 'Confirm Removal',
        text: 'Are you sure you want to remove this fact?',
        buttons: [
          {
            title: 'No, keep it',
            default: true,
            handler: this.cancelRemove
          },
          {
            title: 'Sure, remove it!',
            handler: this.handleRemove
          }
        ]
      });
    },

    handleFormSubmit: function (e) {
      e.preventDefault();

      this.save({
        text: e.target.text.value,
        categoryId: e.target.category.value,
        backgroundId: e.target.background.value
      });
    },

    handleBackgroundChange: function (e) {
      const id = parseInt(e.currentTarget.value);
      this.previewImg = find(this.backgrounds, { id });
    },

    createThumbnail: function (url) {
      const dot = url.lastIndexOf('.');
      return `${url.substr(0, dot)}m.${url.substr(dot + 1)}`;
    }
  }
};
</script>

<style lang="scss" scoped>
  .opened .left {
    width: 75%;

    @media only screen and ( max-width: 660px ) {
      width: auto;
    }
  }

  .background-preview {
    background: #efefef;
    margin-bottom: 20px;
    padding: 20px;
    text-align: center;
  }

  .input-container {
    button {
      display: inline-block;
      width: auto;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .info {
    .text {
      font-weight: 700;
    }

    .category, .background {
      font-size: 14px;
    }
  }
</style>
