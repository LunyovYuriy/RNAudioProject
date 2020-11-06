import * as FileSystem from 'expo-file-system';
import { Audio } from 'expo-av';
import {
  ADD_RECORD,
  REMOVE_RECORD,
  SET_IS_PLAYING,
  SET_RECORDS,
} from '../constants/actionTypes';
import { getMMSSFromMillis, uniqueID } from '../utils/helpers';

export const addRecord = (record) => ({ type: ADD_RECORD, record });
export const setRecords = (records) => ({ type: SET_RECORDS, records });
export const removeRecord = (id) => ({ type: REMOVE_RECORD, id });
export const setIsPlaying = (id) => ({ type: SET_IS_PLAYING, id });
export const getRecordFromCache = () => {
  return async (dispatch) => {
    const filesArray = await FileSystem.readDirectoryAsync(
      `${FileSystem.cacheDirectory}Audio`,
    );
    let recordsArray = [];
    filesArray.map(async (item) => {
      const { sound } = await Audio.Sound.createAsync(
        { uri: `${FileSystem.cacheDirectory}Audio/${item}` },
        { shouldPlay: false, isLooping: false },
      );
      const { durationMillis } = await sound.getStatusAsync();
      recordsArray = [
        ...recordsArray,
        {
          id: uniqueID(),
          uri: `${FileSystem.cacheDirectory}Audio/${item}`,
          name: item,
          durationInMillis: durationMillis,
          duration: getMMSSFromMillis(durationMillis),
        },
      ];
      dispatch(setRecords(recordsArray));
    });
  };
};
