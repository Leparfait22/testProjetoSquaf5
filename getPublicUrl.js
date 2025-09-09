const AWS = require('aws-sdk');
require('dotenv').config();

const s3 = new AWS.S3({ region: process.env.AWS_REGION });

function getPublicUrl() {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: 'squad5/dados2.json',
    Expires: 3600 // 1 hora
  };

  const url = s3.getSignedUrl('getObject', params);
  console.log("URL temporária:", url);
  return url;
}

// getPublicUrl();
module.exports = { getPublicUrl };