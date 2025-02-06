const { authorize } = require('./auth');
const { downloadFilesFromDrive } = require('./drive');
const { parseArguments } = require('./args');
const { Queue } = require('async-await-queue');

async function main() {
  try {
    const { concurrency, waitTime, path, driveFolderId } = parseArguments();
    const downloadQueue = new Queue(concurrency, waitTime);

    const authClient = await authorize();
    await downloadFilesFromDrive(authClient, driveFolderId, downloadQueue, path);
  } catch (err) {
    console.error('Error during the operation:', err);
  }
}

main();