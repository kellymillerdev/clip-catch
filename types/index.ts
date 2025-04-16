export interface VideoQuality {
  label: string;
  url: string;
  height: number;
  fileSize?: number | string;
  mimeType: string;
}

export interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  author: string;
  qualityOptions: VideoQuality[];
}

export interface DownloadedVideo {
  id: string;
  title: string;
  thumbnail: string;
  fileUri: string;
  fileName: string;
  dateDownloaded: string;
  fileSize: number;
  duration: number;
}

export interface DownloadProgress {
  videoId: string;
  progress: number;
  status: 'downloading' | 'completed' | 'error' | 'cancelled';
  error?: string;
}

export interface DownloadOptions {
  quality: string;
  format: string;
}