<template lang="pug">
  .card(:class='{ opened: editMode }')
    .left
      .preview
        a(
          :href='background.url'
          target='_blank'
          v-tooltip.bottom='openNewTabHint'
        )
          img(:src='thumbnailUrl', :alt='background.name')
      .info
        form(@submit='handleSubmit', v-if='editMode').name-input
          input(name='name', :value='background.name', autocomplete='off')
        .name(v-else=true)
          text-with-search-highlight(
            :text='background.name'
            :q='q'
          )
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
  name: 'background-item',
  props: {
    background: { type: Object, required: true },
    q: { type: String }
  },
  data: function () {
    return {
      openNewTabHint: 'Open in new tab',
      editButtonText: 'Edit Background Name',
      cancelText: 'Cancel',
      editMode: false
    };
  },
  computed: {
    fetchUrl: function () {
      return `/api/backgrounds/${this.background.id}`;
    },
    thumbnailUrl: function () {
      const url = this.background.url;
      const dot = url.lastIndexOf('.');
      return `${url.substr(0, dot)}m.${url.substr(dot + 1)}`;
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
            this.$store.commit('updateBackground', json.data);
            const message = `${json.data.name} updated successfully!`;
            Toaster.create('success', message, 'Yay!');
          } else if (json.errors) {
            json.errors.forEach(error => Toaster.create('danger', errors.backgroundUpdate[error.code]));
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
        this.editButtonText = 'Edit Background Name';
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
  .card {
    .left {
      display: flex;
      align-items: center;

      .preview {
        width: 200px;
        margin-right: 10px;

        img {
          width: 100%;
        }
      }
    }

    @media only screen and ( max-width: 660px ) {
      .left {
        display: block;
        text-align: center;

        .preview {
          width: auto;
          margin-right: 0;
          margin-bottom: 10px;

          img {
            max-height: 250px;
            width: auto;
          }
        }
      }

      .actions {
        text-align: center;
      }

      .name-input {
        input {
          width: 100%;
        }
      }
    }
  }
</style>
