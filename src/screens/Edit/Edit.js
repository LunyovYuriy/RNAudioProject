import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RNFFmpeg } from 'react-native-ffmpeg';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import { addRecord } from '../../actions/record';
import { getMMSSFromMillis, uniqueID } from '../../utils/helpers';
import IconButton from '../../components/IconButton/IconButton';
import { toggleFlashMessage } from '../../actions/general';
import { FLASH_MESSAGE_TYPE } from '../../constants/general';
import Layout from '../../layout/Layout';

const Edit = ({ route }) => {
  const { name, duration, uri, durationInMillis } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [newName, setNewName] = useState('');
  const [leftTrimmerPosition, setLeftTrimmerPosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rightTrimmerPosition, setRightTrimmerPosition] = useState(
    durationInMillis,
  );
  const [playback] = useState(new Audio.Sound());
  const timeoutId = useRef(null);

  const sliderLength = Dimensions.get('window').width - 90;

  const outputDirectory = FileSystem.documentDirectory;

  const stopPlay = async () => {
    try {
      clearTimeout(timeoutId.current);
      await playback.stopAsync();
      await playback.unloadAsync();
      setIsPlaying(false);
    } catch (error) {
      dispatch(toggleFlashMessage(true, error, FLASH_MESSAGE_TYPE.error));
    }
  };

  const playInterval = async () => {
    const playTime = rightTrimmerPosition - leftTrimmerPosition;
    try {
      await playback.loadAsync({ uri });
      await playback.setPositionAsync(leftTrimmerPosition);
      await playback.playAsync();
      setIsPlaying(true);
      timeoutId.current = setTimeout(() => {
        stopPlay();
      }, playTime);
    } catch (error) {
      dispatch(toggleFlashMessage(true, error, FLASH_MESSAGE_TYPE.error));
    }
  };

  const cutSound = async (inputFile, fileName) => {
    if (!fileName.length) {
      dispatch(
        toggleFlashMessage(
          true,
          'Please enter file name',
          FLASH_MESSAGE_TYPE.error,
        ),
      );
    } else {
      const outputName = `${fileName}.m4a`;
      const outputFile = outputDirectory + outputName;
      await RNFFmpeg.executeWithArguments([
        '-i',
        inputFile,
        '-ss',
        `${getMMSSFromMillis(leftTrimmerPosition)}`,
        '-to',
        `${getMMSSFromMillis(rightTrimmerPosition)}`,
        `${outputFile}`,
        '-y',
      ]);
      const { sound } = await Audio.Sound.createAsync(
        { uri: outputFile },
        { shouldPlay: false, isLooping: false },
      );
      const { durationMillis } = await sound.getStatusAsync();
      dispatch(
        addRecord({
          id: uniqueID(),
          uri: outputFile,
          name: `${fileName}`,
          duration: getMMSSFromMillis(durationMillis),
          durationInMillis: durationMillis,
        }),
      );
      Alert.alert('Success', 'Your record successfully edited!', [
        { text: 'Ok!', onPress: () => navigation.goBack() },
      ]);
    }
  };

  const trimmerValueChange = (value) => {
    const [leftValue, rightValue] = value;
    setLeftTrimmerPosition(leftValue);
    setRightTrimmerPosition(rightValue);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 20,
    },
    name: {
      fontSize: 30,
      marginVertical: 20,
    },
    saveBtnMargin: {
      marginTop: 10,
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#bdbdbd',
      borderRadius: 3,
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginBottom: 10,
      fontSize: 18,
    },
    editContainer: {
      marginTop: 10,
      marginBottom: 20,
      paddingHorizontal: 15,
      paddingVertical: 15,
      backgroundColor: '#e1f5fe',
      borderRadius: 8,
    },
    timeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    },
    timeText: {
      fontSize: 18,
    },
    sliderContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5,
    },
    selectedStyle: {
      height: 10,
      backgroundColor: '#1e88e5',
    },
    unselectedStyle: {
      height: 10,
    },
    markerContainer: {
      top: -20,
    },
    markerStyle: {
      height: 25,
      width: 25,
      backgroundColor: '#eeeeee',
      borderWidth: 1,
      borderColor: '#aeaeae',
    },
    pressedMarkerStyle: {
      width: 30,
      height: 30,
    },
    trackStyle: {
      borderRadius: 3,
    },
  });

  return (
    <Layout>
      <View style={styles.container}>
        <Text style={styles.name}>
          {name} - {duration}
        </Text>
        <TextInput
          placeholder="File name"
          value={newName}
          onChangeText={setNewName}
          style={styles.textInput}
        />
        <View style={styles.editContainer}>
          <MultiSlider
            sliderLength={sliderLength}
            min={0}
            max={durationInMillis}
            values={[leftTrimmerPosition, rightTrimmerPosition]}
            onValuesChange={trimmerValueChange}
            containerStyle={styles.sliderContainer}
            selectedStyle={styles.selectedStyle}
            unselectedStyle={styles.unselectedStyle}
            markerContainerStyle={styles.markerContainer}
            markerStyle={styles.markerStyle}
            pressedMarkerStyle={styles.pressedMarkerStyle}
            trackStyle={styles.trackStyle}
            enableLabel
            customLabel={() => (
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>
                  {getMMSSFromMillis(leftTrimmerPosition)}
                </Text>
                <Text style={styles.timeText}>
                  {getMMSSFromMillis(rightTrimmerPosition)}
                </Text>
              </View>
            )}
          />
        </View>
        {isPlaying ? (
          <IconButton
            icon="stop"
            text="Stop"
            backgroundColor="#9f0000"
            onPress={() => stopPlay()}
          />
        ) : (
          <IconButton
            icon="play"
            text="Play interval"
            backgroundColor="#2e7d32"
            onPress={() => playInterval()}
          />
        )}
        <IconButton
          icon="save"
          text="Save"
          containerStyle={styles.saveBtnMargin}
          onPress={() => cutSound(uri, newName)}
        />
      </View>
    </Layout>
  );
};

Edit.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string,
      duration: PropTypes.string,
      uri: PropTypes.string,
      durationInMillis: PropTypes.number,
    }),
  }).isRequired,
};

export default Edit;
