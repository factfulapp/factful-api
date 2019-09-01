const fs = require('fs-extra');
const config = require('../../config');
const Background = require('./Background');
const imgur = require('imgur');

imgur.setClientId(config.app.imgur);

class BackgroundCreationError extends Error {
  constructor(code, data = {}) {
    super();
    this.name = 'BackgroundCreationError';
    this.code = code;
    Object.assign(this, data);
  }

  toJSON() {
    if (this.fields) {
      return { code: this.code, fields: this.fields };
    }
    return { code: this.code };
  }
}

/**
 * The BackgroundCreator class uploads the temporary file to Imgur
 * and creates an object to add to the Backgrounds table
 */
class BackgroundCreator {
  /**
   * @api
   */

  /**
   * Checks whether the file is good to upload.
   * @param {Object} file
   * @throws {BackgroundCreationError} on rejection
   */
  verifyBackground(file) {
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const allowedMimetypes = [
      'image/png',
      'image/jpeg',
      'image/pjpeg',
      'image/gif'
    ];

    if (!file) {
      throw new BackgroundCreationError('NO_FILE');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BackgroundCreationError('FILE_TOO_LARGE', {
        maxSize: MAX_FILE_SIZE
      });
    }

    if (!allowedMimetypes.includes(file.mimetype)) {
      throw new BackgroundCreationError('BAD_MIMETYPE', {
        allowedMimetypes
      });
    }
  }

  /**
   * Promises to upload the file to Imgur and retrieve the URL
   * @param {Object} file
   */
  uploadFile(file) {
    if (file) {
      return new Promise(function (resolve, reject) {
        imgur.uploadFile(file.path)
          .then(json => {
            return resolve(json.data.link);
          })
          .catch(reject);
      });
    }
  }

  /**
   * Removes the temporary upload from the local server
   * @param {Object} file
   */
  async cleanup(file) {
    if (file && await fs.exists(file.path)) {
      await fs.unlink(file.path);
    }
  }

  /**
   * @typedef CreateBackgroundParams
   * @property {Object} file
   */
  /**
   * Promises to upload the file object.
   * @api
   * @param {CreateBackgroundParams} params
   */
  async perform({ file }) {
    try {
      await this.verifyBackground(file);
      const url = await this.uploadFile(file);

      const name = file.originalname
        .replace(/[^.\w]/g, '-')
        .slice(0, 128)
        .toLowerCase();

      const record = await Background.create({
        name,
        url
      });

      return record;
    } catch (err) {
      throw err;
    } finally {
      await this.cleanup(file);
    }
  }
}

module.exports = BackgroundCreator;
