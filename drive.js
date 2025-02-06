const { google } = require('googleapis');
const { queueDownload } = require('./download');

// Recursive folder crawler
async function crawlFolder(drive, folderId, pageToken = '') {
  try {
    const res = await drive.files.list({
      fields: 'nextPageToken, files(id, name, size, sha256Checksum)',
      q: `'${folderId}' in parents`,
      orderBy: 'name',
      pageToken,
    });
    return res.data;
  } catch (err) {
    console.error(`Error crawling folder ${folderId}:`, err);
    throw err;
  }
}

async function downloadFilesFromDrive(authClient, folderId, downloadQueue, downloadPath) {
  const drive = google.drive({ version: 'v3', auth: authClient });
  let nextPageToken = '';
  try {
    while (nextPageToken !== null) {
      const res = await crawlFolder(drive, folderId, nextPageToken);
      await processFiles(drive, res.files, downloadQueue, downloadPath);
      nextPageToken = res.nextPageToken || null;
    }
  } catch (err) {
    console.error('Error during file download process:', err);
  }
}

async function processFiles(drive, files, downloadQueue, downloadPath) {
  const results = files.map(async (file) => {
    try {
      if (file.size) {
        await queueDownload(drive, file, downloadQueue, downloadPath);
      } else {
        const folderRes = await crawlFolder(drive, file.id);
        await processFiles(drive, folderRes.files, downloadQueue, downloadPath);
      }
    } catch (err) {
      console.error('Error processing file:', file.id, err);
    }
  });

  await Promise.all(results);
}

module.exports = { downloadFilesFromDrive };