import { createContext, useContext } from 'react';

// Create Dark Mode Context
export const TransportThemeContext = createContext();

export const useTransportTheme = () => useContext(TransportThemeContext);
