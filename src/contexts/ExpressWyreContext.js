import React from "react";

const defaultContext = Object.freeze({
  baseUrl: null,
  requestPublicToken: () => {
    throw new Error("It looks like you have forgotten to place an <ExpressWyreProvider /> at the root of your App.");
  },
});

const ExpressWyreContext = React.createContext(defaultContext);

export default ExpressWyreContext;
