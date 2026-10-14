import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { MenuTabs } from '@/components/custom';
import { StatusBadge } from '@/components/custom/reports/report-ui';
import Seo from '@/components/Seo/Seo';
import { authAxios } from '@/utils/axios';
import fetcher from '@/utils/fetcher';
import { apiErrorMessage, dateLocale, formatHours } from '@/utils/reports';

function monthName(year, month, locale, withYear = false) {
    return new Intl.DateTimeFormat(dateLocale(locale), withYear ? { month: 'long', year: 'numeric' } : { month: 'long' }).format(
        new Date(year, month - 1, 1),
    );
}

function noteClass(status) {
    if (status === 'rejected') return 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100';
    if (status === 'approved') return 'bg-black text-white dark:bg-white dark:text-black';
    return 'bg-neutral-100 text-black dark:bg-neutral-900 dark:text-white';
}

export default function StudentReportsPage() {
    const intl = useIntl();
    const router = useRouter();
    const { data, error, isLoading, mutate } = useSWR('reports/me', (url) => fetcher(url));
    const summary = data?.data;
    const items = summary?.items || [];
    const [adding, setAdding] = useState(false);
    const currentLabel = summary
        ? monthName(summary.current_year, summary.current_month, intl.locale, true)
        : '';

    const addMonth = async () => {
        setAdding(true);
        try {
            const response = await authAxios.post('reports/me');
            await mutate();
            const reportId = response.data?.data?.id;
            if (reportId) router.push(`/dashboard/reports/${reportId}`);
        } catch (addError) {
            toast.error(apiErrorMessage(addError, intl));
        } finally {
            setAdding(false);
        }
    };

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: 'reportJournalTitle' })}
                description={intl.formatMessage({ id: 'reportJournalHint' })}
                keywords={intl.formatMessage({ id: '成果報告' })}
            />
            <MenuTabs />
            <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col gap-5">
                <section className="rounded-[28px] border border-neutral-200 dark:border-gray-700 bg-white dark:bg-[url('/images/project-dark-bg.png')] dark:bg-cover dark:bg-center text-black dark:text-white px-6 py-7 sm:px-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-black/50 dark:text-white/50">
                        {intl.formatMessage({ id: '成果報告' })}
                    </p>
                    <h1 className="mt-2 text-2xl sm:text-3xl font-bold">
                        {intl.formatMessage({ id: 'reportJournalTitle' })}
                    </h1>
                    <p className="mt-2 max-w-xl text-sm text-black/70 dark:text-white/70">
                        {intl.formatMessage({ id: 'reportJournalHint' })}
                    </p>
                    {summary && (
                        <button
                            type="button"
                            onClick={addMonth}
                            disabled={!summary.can_add_current || adding}
                            className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-black px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-black disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Plus className="w-4 h-4" />
                            {summary.can_add_current
                                ? intl.formatMessage({ id: 'reportAddMonth' }, { month: currentLabel })
                                : intl.formatMessage({ id: 'reportAlreadyAdded' })}
                        </button>
                    )}
                </section>

                {isLoading && (
                    <p className="text-sm text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: '読み込み中...' })}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-red-600">
                        {error?.data?.detail?.code === 'STUDENT_PROFILE_NOT_FOUND'
                            ? intl.formatMessage({ id: 'reportNoProfile' })
                            : intl.formatMessage({ id: 'エラーが発生しました' })}
                    </p>
                )}

                {!isLoading && !error && items.length === 0 && (
                    <div className="rounded-[24px] border border-dashed border-[#D4D7E3] dark:border-gray-700 px-6 py-10 text-center text-sm text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: 'reportNoReports' })}
                    </div>
                )}

                {items.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                        {items.map((item) => {
                            const progress = item.day_count ? Math.round((item.filled_days / item.day_count) * 100) : 0;
                            return (
                                <Link
                                    key={item.id}
                                    href={`/dashboard/reports/${item.id}`}
                                    className="group flex flex-col min-h-[240px] rounded-[24px] border border-neutral-200 dark:border-gray-700 bg-white dark:bg-[url('/images/project-dark-bg.png')] dark:bg-cover dark:bg-center p-5 shadow-soft-sm dark:shadow-none transition hover:-translate-y-0.5"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-kanri-third dark:text-gray-400">
                                                {item.year}
                                            </p>
                                            <h2 className="mt-1 text-2xl font-bold text-black dark:text-white">
                                                {monthName(item.year, item.month, intl.locale)}
                                            </h2>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <p className="mt-5 text-3xl font-semibold tabular-nums text-black dark:text-white">
                                        {formatHours(item.total_minutes)}
                                    </p>
                                    <p className="text-xs text-kanri-third dark:text-gray-400">
                                        {intl.formatMessage({ id: 'reportHours' })}
                                    </p>
                                    <div className="mt-4 h-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
                                        <div className="h-full rounded-full bg-black dark:bg-white" style={{ width: `${progress}%` }} />
                                    </div>
                                    <p className="mt-2 text-xs text-kanri-third dark:text-gray-400">
                                        {intl.formatMessage({ id: 'reportFilled' })} {item.filled_days}/{item.day_count}
                                    </p>
                                    {item.review_note && (
                                        <p className={`mt-4 rounded-2xl px-3 py-2 text-sm ${noteClass(item.status)}`}>
                                            <span className="block text-[11px] font-semibold uppercase tracking-wide opacity-70">
                                                {intl.formatMessage({ id: 'reportComment' })}
                                            </span>
                                            {item.review_note}
                                        </p>
                                    )}
                                    <span className="mt-auto pt-4 text-sm font-semibold text-black dark:text-white">
                                        {item.editable
                                            ? intl.formatMessage({ id: 'reportContinue' })
                                            : intl.formatMessage({ id: 'reportView' })}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            info: {
                title: '成果報告',
                description: '成果報告',
                keywords: '成果報告',
            },
        },
    };
}
