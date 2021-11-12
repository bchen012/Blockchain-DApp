import React from 'react';
import { Navigate, Route } from 'react-router';
import { UserSettingsPage } from '@backstage/plugin-user-settings';
import { Root } from './components/Root';
import { AlertDisplay, OAuthRequestDialog } from '@backstage/core-components';
import { createApp, FlatRoutes } from '@backstage/core-app-api';
import { AccountPage } from "./components/accountPage/AccountPage";
import {ExchangeRatePage} from "./components/exchangeRatePage/ExchangeRatePage";
import {LiquidatePage} from "./components/liquidatePage/LiquidatePage";
import {AdminPage} from "./components/adminPage/AdminPage";
import { NftStorePage } from "./components/nftStorePage/NftStorePage";

const app = createApp();

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();


const routes = (
  <FlatRoutes>
        <Navigate key="/" to="account" />
        <Route
          path="/account"
        >
            <AccountPage />
        </Route>
      <Route
          path="/exchangeRate"
      >
          <ExchangeRatePage />
      </Route>
      <Route
          path="/liquidate"
      >
          <LiquidatePage />
      </Route>
      <Route
          path="/admin"
      >
          <AdminPage />
      </Route>
      <Route
          path="/nftStore"
      >
          <NftStorePage />
      </Route>


    <Route path="/settings" element={<UserSettingsPage />} />
  </FlatRoutes>
);

const App = () => {

    return (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <Root>{routes}</Root>
    </AppRouter>
  </AppProvider>
)};

export default App;
