import React, { useRef, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Platform, StyleSheet } from "react-native";
import { typeCheck } from "type-check";
import { WebViewModal } from "react-native-webview-modal";
import { getStatusBarHeight } from "react-native-status-bar-height";

const styles = StyleSheet.create({
  modal: { backgroundColor: "transparent" },
  nativeContainerStyle: {
    marginTop: getStatusBarHeight(),
    marginHorizontal: 15,
  },
});

// XXX: This is a blank template we use to force refresh.
const html = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\" /><meta http-equiv=\"x-ua-compatible\" content=\"ie=edge, chrome=1\" /><title></title></head><body></body></html>";

function PlaidModal({ visible, onPublicToken, onExit, baseUrl, ...extraProps }) {

  const createSource = useCallback(() => ({ uri: `${baseUrl}/verify` }), [baseUrl]);
  const [source, setSource] = useState(createSource);

  const shouldReload = useCallback(
    async () => {
      await setSource({ html });
      await setSource(createSource);
    },
    [setSource, createSource],
  );

  const onMessage = useCallback(
    async ({ nativeEvent: { data }}) => {
      try {
        const e = JSON.parse(data);
        if (typeCheck("{type:String,...}", e)) {
          const {type, ...extras} = e;
          if (type === "plaid/result") {
            const { publicToken } = extras;
            await onPublicToken(publicToken);
            return shouldReload();
          } else if (type === "plaid/exit") {
            await onExit();
            return shouldReload();
          }
        }
      } catch (e) {}
    },
    [onPublicToken, onExit, shouldReload],
  );

  const nativeProps = {
    containerStyle: styles.nativeContainerStyle,
  };

  const conditionalProps = Platform.select(
    {
      android: nativeProps,
      ios: nativeProps,
      default: {},
    },
  );

  return (
    <WebViewModal
      {...conditionalProps}
      visible={visible}
      style={[StyleSheet.absoluteFill, styles.modal]}
      source={source}
      onMessage={onMessage}
    />
  );
}

PlaidModal.propTypes = {
  baseUrl: PropTypes.string.isRequired,
  onPublicToken: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired,
  visible: PropTypes.bool,
};

PlaidModal.defaultProps = {
  visible: false,
};

export default PlaidModal;
