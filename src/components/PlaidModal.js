import React, { useCallback } from "react";
import PropTypes from "prop-types";
import ModalBox from "react-native-modalbox";
import { Platform, StyleSheet } from "react-native";
import { typeCheck } from "type-check";

import { WebView } from ".";

const styles = StyleSheet.create({
  modal: { backgroundColor: "transparent" },
});

function PlaidModal({ visible, onPublicToken, onExit, baseUrl, ...extraProps }) {
  const onMessage = useCallback(
    ({ nativeEvent: { data }}) => {
      try {
        const e = JSON.parse(data);
        if (typeCheck("{type:String,...}", e)) {
          const {type, ...extras} = e;
          if (type === "plaid/result") {
            const { publicToken } = extras;
            return onPublicToken(publicToken);
          } else if (type === "plaid/exit") {
            return onExit();
          }
        }
      } catch (e) {}
    },
    [onPublicToken, onExit],
  );
  return (
    <ModalBox
      style={StyleSheet.flatten([StyleSheet.absoluteFill, styles.modal])}
      coverScreen={Platform.OS !== "web"}
      isOpen={visible}
    >
      <WebView
        style={StyleSheet.absoluteFill}
        source={{
          uri: `${baseUrl}/verify`,
        }}
        scalesPageToFit={false}
        onMessage={onMessage}
      />
    </ModalBox>
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
