const busboy = require('busboy');
//import { Request, Response, NextFunction } from 'express';
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY_CLOUD,
  api_secret: process.env.CLUD_SECRET,
});

const formData = (req, res, next) => {
  let uploadingFile = false;
  let uploadingCount = 0;

  const done = () => {
    if (uploadingFile) return;
    if (uploadingCount > 0) return;
    next();
  };

  const bb = busboy({ headers: req.headers });
  req.body = {};

  // Captura de partes que no son un archivo
  bb.on('field', (key, val) => {
    req.body[key] = val;
  });

  // Capturas partes que son archivo
  bb.on('file', (key, stream) => {
    uploadingFile = true;
    uploadingCount++;
    const cloud = cloudinary.uploader.upload_stream(
      { upload_preset: 'pad-preset' },
      (err, res) => {
        if (err) throw new Error('Something went wrong!');

        req.body[key] = res?.secure_url;
        uploadingFile = false;
        uploadingCount--;
        done();
      },
    );

    stream.on('data', (data) => {
      cloud.write(data);
    });

    stream.on('end', () => {
      cloud.end();
    });
  });

  bb.on('finish', () => {
    done();
  });

  req.pipe(bb);
};

module.exports = formData;
