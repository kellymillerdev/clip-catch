# ClipCatch

ClipCatch is a mobile application for downloading and managing YouTube videos, built with React Native and Expo.

## Features

- Download YouTube videos in various quality options
- View and manage downloaded videos
- Play videos directly within the app
- Share videos with other apps
- Track download progress in real-time
- Support for multiple video formats

## Tech Stack

### Core Technologies
* **React Native** - Cross-platform mobile framework
* **Expo** - Development platform for React Native
* **TypeScript** - Static typing for JavaScript

### UI Components
* **React Native Paper** - Material Design component library
* **React Native Safe Area Context** - Handles safe area insets

### Expo Modules
* **File System** - File handling and storage operations
* **Media Library** - Access to device media storage
* **AV** - Audio/video playback capabilities
* **Video Thumbnails** - Generate preview images from videos
* **Sharing** - Share content with other applications
* **Status Bar** - Control app status bar appearance

### Data Management
* **AsyncStorage** - Persistent local storage
* **React Native YTDL** - YouTube download functionality
* **YouTubei.js** - YouTube API client

## Project Structure

- **`/components`**: UI components
  - `DownloadForm.tsx`: Form for entering YouTube URLs and downloading videos
  - `DownloadProgress.tsx`: Progress indicator for downloads
  - `VideoItem.tsx`: Component to display a downloaded video
- **`/services`**: API and service integrations
  - `youtube.ts`: YouTube API integration and download functionality
- **`/types`**: TypeScript type definitions
- **`/utils`**: Utility functions
  - `fileSystem.ts`: File management operations
  - `formatters.ts`: Data formatting utilities

## Installation

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the Expo development server:
   ```
   npm start
   ```
4. Use the Expo Go app on your mobile device to scan the QR code

## Usage

1. Enter a YouTube URL in the download form
2. Select your preferred quality option
3. Download the video
4. Access your downloaded videos in the library section
5. Play, share, or delete videos as needed

## License Notice

This app is for personal use only and demonstrates video download functionality. Users are responsible for complying with YouTube's Terms of Service and copyright laws. Only download videos that are in the public domain, have Creative Commons licenses, or that you have permission to download.