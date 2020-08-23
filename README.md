# express-wyre-react-native
💸 The companion React Native library for [`express-wyre`](https://github.com/cawfree/express-wyre).

## 🚀 Getting Started

Using [**Yarn**](https://yarnpkg.com) and [**Expo**](https://expo.io):

```sh
yarn add express-wyre-react-native
expo install react-native-webview
```

Using [**Yarn**](https://yarnpkg.com) and [**Vanilla**](https://reactnative.dev):

```sh
yarn add express-wyre-react-native
yarn add react-native-webview
```

## ✍️ Usage

Apply the default export [`ExpressWyre`](./src/providers/ExpressWyre.js) at the graphical root of your application. Then call the [`usePlaid`](./src/hooks/usePlaid/js) hook to [**request a public token**](https://docs.sendwyre.com/docs/payment-method-overview):

```javascript
import React from "react";
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from "react-native";

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
```

The `baseUrl` prop is **required**. This defines the location of your [`express-wyre`](https://github.com/cawfree/express-wyre) [**middleware**](https://expressjs.com/en/guide/using-middleware.html). For further details, check out the [**Example App**](./example/App.js).

## ✌️ License
[**MIT**](./LICENSE)
