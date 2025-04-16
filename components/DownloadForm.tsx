import React, { useState } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, RadioButton, Title, Surface, Divider } from 'react-native-paper';
import { getVideoInfo, downloadVideo, checkVideoLicense } from '../services/youtube';
import { VideoInfo, VideoQuality } from '../types';
import DownloadProgress from './DownloadProgress';

interface DownloadFormProps {
  onSubmit: (fileUri: string, videoInfo: VideoInfo, quality: VideoQuality) => void;
}

const DownloadForm: React.FC<DownloadFormProps> = ({ onSubmit }) => {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUrlSubmit = async () => {
    if (!url.trim()) {
      Alert.alert('Error', 'Please enter a YouTube URL');
      return;
    }

    setError(null);
    setIsLoading(true);
    
    try {
      const info = await getVideoInfo(url);
      
      if (!info) {
        throw new Error('Could not retrieve video information');
      }
      
      // Check if the video is public domain/Creative Commons
      const isLegalToDownload = await checkVideoLicense(info.id);
      
      if (!isLegalToDownload) {
        Alert.alert(
          'License Warning',
          'This video may not be under a public domain or Creative Commons license. Please ensure you have the right to download this content.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Proceed Anyway', 
              onPress: () => {
                setVideoInfo(info);
                // Select highest quality by default
                if (info.qualityOptions.length > 0) {
                  setSelectedQuality(info.qualityOptions[0].label);
                }
              } 
            }
          ]
        );
      } else {
        setVideoInfo(info);
        // Select highest quality by default
        if (info.qualityOptions.length > 0) {
          setSelectedQuality(info.qualityOptions[0].label);
        }
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Failed to fetch video info'}`);
      console.error('Error fetching video:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!videoInfo || !selectedQuality) {
      Alert.alert('Error', 'Please select a quality option');
      return;
    }

    const qualityOption = videoInfo.qualityOptions.find(
      option => option.label === selectedQuality
    );

    if (!qualityOption) {
      Alert.alert('Error', 'Selected quality option not found');
      return;
    }

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      const fileUri = await downloadVideo(
        videoInfo,
        qualityOption,
        (progress) => setDownloadProgress(progress)
      );

      if (fileUri) {
        setIsDownloading(false);
        // Notify parent component
        onSubmit(fileUri, videoInfo, qualityOption);
        // Reset form
        setUrl('');
        setVideoInfo(null);
        setSelectedQuality(null);
        setDownloadProgress(0);
        Alert.alert('Success', 'Video downloaded successfully');
      } else {
        throw new Error('Download failed');
      }
    } catch (err) {
      setError(`Download error: ${err instanceof Error ? err.message : 'Failed to download'}`);
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const formatFileSize = (bytes?: number | string): string => {
    if (!bytes) return 'Unknown size';
    const bytesNum = typeof bytes === 'string' ? parseInt(bytes, 10) : bytes;
    
    if (isNaN(bytesNum)) return 'Unknown size';
    
    if (bytesNum < 1024) return bytesNum + ' bytes';
    else if (bytesNum < 1048576) return (bytesNum / 1024).toFixed(1) + ' KB';
    else return (bytesNum / 1048576).toFixed(1) + ' MB';
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Surface style={styles.container}>
        <Title style={styles.title}>Download YouTube Video</Title>
        
        <View style={styles.inputContainer}>
          <TextInput
            label="YouTube URL"
            value={url}
            onChangeText={setUrl}
            mode="outlined"
            right={
              isLoading ? (
                <TextInput.Icon icon={() => <ActivityIndicator />} />
              ) : (
                url ? <TextInput.Icon icon="close" onPress={() => setUrl('')} /> : undefined
              )
            }
            style={styles.input}
            autoCapitalize="none"
            disabled={isLoading || isDownloading}
            onSubmitEditing={handleUrlSubmit}
          />
          
          <Button 
            mode="contained" 
            onPress={handleUrlSubmit}
            loading={isLoading}
            disabled={isLoading || isDownloading || !url.trim()}
            style={styles.button}
          >
            Get Video Info
          </Button>
        </View>

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {videoInfo && (
          <View style={styles.videoInfoContainer}>
            <Title style={styles.videoTitle}>{videoInfo.title}</Title>
            <Text>By: {videoInfo.author}</Text>
            <Text>Duration: {Math.floor(videoInfo.duration / 60)}:{(videoInfo.duration % 60).toString().padStart(2, '0')}</Text>
            
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>Select Quality:</Text>
            
            <View style={styles.qualityContainer}>
              {videoInfo.qualityOptions.map((option) => (
                <TouchableOpacity 
                  key={option.label} 
                  style={styles.qualityOption}
                  onPress={() => setSelectedQuality(option.label)}
                >
                  <View style={styles.radioItem}>
                    <RadioButton 
                      value={option.label} 
                      status={selectedQuality === option.label ? 'checked' : 'unchecked'}
                      onPress={() => setSelectedQuality(option.label)}
                    />
                    <Text style={styles.radioLabel}>
                      {option.label} ({formatFileSize(option.fileSize)})
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            
            <Button
              mode="contained"
              onPress={handleDownload}
              disabled={isDownloading || !selectedQuality}
              loading={isDownloading}
              style={[styles.button, styles.downloadButton]}
            >
              Download
            </Button>
          </View>
        )}

        {isDownloading && (
          <DownloadProgress
            videoId={videoInfo?.id || ''}
            progress={downloadProgress}
            status="downloading"
            error={undefined}
            onCancel={() => setIsDownloading(false)}
          />
        )}
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  downloadButton: {
    marginTop: 16,
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
  videoInfoContainer: {
    marginTop: 16,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  qualityContainer: {
    marginBottom: 10,
  },
  qualityOption: {
    marginBottom: 8,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioLabel: {
    marginLeft: 8,
  },
});

export default DownloadForm;