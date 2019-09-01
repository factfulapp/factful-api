import store from 'state/store';
import Toaster from 'lib/toaster';
import errors from 'lib/errors';
import uniqueid from 'lodash.uniqueid';

class UploadService {
  static start (files) {
    const upload = {
      id: uniqueid(),
      name: files[0].name
    };
    store.commit('createUpload', upload);
    this._fetch(upload.id, files);
    return upload;
  }

  static handleProgress (id, percentage) {
    return store.commit('updateUpload', {
      id,
      progress: percentage
    });
  }

  static handleError (id) {
    return store.commit('updateUpload', {
      id,
      error: true
    });
  }

  static handleComplete (id, status, json) {
    if (json.errors) {
      json.errors.forEach(error => {
        Toaster.create('danger', errors.upload[error.code], 'Heck!');
      });
      return this.handleError(id);
    } else if (status >= 400) {
      const message = 'Something went wrong. Please try again.';
      Toaster.create('danger', message, 'Oops!');
      return this.handleError(id);
    } else {
      Toaster.create('success', `"${json.background.name}" is uploaded.`, 'Great!');
      store.commit('createBackground', json.background);
      return store.commit('updateUpload', { id, progress: 100 });
    }
  }

  static _fetch (id, files) {
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/backgrounds', true);

    xhr.setRequestHeader('Accept', 'application/json');

    xhr.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        const percentage = (e.loaded / e.total) * 100;
        return UploadService.handleProgress(id, percentage);
      }
    };

    xhr.onerror = () => UploadService.handleError(id);

    xhr.onload = function (e) {
      const { status } = e.target;
      const body = JSON.parse(e.target.responseText);
      return UploadService.handleComplete(id, status, body);
    };

    const formData = new FormData();
    formData.append('file', files[0]);

    return xhr.send(formData);
  }
}

export default UploadService;
