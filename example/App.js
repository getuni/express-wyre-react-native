import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native';

import ExpressWyre, { usePlaid } from "express-wyre-react-native";

function PlaidButton() {
  const { requestPublicToken } = usePlaid();
  return (
    <TouchableOpacity
      onPress={async () => {
        try {
          const { publicToken } = await requestPublicToken();
          console.warn(`Got a publicToken! ${publicToken}`);
        } catch (e) {
          console.error(e);
        }
      }}>
      <Text children="Request Plaid Token" />
    </TouchableOpacity>
  );
};

export default function App() {
  return (
    <ExpressWyre baseUrl="http://localhost:3000/wyre">
      <View style={StyleSheet.absoluteFill}>
        <SafeAreaView />
        <PlaidButton />
      </View>
    </ExpressWyre>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
