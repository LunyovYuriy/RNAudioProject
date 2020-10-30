import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Create from '../screens/Create/Create';
import Library from '../screens/Library/Library';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Create"
        component={Create}
        options={{
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="microphone" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Library"
        component={Library}
        options={{
          // eslint-disable-next-line react/prop-types
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
