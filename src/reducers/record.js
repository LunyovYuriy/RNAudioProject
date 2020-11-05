import {
  ADD_RECORD,
  REMOVE_RECORD,
  SET_IS_PLAYING,
} from '../constants/actionTypes';

function initialState() {
  return {
    isPlaying: null,
    records: [],
  };
}

export default function record(state = initialState(), action) {
  switch (action.type) {
    case ADD_RECORD:
      return {
        ...state,
        records: [...state.records, action.record],
      };
    case REMOVE_RECORD: {
      const newRecords = state.records.filter((item) => item.id !== action.id);
      return {
        ...state,
        records: newRecords,
      };
    }
    case SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.id,
      };
    default:
      return state;
  }
}
