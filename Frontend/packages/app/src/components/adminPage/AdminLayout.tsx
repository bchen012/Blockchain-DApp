import React from 'react';
import { Header, Page } from '@backstage/core-components';

type Props = {
    children?: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
    return (
        <Page themeId="tool">
            <Header title={'Admin '} />
            {children}
        </Page>
    );
};

export default AdminLayout;
