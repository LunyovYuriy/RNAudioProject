import React from 'react';
import PropTypes from 'prop-types';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const IconButton = ({
  icon,
  onPress,
  containerStyle,
  backgroundColor,
  iconColor,
  iconSize,
  iconContainerStyle,
  text,
  textStyle,
}) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor,
      borderRadius: 3,
      paddingVertical: 10,
      paddingHorizontal: 13,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconContainer: {
      height: 20,
      width: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      color: '#fff',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginLeft: 5,
    },
  });

  return (
    <Pressable style={[styles.container, containerStyle]} onPress={onPress}>
      <View style={[styles.iconContainer, iconContainerStyle]}>
        <FontAwesome name={icon} size={iconSize} color={iconColor} />
      </View>
      {text?.length > 0 && <Text style={[styles.text, textStyle]}>{text}</Text>}
    </Pressable>
  );
};

IconButton.propTypes = {
  icon: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  containerStyle: PropTypes.shape({}),
  backgroundColor: PropTypes.string,
  iconColor: PropTypes.string,
  iconContainerStyle: PropTypes.shape({}),
  text: PropTypes.string,
  textStyle: PropTypes.shape({}),
  iconSize: PropTypes.number,
};

IconButton.defaultProps = {
  containerStyle: {},
  backgroundColor: '#005cb2',
  iconColor: '#fff',
  iconContainerStyle: {},
  text: '',
  textStyle: {},
  iconSize: 17,
};

export default IconButton;
