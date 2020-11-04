import React, { useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import {
  Text,
  Pressable,
  Alert,
  StyleSheet,
  ScrollView,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { setIsPlaying } from '../../actions/record';

const Library = () => {
  const { records, isPlaying } = useSelector(
    (state) => state.record,
    shallowEqual,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [playback] = useState(new Audio.Sound());

  const playSound = async (currentSound, id) => {
    try {
      await playback.unloadAsync();
      await playback.loadAsync({ uri: currentSound });
      await playback.playAsync();
      dispatch(setIsPlaying(id));
      playback.setOnPlaybackStatusUpdate(({ isPlaying: playing }) => {
        if (!playing) {
          dispatch(setIsPlaying(null));
        }
      });
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
      backgroundColor: '#e1f5fe',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    editBtn: {
      backgroundColor: '#005cb2',
      marginRight: 10,
      borderRadius: 3,
      height: 30,
      justifyContent: 'center',
      alignItems: 'center',
    },
    editBtnText: {
      color: '#fff',
      fontWeight: 'bold',
      paddingHorizontal: 10,
      textTransform: 'uppercase',
    },
    playStopBtn: {
      height: 30,
      width: 40,
      backgroundColor: '#005cb2',
      borderRadius: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <ScrollView contentContainerStyle={styles.recordedContainer}>
      <Text style={styles.title}>Your records</Text>
      {records.map(({ id, name, uri, duration, durationInMillis }) => (
        <View style={styles.recordedItem} key={id}>
          <Text>
            {name} - {duration}
          </Text>
          <View style={styles.buttonsContainer}>
            <Pressable
              style={styles.editBtn}
              onPress={() =>
                navigation.navigate('Edit', {
                  name,
                  duration,
                  uri,
                  durationInMillis,
                })
              }>
              <Text style={styles.editBtnText}>Edit</Text>
            </Pressable>
            <Pressable
              style={styles.playStopBtn}
              onPress={() => {
                return isPlaying === id ? stopPlay() : playSound(uri, id);
              }}>
              {isPlaying === id ? (
                <FontAwesome name="stop" size={15} color="#fff" />
              ) : (
                <FontAwesome name="play" size={15} color="#fff" />
              )}
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default Library;
