import { createContext, type ReactNode, useContext, useMemo, useState } from "react";

type ThemeState = {
  primary: string;
  setPrimary: (color: string) => void;
};

const ThemeContext = createContext<ThemeState>({
  primary: "#6366f1",
  setPrimary: () => undefined
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [primary, setPrimary] = useState("#6366f1");
  const value = useMemo(() => ({ primary, setPrimary }), [primary]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
