import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Card, Title, Paragraph, IconButton, Menu, Divider } from 'react-native-paper';
import { DownloadedVideo } from '../types';
import { deleteVideo, shareVideo, formatFileSize } from '../utils/fileSystem';
import * as VideoThumbnails from 'expo-video-thumbnails';

interface VideoItemProps {
  video: DownloadedVideo;
  onDelete: (videoId: string) => void;
}

const VideoItem: React.FC<VideoItemProps> = ({ video, onDelete }) => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Generate thumbnail from the video file
    const generateThumbnail = async () => {
      try {
        const { uri } = await VideoThumbnails.getThumbnailAsync(video.fileUri, {
          time: 1000, // Get thumbnail at 1 second
        });
        setThumbnail(uri);
      } catch (e) {
        console.warn('Cannot generate thumbnail:', e);
      }
    };

    generateThumbnail();
  }, [video.fileUri]);

  const handlePlayVideo = () => {
    // For now, we'll just show an alert that the video would play
    // In a full implementation, you would navigate to a video player screen
    Alert.alert('Play Video', `Playing: ${video.title}`);
  };

  const handleShareVideo = async () => {
    await shareVideo(video.fileUri);
    setMenuVisible(false);
  };

  const handleDeleteVideo = () => {
    Alert.alert(
      'Delete Video',
      `Are you sure you want to delete "${video.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const success = await deleteVideo(video.fileUri);
            if (success) {
              onDelete(video.id);
            } else {
              Alert.alert('Error', 'Failed to delete video');
            }
            setMenuVisible(false);
          },
        },
      ]
    );
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity onPress={handlePlayVideo}>
        <View style={styles.thumbnailContainer}>
          {thumbnail ? (
            <Card.Cover source={{ uri: thumbnail }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnail, styles.placeholderThumbnail]} />
          )}
        </View>
      </TouchableOpacity>

      <Card.Content style={styles.content}>
        <View style={styles.titleRow}>
          <Title style={styles.title} numberOfLines={1}>
            {video.title}
          </Title>
          
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                size={20}
                onPress={() => setMenuVisible(true)}
              />
            }
          >
            <Menu.Item
              onPress={() => {
                setMenuVisible(false);
                handlePlayVideo();
              }}
              title="Play"
              leadingIcon="play"
            />
            <Menu.Item
              onPress={handleShareVideo}
              title="Share"
              leadingIcon="share"
            />
            <Divider />
            <Menu.Item
              onPress={handleDeleteVideo}
              title="Delete"
              leadingIcon="delete"
              titleStyle={{ color: 'red' }}
            />
          </Menu>
        </View>

        <Paragraph style={styles.details}>
          {formatFileSize(video.fileSize)}
        </Paragraph>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    elevation: 2,
  },
  thumbnailContainer: {
    height: 180,
    overflow: 'hidden',
  },
  thumbnail: {
    height: 180,
  },
  placeholderThumbnail: {
    backgroundColor: '#e0e0e0',
  },
  content: {
    paddingTop: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
  details: {
    fontSize: 12,
    color: '#666',
  },
});

export default VideoItem;