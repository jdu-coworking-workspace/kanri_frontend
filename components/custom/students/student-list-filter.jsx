import { BaseInput, BaseSelect, Button } from '@/components/ui'
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
                query: { ...router.query, q: query, page: '1' }
            }, undefined, { shallow: true });
        }
    };

    const handleFilterChange = (key, value) => {
        const newQuery = { ...router.query, page: '1' };
        if (value) {
            newQuery[key] = value;
        } else {
            delete newQuery[key];
        }
        router.push({
            pathname: router.pathname,
            query: newQuery,
        }, undefined, { shallow: true });
    };

    const skillRankOptions = [
        { value: "", label: intl.formatMessage({ id: '全て' }) },
        { value: "S", label: "S" },
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
        { value: "D", label: "D" },
        { value: "E", label: "E" },
    ];

    const workStatusOptions = [
        { value: "", label: intl.formatMessage({ id: '全て' }) },
        { value: "active", label: intl.formatMessage({ id: 'activeStatus' }) },
        { value: "intern", label: intl.formatMessage({ id: 'internStatus' }) },
        { value: "on_leave", label: intl.formatMessage({ id: 'onLeaveStatus' }) },
    ];

    const semesterOptions = [
        { value: "", label: intl.formatMessage({ id: '全て' }) },
        { value: "1-semestr", label: intl.formatMessage({ id: 'semester1' }) },
        { value: "2-semestr", label: intl.formatMessage({ id: 'semester2' }) },
        { value: "3-semestr", label: intl.formatMessage({ id: 'semester3' }) },
        { value: "4-semestr", label: intl.formatMessage({ id: 'semester4' }) },
        { value: "5-semestr", label: intl.formatMessage({ id: 'semester5' }) },
        { value: "6-semestr", label: intl.formatMessage({ id: 'semester6' }) },
        { value: "7-semestr", label: intl.formatMessage({ id: 'semester7' }) },
        { value: "8-semestr", label: intl.formatMessage({ id: 'semester8' }) },
        { value: "9-semestr", label: intl.formatMessage({ id: 'semester9' }) },
    ];

    return (
        <div className="flex flex-col gap-3 w-full">
            {/* Search + Add button row */}
            <div className="flex sm:flex-row flex-col justify-between gap-3 w-full">
                <BaseInput 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    placeholder={intl.formatMessage({ id: '学生名で絞り込み' })} 
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

            {/* Filter row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <BaseSelect
                    label="skillRank"
                    value={router.query.skill_rank || ""}
                    onChange={(e) => handleFilterChange('skill_rank', e.target.value)}
                    options={skillRankOptions}
                    placeholder="全て"
                />
                <BaseSelect
                    label="workStatus"
                    value={router.query.work_status || ""}
                    onChange={(e) => handleFilterChange('work_status', e.target.value)}
                    options={workStatusOptions}
                    placeholder="全て"
                />
                <BaseSelect
                    label="semester"
                    value={router.query.semester || ""}
                    onChange={(e) => handleFilterChange('semester', e.target.value)}
                    options={semesterOptions}
                    placeholder="全て"
                />
            </div>
        </div>
    )
}
