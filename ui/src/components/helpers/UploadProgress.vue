<template lang="pug">
  .upload-progress(:class='{ active: isActive }')
    .upload-name {{ uploadName }}
    .progress
      .progress-bar(:style='progressBarStyles')
</template>

<script>
function truncate (str, len) {
  if (str.length > len) {
    return `${str.slice(0, len)}...`;
  } else {
    return str;
  }
}
export default {
  name: 'upload-progress',
  computed: {
    uploadName: function () {
      if (this.isActive) {
        return `Uploading "${truncate(this.uploads[0].name, 20)}`;
      } else {
        return null;
      }
    },

    isActive: function () {
      return this.uploads && this.uploads.filter(u => u.progress !== 100).length;
    },

    progressBarStyles: function () {
      let width = 0;
      if (this.uploads && this.uploads.length && this.uploads[0].progress) {
        width = `${this.uploads[0].progress}%`;
      }
      return {
        width
      };
    },

    uploads: function () {
      return this.$store.state.uploads;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .loading {
    text-align: center;
    padding: 15px;

    .subtext {
      font-size: 1.6rem;
      color: #fff;
    }
  }

  .upload-progress {
    text-align: center;
    display: none;
    margin: 15px 0;

    &.active {
      display: block;
    }

    .upload-name {
      font-weight: 500;
      padding: 10px;
    }

    .progress {
      border: 1px solid $blue;
      border-radius: 4px;
      height: 20px;

      .progress-bar {
        background: $blue;
        transition: width 50ms ease-out;
        height: 20px;
      }
    }
  }
</style>
