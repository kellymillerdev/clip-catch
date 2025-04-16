import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import { DownloadedVideo } from '../types';

// Constants
export const VIDEOS_DIRECTORY = `${FileSystem.documentDirectory}videos/`;

// Ensure videos directory exists
export const ensureDirectoryExists = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(VIDEOS_DIRECTORY);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(VIDEOS_DIRECTORY, { intermediates: true });
  }
};

// Get all downloaded videos
export const getDownloadedVideos = async (): Promise<DownloadedVideo[]> => {
  try {
    await ensureDirectoryExists();
    
    // Read the videos directory
    const files = await FileSystem.readDirectoryAsync(VIDEOS_DIRECTORY);
    
    // Get info for each file
    const videoPromises = files
      .filter(file => file.endsWith('.mp4') || file.endsWith('.webm'))
      .map(async (fileName) => {
        const fileUri = `${VIDEOS_DIRECTORY}${fileName}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });
        
        // Extract video ID and title from filename
        // Format is typically: title_videoId.extension
        const parts = fileName.split('_');
        const videoId = parts.length > 1 
          ? parts[parts.length - 1].split('.')[0] 
          : 'unknown';
        
        // Reconstruct the title from the filename (removing the ID part)
        let title = parts.slice(0, -1).join('_').replace(/_/g, ' ');
        if (!title) title = 'Unknown Title';
        
        return {
          id: videoId,
          title,
          fileName,
          fileUri,
          thumbnail: '', // We don't store thumbnails separately
          fileSize: fileInfo.exists ? (fileInfo as any).size || 0 : 0,
          dateDownloaded: new Date().toISOString(), // We don't store this, using current time
          duration: 0, // We don't have this information after download
        };
      });
      
    return await Promise.all(videoPromises);
  } catch (error) {
    console.error('Error getting downloaded videos:', error);
    return [];
  }
};

// Delete a video
export const deleteVideo = async (fileUri: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting video:', error);
    return false;
  }
};

// Share a video
export const shareVideo = async (fileUri: string): Promise<void> => {
  try {
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert(
        'Sharing not available',
        'Sharing is not available on this device',
        [{ text: 'OK' }]
      );
      return;
    }
    
    await Sharing.shareAsync(fileUri);
  } catch (error) {
    console.error('Error sharing video:', error);
    Alert.alert('Error', 'Failed to share video');
  }
};

// Get file size in human-readable format
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check available space
export const checkAvailableSpace = async (): Promise<number | null> => {
  try {
    // This is only available on Android
    if (Platform.OS === 'android') {
      const freeSpace = await FileSystem.getFreeDiskStorageAsync();
      return freeSpace;
    }
    return null;
  } catch (error) {
    console.error('Error checking available space:', error);
    return null;
  }
};