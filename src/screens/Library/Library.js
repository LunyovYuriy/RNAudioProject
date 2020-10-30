import React, { useState } from 'react';
import { Text, Pressable, Alert, StyleSheet, ScrollView } from 'react-native';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { setIsPlaying } from '../../actions/record';

const Library = () => {
  const styles = StyleSheet.create({
    recordedContainer: {
      flex: 1,
      backgroundColor: '#fff',
    },
    title: {
      fontSize: 30,
      marginHorizontal: 20,
      marginVertical: 20,
    },
    recordedItem: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginBottom: 10,
      backgroundColor: '#e0f7fa',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  });

  const { records, isPlaying } = useSelector(
    (state) => state.record,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [playback] = useState(new Audio.Sound());

  const playSound = async (currentSound, id) => {
    try {
      await playback.unloadAsync();
      await playback.loadAsync({ uri: currentSound });
      await playback.setIsLoopingAsync(true);
      await playback.playAsync();
      dispatch(setIsPlaying(id));
    } catch (error) {
      Alert.alert('PLAYBACK ERROR');
    }
  };
  const stopPlay = async () => {
    try {
      await playback.stopAsync();
      await playback.unloadAsync();
      dispatch(setIsPlaying(null));
    } catch (error) {
      Alert.alert('PAUSE ERROR');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.recordedContainer}>
      <Text style={styles.title}>Your records</Text>
      {records.map(({ id, name, uri, duration }) => (
        <Pressable
          style={styles.recordedItem}
          key={id}
          onPress={() => {
            return isPlaying === id ? stopPlay() : playSound(uri, id);
          }}>
          <Text>
            {name} - {duration}
          </Text>
          {isPlaying === id ? (
            <FontAwesome name="stop" size={25} color="#7f0000" />
          ) : (
            <FontAwesome name="play" size={25} color="#004d40" />
          )}
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default Library;
