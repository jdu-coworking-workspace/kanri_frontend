import React, { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import useSWR from 'swr';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MenuTabs } from '@/components/custom';
import { MonthSwitcher, StatusBadge } from '@/components/custom/reports/report-ui';
import Seo from '@/components/Seo/Seo';
import fetcher from '@/utils/fetcher';
import { formatHours, readPeriod } from '@/utils/reports';

const PAGE_SIZE = 10;
const EMPTY_PERIODS = [];

export default function StudentReportListPage() {
    const intl = useIntl();
    const router = useRouter();
    const period = useMemo(
        () => (router.isReady ? readPeriod(router.query) : readPeriod({})),
        [router.isReady, router.query.year, router.query.month],
    );
    const { year, month } = period;
    const { data, error, isLoading } = useSWR(
        ['reports', year, month],
        ([, reportYear, reportMonth]) => fetcher('reports', {}, { year: reportYear, month: reportMonth }),
    );
    const items = data?.data?.items || [];
    const periods = data?.data?.periods ?? EMPTY_PERIODS;
    const periodIndex = periods.findIndex((item) => item.year === year && item.month === month);
    const page = Math.max(1, parseInt(String(router.query.page || '1'), 10) || 1);
    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const visibleItems = items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    useEffect(() => {
        if (!router.isReady || periods.length === 0 || periodIndex >= 0) return;
        const next = periods[0];
        router.replace(
            { pathname: '/dashboard/student-reports', query: { year: next.year, month: next.month } },
            undefined,
            { shallow: true },
        );
    }, [router.isReady, periods, periodIndex, year, month]);

    const changeMonth = (delta) => {
        const next = periods[periodIndex - delta];
        if (!next) return;
        router.replace(
            { pathname: '/dashboard/student-reports', query: { year: next.year, month: next.month } },
            undefined,
            { shallow: true },
        );
    };

    const goToPage = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        router.replace(
            {
                pathname: '/dashboard/student-reports',
                query: { year, month, page: String(nextPage) },
            },
            undefined,
            { shallow: true },
        );
    };

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: 'reportListTitle' })}
                description={intl.formatMessage({ id: 'reportListTitle' })}
                keywords={intl.formatMessage({ id: '成果報告' })}
            />
            <MenuTabs />
            <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px]">
                    <h1 className="text-lg font-bold text-[#122B31] dark:text-white">
                        {intl.formatMessage({ id: 'reportListTitle' })}
                    </h1>
                    <MonthSwitcher
                        year={year}
                        month={month}
                        onChange={changeMonth}
                        canGoBack={periodIndex >= 0 && periodIndex < periods.length - 1}
                        canGoForward={periodIndex > 0}
                    />
                </div>

                {isLoading && (
                    <p className="text-sm text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: '読み込み中...' })}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-red-600">{intl.formatMessage({ id: 'エラーが発生しました' })}</p>
                )}

                {!isLoading && !error && (
                    <div className="bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[720px] w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/40 text-left text-kanri-third dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">{intl.formatMessage({ id: 'reportStudent' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: 'reportCode' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: '状態' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: 'reportHours' })}</th>
                                        <th className="px-4 py-3 font-medium" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-kanri-third dark:text-gray-400">
                                                {intl.formatMessage({ id: 'reportEmpty' })}
                                            </td>
                                        </tr>
                                    )}
                                    {visibleItems.map((item) => (
                                        <tr key={item.student_id} className="border-t border-[#E4E9EE] dark:border-gray-700/60">
                                            <td className="px-4 py-3 font-medium text-[#122B31] dark:text-white">{item.student_name}</td>
                                            <td className="px-3 py-3 text-kanri-third dark:text-gray-300">{item.student_code}</td>
                                            <td className="px-3 py-3"><StatusBadge status={item.status} /></td>
                                            <td className="px-3 py-3 text-[#122B31] dark:text-white">{formatHours(item.total_minutes)}</td>
                                            <td className="px-4 py-3 text-right">
                                                {['submitted', 'approved', 'rejected'].includes(item.status) ? (
                                                    <Link
                                                        href={{
                                                            pathname: '/dashboard/student-reports/[id]',
                                                            query: { id: item.report_id, year, month },
                                                        }}
                                                        className="text-kanri-primary font-semibold"
                                                    >
                                                        {intl.formatMessage({ id: 'reportOpen' })}
                                                    </Link>
                                                ) : (
                                                    <span className="text-kanri-third dark:text-gray-500">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {items.length > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#E4E9EE] dark:border-gray-700/60">
                                <p className="text-xs text-kanri-third dark:text-gray-400">
                                    {intl.formatMessage(
                                        { id: 'paginationTotalStudents' },
                                        { total: items.length, page: safePage, totalPages },
                                    )}
                                </p>
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => goToPage(safePage - 1)}
                                            disabled={safePage <= 1}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#122B31] dark:text-white disabled:opacity-40"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                            {intl.formatMessage({ id: 'paginationPrev' })}
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                                                <button
                                                    key={pageNumber}
                                                    type="button"
                                                    onClick={() => goToPage(pageNumber)}
                                                    className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold ${
                                                        pageNumber === safePage
                                                            ? 'bg-[#122B31] text-white dark:bg-white dark:text-[#122B31]'
                                                            : 'bg-gray-50 dark:bg-gray-700 text-[#122B31] dark:text-gray-200'
                                                    }`}
                                                >
                                                    {pageNumber}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => goToPage(safePage + 1)}
                                            disabled={safePage >= totalPages}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#122B31] dark:text-white disabled:opacity-40"
                                        >
                                            {intl.formatMessage({ id: 'paginationNext' })}
                                            <ChevronRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
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
