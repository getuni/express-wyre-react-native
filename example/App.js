import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Button, StyleSheet, SafeAreaView, View, TextInput } from 'react-native';

import ExpressWyre, { usePlaid } from "express-wyre-react-native";

function PlaidButton() {
  const { requestPublicToken } = usePlaid();
  return (
    <Button
      onPress={async () => {
        try {
          const { publicToken } = await requestPublicToken();
          console.warn(`Got a publicToken! ${publicToken}`);
        } catch (e) {
          console.warn(e);
        }
      }}
      title="Request Plaid Token"
    />
  );
};

export default function App() {
  const [value, onChangeText] = useState("");
  return (
    <ExpressWyre baseUrl="http://localhost:3000/wyre"> 
      <View style={[StyleSheet.absoluteFill]}>
        <SafeAreaView />
        <PlaidButton />
        <TextInput
          placeholder="Some text here. (This is for testing.)"
          onChangeText={onChangeText}
          value={value}
        />
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
