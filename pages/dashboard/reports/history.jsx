import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { Download, Loader2 } from 'lucide-react';
import { MenuTabs } from '@/components/custom';
import { MonthTabs, StatusBadge } from '@/components/custom/reports/report-ui';
import Seo from '@/components/Seo/Seo';
import fetcher from '@/utils/fetcher';
import {
    apiErrorMessage,
    downloadMyReport,
    formatHours,
    groupReportsByPeriod,
    monthName,
    reportTypeLabel,
} from '@/utils/reports';

export default function StudentReportHistoryPage() {
    const intl = useIntl();
    const router = useRouter();
    const { data, error, isLoading } = useSWR('reports/me', (url) => fetcher(url));
    const periods = useMemo(() => groupReportsByPeriod(data?.data?.items), [data]);
    const [downloadingId, setDownloadingId] = useState('');

    const queryYear = Number(router.query.year);
    const queryMonth = Number(router.query.month);
    const activePeriod =
        periods.find((p) => p.year === queryYear && p.month === queryMonth) || periods[0];
    const activeKey = activePeriod ? `${activePeriod.year}-${activePeriod.month}` : '';

    const selectPeriod = (period) => {
        router.replace(
            { pathname: '/dashboard/reports/history', query: { year: period.year, month: period.month } },
            undefined,
            { shallow: true },
        );
    };

    const download = async (item) => {
        setDownloadingId(item.id);
        try {
            await downloadMyReport(
                item.id,
                `${item.title || 'report'}_${item.year}-${String(item.month).padStart(2, '0')}.xlsx`,
            );
            toast.success(intl.formatMessage({ id: 'reportDownloaded' }));
        } catch (downloadError) {
            toast.error(apiErrorMessage(downloadError, intl));
        } finally {
            setDownloadingId('');
        }
    };

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: 'reportHistoryTitle' })}
                description={intl.formatMessage({ id: 'reportHistoryHint' })}
                keywords={intl.formatMessage({ id: '成果報告' })}
            />
            <MenuTabs />
            <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col gap-5">
                <div className="flex flex-col gap-2 p-5 sm:p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px]">
                    <Link href="/dashboard/reports" className="w-fit text-xs font-semibold text-kanri-primary">
                        {intl.formatMessage({ id: 'reportBackToReports' })}
                    </Link>
                    <h1 className="text-2xl font-bold text-[#122B31] dark:text-white">
                        {intl.formatMessage({ id: 'reportHistoryTitle' })}
                    </h1>
                    <p className="text-sm text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: 'reportHistoryHint' })}
                    </p>
                </div>

                {isLoading && (
                    <p className="text-sm text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: '読み込み中...' })}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-red-600">{intl.formatMessage({ id: 'エラーが発生しました' })}</p>
                )}

                {!isLoading && !error && periods.length === 0 && (
                    <div className="rounded-[24px] border border-dashed border-[#D4D7E3] dark:border-gray-700 px-6 py-10 text-center text-sm text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: 'reportHistoryEmpty' })}
                    </div>
                )}

                {periods.length > 0 && (
                    <>
                        <MonthTabs periods={periods} activeKey={activeKey} onChange={selectPeriod} />

                        <div role="tabpanel" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                            {activePeriod?.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex flex-col rounded-[24px] border border-neutral-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 shadow-soft-sm dark:shadow-none"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h2 className="text-lg font-bold text-black dark:text-white">
                                                {item.title || intl.formatMessage({ id: 'reportUntitled' })}
                                            </h2>
                                            <p className="mt-1 text-sm text-kanri-third dark:text-gray-400">
                                                {monthName(item.year, item.month, intl.locale, true)}
                                            </p>
                                        </div>
                                        <StatusBadge status={item.status} />
                                    </div>
                                    <span className="mt-3 w-fit rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-neutral-600 dark:bg-neutral-900 dark:text-neutral-300">
                                        {reportTypeLabel(item.report_type, intl)}
                                    </span>
                                    <p className="mt-4 text-3xl font-semibold tabular-nums text-black dark:text-white">
                                        {formatHours(item.total_minutes)}
                                    </p>
                                    <p className="text-xs text-kanri-third dark:text-gray-400">
                                        {intl.formatMessage({ id: 'reportHours' })}
                                    </p>
                                    {item.review_note && (
                                        <p className="mt-4 rounded-2xl bg-neutral-100 px-3 py-2 text-sm text-black dark:bg-neutral-900 dark:text-white">
                                            <span className="block text-[11px] font-semibold uppercase tracking-wide opacity-70">
                                                {intl.formatMessage({ id: 'reportComment' })}
                                            </span>
                                            {item.review_note}
                                        </p>
                                    )}
                                    <div className="mt-auto flex items-center gap-2 pt-4">
                                        <Link
                                            href={{
                                                pathname: '/dashboard/reports/[id]',
                                                query: { id: item.id, readonly: '1' },
                                            }}
                                            className="inline-flex items-center px-3 py-1.5 rounded-lg border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#122B31] dark:text-white text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-gray-700"
                                        >
                                            {intl.formatMessage({ id: 'reportView' })}
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => download(item)}
                                            disabled={downloadingId === item.id}
                                            title={intl.formatMessage({ id: 'reportDownloadTitle' })}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#122B31] dark:text-white text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                        >
                                            {downloadingId === item.id ? (
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            ) : (
                                                <Download className="w-3.5 h-3.5" />
                                            )}
                                            {intl.formatMessage({ id: 'reportDownloadShort' })}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export async function getServerSideProps() {
    return {
        props: {
            info: { title: '成果報告', description: '成果報告', keywords: '成果報告' },
        },
    };
}