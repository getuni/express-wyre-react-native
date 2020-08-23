import { useContext } from "react";

import { ExpressWyreContext } from "../contexts";

export default function usePlaid() {
  const { requestPublicToken } = useContext(ExpressWyreContext);
  return { requestPublicToken };
}
