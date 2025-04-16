import * as FileSystem from 'expo-file-system';
import { VideoInfo, VideoQuality } from '../types';

// Sample videos to use while developing
const SAMPLE_VIDEOS = [
  {
    id: 'sample1',
    title: 'Big Buck Bunny (Public Domain)',
    author: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/220px-Big_buck_bunny_poster_big.jpg',
    duration: 596,
    urls: {
      high: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      medium: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      low: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    sizes: {
      high: 158008374,
      medium: 158008374,
      low: 158008374
    }
  },
  {
    id: 'sample2',
    title: 'Elephant Dream (Public Domain)',
    author: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/220px-Elephants_Dream_s5_both.jpg',
    duration: 654,
    urls: {
      high: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      medium: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      low: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4'
    },
    sizes: {
      high: 86881876,
      medium: 86881876,
      low: 86881876
    }
  },
  {
    id: 'sample3',
    title: 'Sintel (Creative Commons)',
    author: 'Blender Foundation',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Sintel-screenshot.jpg/220px-Sintel-screenshot.jpg',
    duration: 888,
    urls: {
      high: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      medium: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      low: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4'
    },
    sizes: {
      high: 177957298,
      medium: 177957298,
      low: 177957298
    }
  }
];

// Extract video ID from YouTube URL
export const extractVideoId = (url: string): string | null => {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

// Simulate getting video info - currently uses sample videos for testing
export const getVideoInfo = async (url: string): Promise<VideoInfo | null> => {
  try {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }
    
    // For testing purposes, use a sample video
    // In a real implementation, you would call a backend service or use a compatible library
    // to get the actual video info from YouTube
    
    // Use the last character of the video ID to select a sample video (for variety)
    const lastChar = videoId.charAt(videoId.length - 1);
    const sampleIndex = parseInt(lastChar, 36) % SAMPLE_VIDEOS.length;
    const sampleVideo = SAMPLE_VIDEOS[sampleIndex];
    
    // Create quality options based on sample data
    const qualityOptions: VideoQuality[] = [
      {
        label: 'High (1080p)',
        url: sampleVideo.urls.high,
        height: 1080,
        fileSize: sampleVideo.sizes.high,
        mimeType: 'video/mp4'
      },
      {
        label: 'Medium (720p)',
        url: sampleVideo.urls.medium,
        height: 720,
        fileSize: sampleVideo.sizes.medium,
        mimeType: 'video/mp4'
      },
      {
        label: 'Low (480p)',
        url: sampleVideo.urls.low,
        height: 480,
        fileSize: sampleVideo.sizes.low,
        mimeType: 'video/mp4'
      }
    ];
    
    return {
      id: videoId,
      title: sampleVideo.title,
      thumbnail: sampleVideo.thumbnail,
      duration: sampleVideo.duration,
      author: sampleVideo.author,
      qualityOptions
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    return null;
  }
};

// Download video
export const downloadVideo = async (
  videoInfo: VideoInfo,
  qualityOption: VideoQuality,
  progressCallback: (progress: number) => void
): Promise<string | null> => {
  try {
    // Create a safe filename from the video title
    const safeTitle = videoInfo.title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 50);
    
    const fileExtension = qualityOption.mimeType.includes('webm') ? 'webm' : 'mp4';
    const fileName = `${safeTitle}_${videoInfo.id}.${fileExtension}`;
    const fileUri = `${FileSystem.documentDirectory}videos/${fileName}`;
    
    // Create directory if it doesn't exist
    await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}videos/`, {
      intermediates: true
    }).catch(e => console.log('Directory exists or error creating it', e));
    
    // Start downloading
    const downloadResumable = FileSystem.createDownloadResumable(
      qualityOption.url,
      fileUri,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        progressCallback(progress);
      }
    );
    
    const result = await downloadResumable.downloadAsync();
    
    if (result && result.uri) {
      return result.uri;
    }
    
    return null;
  } catch (error) {
    console.error('Error downloading video:', error);
    return null;
  }
};

// Check if video is public domain/Creative Commons (simplified version)
export const checkVideoLicense = async (videoId: string): Promise<boolean> => {
  // For testing purposes, we'll just return true
  // In a real implementation, you would use the YouTube Data API
  // to check the actual license of the video
  return true;
};