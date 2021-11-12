import React from 'react';
import { Header, Page } from '@backstage/core-components';

type Props = {
    children?: React.ReactNode;
};

const NftStoreLayout = ({ children }: Props) => {
    return (
        <Page themeId="tool">
            <Header title={'NFT Collectibles Shop '} />
            {children}
        </Page>
    );
};

export default NftStoreLayout;
