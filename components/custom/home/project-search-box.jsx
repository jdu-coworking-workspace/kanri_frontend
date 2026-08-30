import { BaseInput, BaseSelect, Button } from '@/components/ui';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

export default function ProjectSearchBox({ onOpenCreate }) {
    const intl = useIntl();
    const router = useRouter();

    const [name, setName] = useState(router.query.name || '');
    const [member, setMember] = useState(router.query.member || '');
    const [status, setStatus] = useState(router.query.status || '');
    const [category, setCategory] = useState(router.query.category || '');

    const updateQuery = (updates) => {
        const query = { ...router.query, ...updates };
        // Clean up empty params
        Object.keys(query).forEach(key => {
            if (!query[key]) delete query[key];
        });

        router.push({
            pathname: router.pathname,
            query
        }, undefined, { shallow: true });
    };

    const handleSearch = () => {
        updateQuery({ name, member, status, category });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <div className='flex 6xl:flex-row flex-col 6xl:items-baseline items-start justify-between w-full gap-3'>
            <div className='grid grid-cols-2 lg:grid-cols-3 w-full 6xl:w-3/4 shrink-0 gap-3 sm:gap-4'>
                <BaseInput 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    placeholder={intl.formatMessage({ id: '名前で絞り込み' })} 
                />
                <BaseInput 
                    value={member} 
                    onChange={e => setMember(e.target.value)} 
                    onKeyDown={handleKeyDown} 
                    placeholder={intl.formatMessage({ id: '学生名で絞り込み' })} 
                />
                <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-1 col-span-2'>
                    <BaseSelect
                        label={intl.formatMessage({ id: '状態' })}
                        labelPosition="left"
                        options={[
                            { value: '', label: intl.formatMessage({ id: '全て' }) },
                            { value: 'planned', label: intl.formatMessage({ id: '計画中' }) },
                            { value: 'active', label: intl.formatMessage({ id: '稼働中' }) },
                            { value: 'done', label: intl.formatMessage({ id: '完了' }) },
                        ]}
                        value={status}
                        onChange={(e) => { 
                            setStatus(e.target.value); 
                            updateQuery({ status: e.target.value });
                        }}
                    />
                    <BaseSelect
                        label={intl.formatMessage({ id: '種別' })}
                        labelPosition="left"
                        options={[
                            { value: '', label: intl.formatMessage({ id: '全て' }) },
                            { value: 'trial', label: intl.formatMessage({ id: 'トライアル' }) },
                            { value: 'it', label: intl.formatMessage({ id: 'IT・開発' }) },
                            { value: 'video', label: intl.formatMessage({ id: '動画制作' }) },
                            { value: 'light_work', label: intl.formatMessage({ id: '軽作業' }) },
                        ]}
                        value={category}
                        onChange={(e) => { 
                            setCategory(e.target.value); 
                            updateQuery({ category: e.target.value });
                        }}
                    />
                </div>
            </div>
            <Button
                onClick={onOpenCreate}
                leftIcon={`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.99996 2.91675V11.0834M2.91663 7.00008H11.0833" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`}
            >
                {intl.formatMessage({ id: 'プロジェクトを作成' })}
            </Button>
        </div>
    );
}