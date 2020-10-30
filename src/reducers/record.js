import { ADD_RECORD, SET_IS_PLAYING } from '../constants/actionTypes';

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
    case SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.id,
      };
    default:
      return state;
  }
}
