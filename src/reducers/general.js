import { TOGGLE_FLASH_MESSAGE } from '../constants/actionTypes';
import { FLASH_MESSAGE_TYPE } from '../constants/general';

function initialState() {
  return {
    showFlashMessage: false,
    flashMessageText: '',
    flashMessageType: FLASH_MESSAGE_TYPE.success,
  };
}

export default function general(state = initialState(), action) {
  switch (action.type) {
    case TOGGLE_FLASH_MESSAGE:
      return {
        ...state,
        showFlashMessage: action.value,
        flashMessageText: action.text || '',
        flashMessageType: action.messageType || FLASH_MESSAGE_TYPE.success,
      };
    default:
      return state;
  }
}
