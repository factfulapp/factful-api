<template lang="pug">
  .upload-container(
    ref='uploadContainer'
    :class='{ "dragging": dragging }'
    @drop='handleDrop'
    @dragover='toggleDragging("over", $event)'
    @dragleave='toggleDragging("leave", $event)'
  )
    .container-overlay
    .container-wrapper
      a(href='javascript://', @click='handleUploadClick')
        i.fa.fa-upload
        span Upload New Background
      .reminder ...or drag your image here
      form(
        hidden=true
        action='/api/backgrounds'
        method='POST'
        enctype='multipart/form-data'
        @submit='handleUpload'
      )
        input(
          type='file'
          name='file'
          ref='fileInput'
          @change='handleFileChange'
        )
        input(type='submit', value='Upload')
</template>

<script>
import UploadService from 'lib/UploadService';
import Toaster from 'lib/toaster';

export default {
  name: 'dashboard-upload-container',
  data: function () {
    return {
      canDragAndDrop: false,
      dragging: false
    };
  },
  computed: {
    uploads: function () {
      return this.$store.state.backgrounds;
    }
  },
  mounted: function () {
    this.canDragAndDrop = this.checkDragAndDrop();

    const dragEvents = [
      'drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'
    ];
    dragEvents.forEach(function (evt) {
      this.$refs.uploadContainer.addEventListener(evt, function (e) {
        e.preventDefault();
        e.stopPropagation();
      }, false);
    }.bind(this));
  },
  methods: {
    checkDragAndDrop: function () {
      const div = document.createElement('div');
      return (
        ('draggable' in div) ||
        ('ondragstart' in div && 'ondrop' in div)
      ) && 'FormData' in window && 'FileReader' in window;
    },
    handleUploadClick: function (e) {
      this.$refs.fileInput.click();
    },
    handleFileChange: function (e) {
      const fileList = e.target.files;
      UploadService.start(fileList);
      e.target.value = '';
    },
    handleUpload: function (e) {
      e.preventDefault();
      UploadService.start(e.target.file.files);
      e.target.file.value = '';
    },
    handleDrop: function (e) {
      this.dragging = false;

      if (e.dataTransfer.files.length > 1) {
        return Toaster.create('danger', 'You can only upload one file at once.');
      }

      UploadService.start(e.dataTransfer.files);
    },
    toggleDragging: function (type, e) {
      if (type === 'over' && (e.pageX !== 0 || e.pageY !== 0)) {
        return false;
      }
      this.dragging = !this.dragging;
    }
  }
};
</script>

<style lang="scss" scoped>
  @import 'src/styles/colors';

  .upload-container {
    border: 4px dashed $gray;
    color: $gray;
    text-align: center;
    margin-bottom: 25px;

    .container-wrapper {
      padding: 30px 10px;

      a {
        display: inline-block;
        padding: 10px 25px;
        background: $blue;
        color: #fff;
        line-height: 1;
        font-size: 18px;
        margin-bottom: 15px;

        i {
          margin-right: 6px;
        }
      }
    }

    &.dragging {
      background: $blue-faint;
      border-style: solid;
    }

    @media only screen and ( max-width: 660px ) {
      border: none;

      .container-wrapper {
        padding: 0;

        a {
          display: block;
        }

        .reminder {
          display: none;
        }
      }
    }
  }
</style>
