
const {Storage} = require('@google-cloud/storage');
const crypto = require('crypto');
const path = require('path');


const keyFilename = path.resolve(__dirname)+ '/../config/gcloud_key.json';

const storage = new Storage({keyFilename})
const bucketName = 'userdatabackend'
const bucket = storage.bucket(bucketName);
const FOLDER_NAME = 'someFolderInBucket'
const { Readable } = require('stream');


function getImageHash(buffer) {
  const hash = crypto.createHash('sha256');
  hash.update(buffer);
  return hash.digest('hex');
}



const get_file_address_bucket =  (buffer, file_type) => {
  const hash =  getImageHash(buffer);
  const address = FOLDER_NAME + '/' + hash + '.' + file_type
  return address
  
}



const upload_to_bucket = async (file_buffer , file_type) => {

  const destination =  get_file_address_bucket(file_buffer, file_type);
  const bufferStream = new Readable();
  bufferStream.push(file_buffer);
  bufferStream.push(null);

  const file = bucket.file(destination);

  await new Promise((resolve, reject) => {
    bufferStream.on('error', reject).pipe(file.createWriteStream()
    ).on('error', reject).on('finish', resolve);
  });

  const [signedUrl] = await file.getSignedUrl({
    action: 'read',
    expires: Date.now() + 24 * 60 * 60 * 1000, 
  });
  
  return {destination ,signedUrl} 
}

module.exports = {
    upload_to_bucket
}