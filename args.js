const yargs = require('yargs');

const CONFIG = {
  concurrency: 10,
  waitTime: 100,
  downloadPath: process.cwd(),
};

function parseArguments() {
  const argv = yargs
    .option('concurrency', {
      alias: 'c',
      description: 'Number of concurrent downloads',
      type: 'number',
      default: CONFIG.concurrency,
    })
    .option('wait-time', {
      alias: 'w',
      description: 'Wait time, in milliseconds, before starting each new download task',
      type: 'number',
      default: CONFIG.waitTime,
    })
    .option('path', {
      alias: 'p',
      description: 'Directory to save downloaded files',
      type: 'string',
      default: CONFIG.downloadPath,
    })
    .demandCommand(1, 'You need to specify a Google Drive folder ID or URL')
    .argv;

  // Extract and handle Google Drive folder ID or URL
  const folderId = argv._[0];
  const driveFolderId = folderId.startsWith('https://drive.google.com') ? extractFolderIdFromUrl(folderId) : folderId;

  return { ...argv, driveFolderId };
}

function extractFolderIdFromUrl(url) {
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1]; // Assuming folder ID is the last segment in the URL
}

module.exports = { parseArguments };