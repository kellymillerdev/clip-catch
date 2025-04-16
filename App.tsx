import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, FlatList, Text } from 'react-native';
import { Provider as PaperProvider, DefaultTheme, Appbar, ActivityIndicator, Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import DownloadForm from './components/DownloadForm';
import VideoItem from './components/VideoItem';
import { VideoInfo, VideoQuality, DownloadedVideo } from './types';
import { getDownloadedVideos, ensureDirectoryExists } from './utils/fileSystem';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
  },
};

export default function App() {
  const [videos, setVideos] = useState<DownloadedVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Load videos on app start
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      await ensureDirectoryExists();
      const downloadedVideos = await getDownloadedVideos();
      setVideos(downloadedVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadVideos();
  };

  const handleVideoDownloaded = async (
    fileUri: string,
    videoInfo: VideoInfo,
    qualityOption: VideoQuality
  ) => {
    // Create a new downloaded video entry
    const newVideo: DownloadedVideo = {
      id: videoInfo.id,
      title: videoInfo.title,
      thumbnail: videoInfo.thumbnail,
      fileUri,
      fileName: fileUri.split('/').pop() || 'unknown.mp4',
      dateDownloaded: new Date().toISOString(),
      fileSize: Number(qualityOption.fileSize) || 0,
      duration: videoInfo.duration,
    };

    // Add to the videos list
    setVideos(prevVideos => {
      // Check if a video with the same ID already exists
      const exists = prevVideos.some(v => v.id === newVideo.id);
      if (exists) {
        // Replace the existing video
        return prevVideos.map(v => v.id === newVideo.id ? newVideo : v);
      } else {
        // Add as a new video
        return [newVideo, ...prevVideos];
      }
    });
    
    // Refresh the list
    await loadVideos();
  };

  const handleVideoDelete = (videoId: string) => {
    // Remove the video from the list
    setVideos(prevVideos => prevVideos.filter(v => v.id !== videoId));
  };

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <SafeAreaView style={styles.container}>
          <Appbar.Header>
            <Appbar.Content title="ClipCatch" subtitle="YouTube Downloader" />
          </Appbar.Header>
          
          <View style={styles.content}>
            <DownloadForm onSubmit={handleVideoDownloaded} />
            
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>Loading videos...</Text>
              </View>
            ) : (
              <>
                <View style={styles.libraryHeader}>
                  <Text style={styles.libraryTitle}>Your Videos</Text>
                  <Button 
                    icon="refresh" 
                    mode="text" 
                    onPress={handleRefresh}
                    loading={refreshing}
                  >
                    Refresh
                  </Button>
                </View>
                
                {videos.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No videos downloaded yet</Text>
                    <Text>Enter a YouTube URL above to get started</Text>
                  </View>
                ) : (
                  <FlatList
                    data={videos}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <VideoItem video={item} onDelete={handleVideoDelete} />
                    )}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={styles.videoList}
                  />
                )}
              </>
            )}
          </View>
        </SafeAreaView>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  libraryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  libraryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoList: {
    paddingBottom: 20,
  },
});