import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Platform, Animated, StyleSheet, View } from "react-native";
import { typeCheck } from "type-check";
import WebViewModalProvider from "react-native-webview-modal";

import { ExpressWyreContext } from "../contexts";
import { PlaidModal } from "../components";

const styles = StyleSheet.create({
  plaid: { backgroundColor: "white" },
});

function ExpressWyre({ children, baseUrl, ...extraProps }) {

  if (!typeCheck("String", baseUrl) || baseUrl.length <= 0) {
    throw new Error(`Expected String baseUrl, encountered ${baseUrl}.`);
  }

  const [resolve, setResolve] = useState(null);
  const [reject, setReject] = useState(null);
  const [visible, setVisible] = useState(false);
  const [animOpacity] = useState(() => new Animated.Value(0));

  const clearCallbacks = useCallback(
    () => {
      setResolve(null);
      setReject(null);
    },
    [setResolve, setReject],
  );

  const requestPublicToken = useCallback(
    async () => {
      try {
        const publicToken = await new Promise(
          (resolve, reject) => {
            setResolve(() => resolve);
            setReject(() => reject);
          },
        );
        clearCallbacks();
        return publicToken;
      } catch (e) {
        clearCallbacks();
        throw e;
      }
    },
    [setResolve, setReject, clearCallbacks],
  );

  const onPublicToken = useCallback(
    (publicToken) => typeCheck("Function", resolve) && resolve({ publicToken }),
    [resolve],
  );

  const onExit = useCallback(
    () => typeCheck("Function", reject) && reject(new Error("ExpressWyre: User dismissed Plaid.")),
    [reject],
  );

  const isInProgress = !!resolve && !!reject;

  useEffect(
    () => {
      Animated.timing(
        animOpacity,
        {
          toValue: isInProgress ? 1 : 0,
          duration: 250,
          useNativeDriver: Platform.OS !== "web",
        },
      ).start(() => setVisible(isInProgress));
    },
    [setVisible, isInProgress, animOpacity],
  );

  return (
    <ExpressWyreContext.Provider
      value={{
        baseUrl,
        requestPublicToken,
      }}
    >
      <WebViewModalProvider>
        {children}
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
          <Animated.View
            pointerEvents={isInProgress ? "auto" : "none"}
            style={[
              StyleSheet.absoluteFill,
              styles.plaid,
              { opacity: animOpacity },
            ]}
          />
          <PlaidModal
            baseUrl={baseUrl}
            onPublicToken={onPublicToken}
            onExit={onExit}
            visible={visible}
          />
        </View>
      </WebViewModalProvider>
    </ExpressWyreContext.Provider>
  );
}

ExpressWyre.propTypes = {
  baseUrl: PropTypes.string.isRequired,
};

ExpressWyre.defaultProps = {};

export default ExpressWyre;
