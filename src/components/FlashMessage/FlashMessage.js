import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Text, StyleSheet } from 'react-native';
import { toggleFlashMessage } from '../../actions/general';
import { FLASH_MESSAGE_TYPE } from '../../constants/general';

const FlashMessage = () => {
  const { showFlashMessage, flashMessageText, flashMessageType } = useSelector(
    (state) => state.general,
    shallowEqual,
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (showFlashMessage) {
      setTimeout(() => {
        dispatch(toggleFlashMessage(false));
      }, 2000);
    }
  });

  let bgColor = '#00b248';

  if (flashMessageType === FLASH_MESSAGE_TYPE.error) {
    bgColor = '#c30000';
  } else if (flashMessageType === FLASH_MESSAGE_TYPE.warning) {
    bgColor = '#c67c00';
  }

  const styles = StyleSheet.create({
    message: {
      position: 'absolute',
      top: 0,
      left: 0,
      backgroundColor: bgColor,
      width: '100%',
      paddingVertical: 15,
      paddingHorizontal: 15,
      fontSize: 15,
      color: '#fff',
      fontWeight: 'bold',
      zIndex: 999,
    },
  });

  return (
    showFlashMessage && <Text style={styles.message}>{flashMessageText}</Text>
  );
};

export default FlashMessage;
