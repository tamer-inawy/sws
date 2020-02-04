'user strict';

const fs = require('fs');
const path = require('path');
const multer = require('multer');

const getUploader = (path, mimetypes) => {
  const storage = multer.diskStorage({
    destination: function (req, file, callBack) {
      callBack(null, path);
    },
    filename: function (req, file, callBack) {
      const now = new Date();
      callBack(null, `${now.getTime()}_${file.originalname.replace(/\s/g, '-')}`);
    }
  });

  const fileFilter = (req, file, callBack) => {
    // validate the file type
    if (mimetypes.indexOf(file.mimetype) !== -1) {
      callBack(null, true);
    } else {
      callBack(new Error('Unsupported file type!'), false);
    }
  };

  const uploader = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

  return uploader;
};

const generateFilePath = (file, dir) => {
  const fileName = path.basename(file);
  createDir(dir);
  return path.resolve(dir, fileName.replace(/\\/g, '/'));
}

const createDir = dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};


const fileUploadHelper = {
  getSingleUploader: (field, path, mimetypes) => {
    createDir(path);
    const uploader = getUploader(path, mimetypes);
    return uploader.single(field);
  },

  moveFile: (file, dir2) => {
    const dest = generateFilePath(file, dir2);
    
    fs.rename(file, dest, (err) => {
      if (err) throw err;
      else console.log('Successfully moved!');
    });
  }

};

module.exports = fileUploadHelper;
