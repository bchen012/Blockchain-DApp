import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { HeaderTabs } from '@backstage/core-components';

/**
 * A component type, and a human readable label for it.
 */
export type TechFamilyTab = {
    id: string;
    label: string;
};

/**
 * Called on mount, and when the selected tab changes.
 */
export type OnChangeCallback = (tab: TechFamilyTab) => void;

type Props = {
    tabs: TechFamilyTab[];
    onChange?: OnChangeCallback;
};

export const AccountTabs = ({ tabs, onChange }: Props) => {
    const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);

    // Hold a reference to the callback
    const onChangeRef = useRef<OnChangeCallback>();
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        onChangeRef.current?.(tabs[currentTabIndex]);
    }, [tabs, currentTabIndex]);

    const switchTab = useCallback(
        (index: number) => {
            const tab = tabs[index];
            setCurrentTabIndex(index);
            onChangeRef.current?.(tab);
        },
        [tabs],
    );

    return <HeaderTabs tabs={tabs} onChange={switchTab} />;
};
