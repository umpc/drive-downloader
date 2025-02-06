# Google Drive File Downloader & Verifier

This Node.js script allows you to download files from a Google Drive folder and verify their integrity using SHA256 checksums. It supports parallel downloads and can be customized to suit different configurations, such as concurrency, wait time, and the download path.

## Features

- Download files from any public or private Google Drive folder.
- Supports downloading files in parallel with customizable concurrency.
- Verifies downloaded files using SHA256 checksums.
- Supports downloading from a folder using either the folder ID or URL.
- Configurable download path for saving files.
- Error handling for missing or invalid files.

## Requirements

- Node.js version 14 or higher.
- Google Cloud Project with Drive API enabled.
- OAuth2 credentials for Google API.

## Installation

### 1. Clone the repository and install dependencies

```bash
git clone https://github.com/umpc/drive-downloader.git
cd drive-downloader
npm install
```

### 2. Set up Google API credentials

* Visit [Google Cloud Console](https://console.cloud.google.com/).
* Create a new project (or use an existing one).
* Enable the **Google Drive API**.
* Create **OAuth 2.0 credentials** and download the `credentials.json` file.
* Place the `credentials.json` file in the root of the project.

## Usage

### Command-Line Options

* `-c`, `--concurrency`: Number of concurrent downloads. Default is `10`.
* `-w`, `--wait-time`: Wait time, in milliseconds, before starting each new download task. Default is `100`.
* `-p`, `--path`: Path to the directory where downloaded files will be saved. Default is the current directory.

### Example Commands

#### Download from Google Drive Folder (by ID)

```bash
node index.js --concurrency 4 --wait-time 100 --path /path/to/download/folder 1sa14fWqqqqgADgVr5mOysmXYd3gHWrX2
```

#### Download from Google Drive Folder (by URL)

```bash
node index.js --concurrency 4 --path /path/to/download/folder https://drive.google.com/drive/folders/1sa14fWqqqqgADgVr5mOysmXYd3gHWrX2
```

This command will download all files from the specified Google Drive folder to the specified directory.

### Configuration

* `concurrency`: Adjust the number of concurrent downloads. Higher values may increase performance but could put a strain on your internet connection.
* `wait-time`: Customize the wait time between download tasks to avoid throttling by Google.
* `path`: Specify a custom download path for saving files.

### License

This project is licensed under the ISC License - see the [LICENSE](https://github.com/umpc/drive-downloader/blob/main/LICENSE) file for details.

### Contributing

1.	Fork the repository.
2.	Create a new branch (`git checkout -b feature/your-feature`).
3.	Make your changes.
4.	Commit your changes (`git commit -am 'Add new feature'`).
5.	Push to the branch (`git push origin feature/your-feature`).
6.	Create a new Pull Request.