import { TOGGLE_FLASH_MESSAGE } from '../constants/actionTypes';

export const toggleFlashMessage = (value, text, messageType) => ({
  type: TOGGLE_FLASH_MESSAGE,
  value,
  text,
  messageType,
});
