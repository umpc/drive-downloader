const fs = require('fs');
const path = require('path');
const { hashFile } = require('./hash');  // External file hashing function

let remainingDownloads = 0;
let pendingDownloads = [];

async function queueDownload(drive, file, downloadQueue, downloadPath) {
  try {
    const verified = await verifyDownload(file, downloadPath);
    if (!verified) {
      console.log(`Downloading: ${file.name} (${file.id})`);
      remainingDownloads += 1;
      pendingDownloads.push(downloadFile(drive, file, downloadQueue, downloadPath));
    }
  } catch (err) {
    console.error('Error queuing download:', err);
  }
}

async function downloadFile(drive, file, downloadQueue, downloadPath) {
  const taskId = Symbol();
  await downloadQueue.wait(taskId, 0);

  try {
    const fileStream = fs.createWriteStream(path.join(downloadPath, file.name), { flags: 'w' });
    const res = await drive.files.get({ fileId: file.id, alt: 'media' }, { responseType: 'stream' });

    res.data
      .on('end', async () => {
        try {
          remainingDownloads -= 1;
          downloadQueue.end(taskId);
          await verifyAndLogDownload(file, downloadPath);
        } catch (err) {
          console.error('Error on download complete:', err);
        }
      })
      .on('error', (err) => {
        remainingDownloads -= 1;
        downloadQueue.end(taskId);
        console.error('Download error:', err);
      })
      .pipe(fileStream);
  } catch (err) {
    remainingDownloads -= 1;
    downloadQueue.end(taskId);
    console.error('Error downloading file:', err);
  }
}

async function verifyAndLogDownload(file, downloadPath) {
  const verified = await verifyDownload(file, downloadPath);
  if (verified) {
    console.log(`Downloaded: ${file.name} (${file.id})\n- Remaining: ${remainingDownloads}`);
  } else {
    console.error(`Verification failed: ${file.name} (${file.id})`);
  }
}

async function verifyDownload(file, downloadPath) {
  try {
    const digest = await hashFile(path.join(downloadPath, file.name));
    return digest === file.sha256Checksum;
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error verifying file download:', err);
    }
    return false;
  }
}

module.exports = { queueDownload, downloadFile, verifyDownload, remainingDownloads, pendingDownloads };