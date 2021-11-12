import React from 'react';
import { Header, Page } from '@backstage/core-components';

type Props = {
    children?: React.ReactNode;
};

const AccountLayout = ({ children }: Props) => {
    return (
        <Page themeId="tool">
            <Header title={'Account '} />
            {children}
        </Page>
    );
};

export default AccountLayout;
