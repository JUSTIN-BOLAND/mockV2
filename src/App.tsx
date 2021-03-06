import React, { createContext, useState } from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import PWAPrompt from 'react-ios-pwa-prompt';
import GlobalStyle from './styles/global';
import Routes from './routes';
import history from './services/history';
import light from './styles/themes/light';
import dark from './styles/themes/dark';
import usePersistedState from './utils/hooks/usePersistedState';

interface AppContextInterface {
  toggleTheme: () => void;
  toggleDrawer: () => void;
  drawerOpen: boolean;
}

const initialTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
  ? dark
  : light;

const AppContext = createContext<AppContextInterface | null>(null);

const { Provider: AppContextProvider } = AppContext;

const App: React.FC = () => {
  const [theme, setTheme] = usePersistedState<DefaultTheme>(
    'theme',
    initialTheme
  );
  const [drawerOpen, setDrawerOpen] = useState(window.innerWidth > 1200);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <Router history={history}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <AppContextProvider
            value={{
              toggleTheme,
              toggleDrawer,
              drawerOpen,
            }}
          >
            <Routes />
          </AppContextProvider>
        </ThemeProvider>
      </Router>
      <PWAPrompt
        promptOnVisit={1}
        copyClosePrompt="Close"
        permanentlyHideOnDismiss={false}
        copyBody="(On Safari) This website has app functionality. Add it to your home screen to use it in fullscreen and while offline."
      />
    </>
  );
};

export { App, AppContext };
