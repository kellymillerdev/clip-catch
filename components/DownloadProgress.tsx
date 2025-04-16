import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text, Button } from 'react-native-paper';
import { DownloadProgress as DownloadProgressType } from '../types';

interface DownloadProgressProps extends DownloadProgressType {
  onCancel?: () => void;
}

const DownloadProgress: React.FC<DownloadProgressProps> = ({
  progress,
  status,
  videoId,
  error,
  onCancel,
}) => {
  // Format progress as percentage
  const progressPercentage = `${Math.round(progress * 100)}%`;
  
  return (
    <View style={styles.container}>
      <View style={styles.progressInfo}>
        <Text style={styles.progressText}>{progressPercentage}</Text>
        <Text style={styles.statusText}>
          {status === 'downloading'
            ? 'Downloading...'
            : status === 'completed'
            ? 'Download completed'
            : status === 'error'
            ? `Error: ${error || 'Unknown error'}`
            : 'Download cancelled'}
        </Text>
      </View>
      
      <ProgressBar
        progress={progress}
        color={
          status === 'error'
            ? '#f44336'
            : status === 'completed'
            ? '#4caf50'
            : '#2196f3'
        }
        style={styles.progressBar}
      />
      
      {status === 'downloading' && onCancel && (
        <Button
          mode="text"
          onPress={onCancel}
          style={styles.cancelButton}
          compact
        >
          Cancel
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontWeight: 'bold',
  },
  statusText: {
    color: '#666',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
});

export default DownloadProgress;