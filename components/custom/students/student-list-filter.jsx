import { BaseInput, Button } from '@/components/ui'
import React, { useState } from 'react'
import { useIntl } from 'react-intl';
import { useRouter } from 'next/router';

export default function StudentListFilter({ onOpenCreate }) {
    const intl = useIntl();
    const router = useRouter();

    const [query, setQuery] = useState(router.query.q || '');

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            router.push({
                pathname: router.pathname,
                query: { ...router.query, q: query }
            }, undefined, { shallow: true });
        }
    };

    return (
        <div className="flex sm:flex-row flex-col justify-between gap-3 w-full">
            <BaseInput 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder={intl.formatMessage({ id: '名前で絞り込み' })} 
            />
            <div className="flex sm:justify-start justify-end">
                <Button
                    onClick={onOpenCreate}
                    leftIcon={`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.99996 2.91675V11.0834M2.91663 7.00008H11.0833" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`}
                >
                    {intl.formatMessage({ id: '学生を追加' })}
                </Button>
            </div>
        </div>
    )
}
