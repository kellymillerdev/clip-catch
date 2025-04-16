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

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native
- **TypeScript**: Static typing for JavaScript
- **React Native Paper**: Material Design components
- **Expo File System**: File handling capabilities
- **Expo Media Library**: Access to device media storage
- **Expo AV**: Audio/video playback
- **Expo Video Thumbnails**: Generate video thumbnails
- **Expo Sharing**: Share content with other apps
- **React Native YTDL**: YouTube download functionality
- **AsyncStorage**: Local storage for video metadata

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