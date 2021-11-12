import React from 'react';
import { Header, Page } from '@backstage/core-components';

type Props = {
    children?: React.ReactNode;
};

const LiquidateLayout = ({ children }: Props) => {
    return (
        <Page themeId="tool">
            <Header title={'Liquidate '} />
            {children}
        </Page>
    );
};

export default LiquidateLayout;
