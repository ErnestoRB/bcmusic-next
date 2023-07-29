import React, { Dispatch, SetStateAction } from "react";

export const BackgroundContext = React.createContext<{
  background: string;
  setBackground: Dispatch<SetStateAction<string>>;
  setDefault: () => any;
} | null>(null);
