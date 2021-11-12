import React from 'react';
import { Header, Page } from '@backstage/core-components';

type Props = {
    children?: React.ReactNode;
};

const ExchangeLayout = ({ children }: Props) => {
    return (
        <Page themeId="tool">
            <Header title={'Exchange Rate '} />
            {children}
        </Page>
    );
};

export default ExchangeLayout;
