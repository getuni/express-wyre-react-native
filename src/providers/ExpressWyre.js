import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View } from "react-native";
import { typeCheck } from "type-check";

import { ExpressWyreContext } from "../contexts";
import { PlaidModal } from "../components";

function ExpressWyre({ children, baseUrl, ...extraProps }) {

  if (!typeCheck("String", baseUrl) || baseUrl.length <= 0) {
    throw new Error(`Expected String baseUrl, encountered ${baseUrl}.`);
  }

  const [resolve, setResolve] = useState(null);
  const [reject, setReject] = useState(null);

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

  return (
    <ExpressWyreContext.Provider
      value={{
        baseUrl,
        requestPublicToken,
      }}
    >
      {children}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <PlaidModal
          baseUrl={baseUrl}
          onPublicToken={onPublicToken}
          onExit={onExit}
          visible={!!resolve && !!reject}
        />
      </View>
    </ExpressWyreContext.Provider>
  );
}

ExpressWyre.propTypes = {
  baseUrl: PropTypes.string.isRequired,
};

ExpressWyre.defaultProps = {};

export default ExpressWyre;
