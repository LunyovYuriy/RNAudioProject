import React, { useState } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { Text, StyleSheet, ScrollView, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import { removeRecord, setIsPlaying } from '../../actions/record';
import IconButton from '../../components/IconButton/IconButton';
import { toggleFlashMessage } from '../../actions/general';
import { FLASH_MESSAGE_TYPE } from '../../constants/general';
import Layout from '../../layout/Layout';

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
      dispatch(toggleFlashMessage(true, error, FLASH_MESSAGE_TYPE.error));
    }
  };
  const stopPlay = async () => {
    try {
      await playback.stopAsync();
      await playback.unloadAsync();
      dispatch(setIsPlaying(null));
    } catch (error) {
      dispatch(toggleFlashMessage(true, error, FLASH_MESSAGE_TYPE.error));
    }
  };

  const styles = StyleSheet.create({
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    container: {
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
    recordedItemText: {
      fontSize: 18,
      fontWeight: 'bold',
      width: '60%',
    },
    durationText: {
      fontWeight: 'normal',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonMargin: {
      marginRight: 5,
    },
  });

  if (!records.length) {
    return (
      <View style={styles.emptyContainer}>
        <FontAwesome name="frown-o" size={100} />
        <Text style={styles.title}>No records</Text>
      </View>
    );
  }

  return (
    <Layout>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Your records</Text>
          {records.map(({ id, name, uri, duration, durationInMillis }) => (
            <View style={styles.recordedItem} key={id}>
              <Text style={styles.recordedItemText}>
                {name.length > 15 ? `${name.slice(0, 15)}...` : name}
                <Text style={styles.durationText}> - {duration}</Text>
              </Text>
              <View style={styles.buttonsContainer}>
                <IconButton
                  icon="times"
                  backgroundColor="#9f0000"
                  containerStyle={styles.buttonMargin}
                  onPress={() => dispatch(removeRecord(id))}
                />
                <IconButton
                  icon="edit"
                  containerStyle={styles.buttonMargin}
                  onPress={() =>
                    navigation.navigate('Edit', {
                      name,
                      duration,
                      uri,
                      durationInMillis,
                    })
                  }
                />
                {isPlaying === id ? (
                  <IconButton
                    icon="stop"
                    onPress={() => stopPlay()}
                    backgroundColor="#9f0000"
                  />
                ) : (
                  <IconButton
                    icon="play"
                    onPress={() => playSound(uri, id)}
                    backgroundColor="#2e7d32"
                  />
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Layout>
  );
};

export default Library;
