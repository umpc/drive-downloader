const fs = require('fs');
const crypto = require('crypto');
const stream = require('stream/promises');

async function hashFile(path) {
  const fileStream = fs.createReadStream(path);
  const hash = crypto.createHash('sha256');

  await stream.pipeline(fileStream, hash);
  return hash.digest('hex');
}

module.exports = { hashFile };