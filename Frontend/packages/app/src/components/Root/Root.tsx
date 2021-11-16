/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useContext, PropsWithChildren } from 'react';
import { Link, makeStyles } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import StoreIcon from '@material-ui/icons/Store';
import LogoFull from './LogoFull';
import LogoIcon from './LogoIcon';
import { NavLink } from 'react-router-dom';
import { Settings as SidebarSettings } from '@backstage/plugin-user-settings';
import {
  Sidebar,
  SidebarPage,
  sidebarConfig,
  SidebarContext,
  SidebarItem,
  SidebarDivider,
  SidebarSpace,
} from '@backstage/core-components';

const useSidebarLogoStyles = makeStyles({
  root: {
    width: sidebarConfig.drawerWidthClosed,
    height: 3 * sidebarConfig.logoHeight,
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    marginBottom: -14,
  },
  link: {
    width: sidebarConfig.drawerWidthClosed,
    marginLeft: 24,
  },
});

const SidebarLogo = () => {
  const classes = useSidebarLogoStyles();
  const { isOpen } = useContext(SidebarContext);

  return (
    <div className={classes.root}>
      <Link
        component={NavLink}
        to="/"
        underline="none"
        className={classes.link}
      >
        {isOpen ? <LogoFull /> : <LogoIcon />}
      </Link>
    </div>
  );
};

export const Root = ({ children }: PropsWithChildren<{}>) => (
  <SidebarPage>
    <Sidebar>
      <SidebarLogo />
      <SidebarDivider />
      <SidebarItem icon={HomeIcon} to="account" text="Home" />
      {/*<SidebarItem icon={ImportExportIcon} to="exchangeRate" text="Exchange Rate" />*/}
      <SidebarItem icon={MonetizationOnIcon} to="liquidate" text="Liquidity" />
      <SidebarItem icon={StoreIcon} to="nftStore" text="NFT Store" />
      <SidebarDivider />

      <SidebarSpace />
      <SidebarDivider />
      <SidebarItem icon={SupervisorAccountIcon} to="admin" text="Admin" />
      <SidebarSettings />
    </Sidebar>
    {children}
  </SidebarPage>
);
