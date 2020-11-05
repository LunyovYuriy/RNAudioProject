import {
  ADD_RECORD,
  REMOVE_RECORD,
  SET_IS_PLAYING,
} from '../constants/actionTypes';

export const addRecord = (record) => ({ type: ADD_RECORD, record });
export const removeRecord = (id) => ({ type: REMOVE_RECORD, id });
export const setIsPlaying = (id) => ({ type: SET_IS_PLAYING, id });
