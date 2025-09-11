/**
 * Basic CloudKit Usage Example
 * Demonstrates the core functionality of react-native-icloud
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from 'react-native';
import CloudKit, {
  CloudKitManager,
  createQuery,
  CloudKitRecord,
  CloudKitAuthStatus,
} from 'react-native-icloud';

interface Note {
  recordName?: string;
  recordType: string;
  fields: {
    title: string;
    content: string;
    createdAt: { timestamp: number };
    isPublic: boolean;
  };
}

const BasicUsageExample: React.FC = () => {
  const [cloudKit] = useState(() => new CloudKitManager());
  const [authStatus, setAuthStatus] = useState<CloudKitAuthStatus>('couldNotDetermine');
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeCloudKit();
  }, []);

  /**
   * Initialize CloudKit with configuration
   */
  const initializeCloudKit = async () => {
    try {
      await cloudKit.initialize({
        containerIdentifier: 'iCloud.com.yourcompany.yourapp', // Replace with your container ID
        environment: 'development',
        enableNotifications: true,
      });

      setIsInitialized(true);
      await checkAuthStatus();
      await loadNotes();
    } catch (error) {
      Alert.alert('Initialization Error', `Failed to initialize CloudKit: ${error}`);
    }
  };

  /**
   * Check current authentication status
   */
  const checkAuthStatus = async () => {
    try {
      const status = await cloudKit.getAuthStatus();
      setAuthStatus(status);
      
      if (status === 'noAccount') {
        Alert.alert(
          'iCloud Account Required',
          'Please sign in to iCloud in your device settings to use this feature.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Auth status check failed:', error);
    }
  };

  /**
   * Load notes from CloudKit
   */
  const loadNotes = async () => {
    try {
      const query = createQuery('Note')
        .sortDescending('createdAt')
        .limit(20)
        .build();

      const result = await cloudKit.query(query);
      setNotes(result.records as Note[]);
    } catch (error) {
      console.error('Failed to load notes:', error);
      Alert.alert('Error', 'Failed to load notes');
    }
  };

  /**
   * Save a new note to CloudKit
   */
  const saveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Validation Error', 'Please enter both title and content');
      return;
    }

    try {
      const newNote: Note = {
        recordType: 'Note',
        fields: {
          title: title.trim(),
          content: content.trim(),
          createdAt: { timestamp: Date.now() / 1000 },
          isPublic,
        },
      };

      const result = await cloudKit.save({
        records: [newNote],
      });

      if (result.records.length > 0) {
        setTitle('');
        setContent('');
        setIsPublic(false);
        await loadNotes(); // Refresh the list
        Alert.alert('Success', 'Note saved successfully!');
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      Alert.alert('Error', 'Failed to save note');
    }
  };

  /**
   * Delete a note from CloudKit
   */
  const deleteNote = async (recordName: string) => {
    try {
      await cloudKit.delete({
        recordNames: [recordName],
      });

      await loadNotes(); // Refresh the list
      Alert.alert('Success', 'Note deleted successfully!');
    } catch (error) {
      console.error('Failed to delete note:', error);
      Alert.alert('Error', 'Failed to delete note');
    }
  };

  /**
   * Search notes by title
   */
  const searchNotes = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      await loadNotes();
      return;
    }

    try {
      const query = createQuery('Note')
        .contains('title', searchTerm)
        .sortDescending('createdAt')
        .limit(20)
        .build();

      const result = await cloudKit.query(query);
      setNotes(result.records as Note[]);
    } catch (error) {
      console.error('Search failed:', error);
      Alert.alert('Error', 'Search failed');
    }
  };

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Initializing CloudKit...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>CloudKit Notes Example</Text>
      
      {/* Auth Status */}
      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Auth Status:</Text>
        <Text style={[styles.statusText, { color: getStatusColor(authStatus) }]}>
          {authStatus}
        </Text>
      </View>

      {/* Add Note Form */}
      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Add New Note</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Note title"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Note content"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={4}
        />
        
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsPublic(!isPublic)}
        >
          <Text style={styles.checkboxText}>
            {isPublic ? '✓' : '○'} Make this note public
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
          <Text style={styles.buttonText}>Save Note</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search notes..."
          onChangeText={searchNotes}
        />
      </View>

      {/* Notes List */}
      <View style={styles.notesContainer}>
        <Text style={styles.sectionTitle}>Your Notes ({notes.length})</Text>
        
        {notes.map((note, index) => (
          <View key={note.recordName || index} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <Text style={styles.noteTitle}>{note.fields.title}</Text>
              {note.fields.isPublic && (
                <Text style={styles.publicBadge}>Public</Text>
              )}
            </View>
            
            <Text style={styles.noteContent}>{note.fields.content}</Text>
            
            <View style={styles.noteFooter}>
              <Text style={styles.noteDate}>
                {new Date(note.fields.createdAt.timestamp * 1000).toLocaleDateString()}
              </Text>
              
              {note.recordName && (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteNote(note.recordName!)}
                >
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
        
        {notes.length === 0 && (
          <Text style={styles.emptyText}>No notes found</Text>
        )}
      </View>
    </ScrollView>
  );
};

/**
 * Get color for auth status
 */
const getStatusColor = (status: CloudKitAuthStatus): string => {
  switch (status) {
    case 'available':
      return '#4CAF50';
    case 'restricted':
      return '#FF9800';
    case 'noAccount':
      return '#F44336';
    case 'couldNotDetermine':
      return '#9E9E9E';
    default:
      return '#9E9E9E';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    marginBottom: 15,
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: 20,
  },
  notesContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
  },
  noteCard: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  publicBadge: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    fontStyle: 'italic',
  },
});

export default BasicUsageExample;
