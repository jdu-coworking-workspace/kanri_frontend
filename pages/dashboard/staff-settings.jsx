import React from 'react';
import { MenuTabs } from '@/components/custom';
import PasswordUpdateCard from '@/components/custom/settings/password-update-card';
import Seo from '@/components/Seo/Seo';
import { useIntl } from 'react-intl';

export default function StaffSettingsPage() {
    const intl = useIntl();

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: '設定' })}
                description={intl.formatMessage({ id: '設定' })}
                keywords={intl.formatMessage({ id: '設定' })}
            />
            <MenuTabs />
            <div className="container mx-auto px-4 py-6 max-w-3xl">
                <PasswordUpdateCard />
            </div>
        </>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            info: {
                title: '設定',
                description: '設定',
                keywords: '設定',
            },
        },
    };
}
