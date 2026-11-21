import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import useSWR from 'swr';
import { toast } from 'react-toastify';
import { ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { MenuTabs } from '@/components/custom';
import { MonthSwitcher, StatusBadge } from '@/components/custom/reports/report-ui';
import ReportFilters from '@/components/custom/reports/report-filters';
import Seo from '@/components/Seo/Seo';
import { usePagination } from '@/hooks/usePagination';
import fetcher from '@/utils/fetcher';
import {
    apiErrorMessage,
    downloadMonthlyReport,
    downloadPeriodReports,
    formatHours,
    readPeriod,
    reportTypeLabel,
} from '@/utils/reports';
import {
    clearedFilters,
    completionDenominator,
    completionPercent,
    downloadableCount,
    filtersToApiParams,
    filtersToQuery,
    hasActiveFilters,
    readFilters,
    sanitizeFilters,
} from '@/utils/reportFilters';
import { isAdminRole } from '@/utils/roles';

const LIST_PATH = '/dashboard/student-reports';
const EMPTY_PERIODS = [];
const EMPTY_ITEMS = [];
const EMPTY_PROJECTS = [];
const TABLE_COLUMNS = 8;

export default function StudentReportListPage() {
    const intl = useIntl();
    const router = useRouter();
    const currentUser = useSelector((state) => state.auth.user);
    const isAdmin = isAdminRole(currentUser?.role);
    const period = useMemo(
        () => (router.isReady ? readPeriod(router.query) : readPeriod({})),
        [router.isReady, router.query.year, router.query.month],
    );
    const { year, month } = period;

    // Filter holati URL query'da: yangilash, havolani ulashish va back/forward ishlaydi.
    const filters = useMemo(
        () => readFilters(router.isReady ? router.query : {}),
        [router.isReady, router.query],
    );
    const apiParams = useMemo(() => filtersToApiParams(filters, period), [filters, period]);

    const { data, error, isLoading, isValidating } = useSWR(
        router.isReady ? ['reports', JSON.stringify(apiParams)] : null,
        () => fetcher('reports', {}, apiParams),
        { keepPreviousData: true },
    );
    const { data: projectsData } = useSWR('projects?limit=100', (url) => fetcher(url, {}, {}, true));
    const projects = projectsData?.data ?? EMPTY_PROJECTS;

    const payload = data?.data;
    const items = payload?.items ?? EMPTY_ITEMS;
    const periods = payload?.periods ?? EMPTY_PERIODS;
    const hasPagination = payload?.total_pages != null;
    const statusCounts = payload?.status_counts;
    // Backend hozircha attention_counts qaytarmaydi: chip'larda son ko'rsatilmaydi.
    const attentionCounts = payload?.attention_counts;
    const totalRows = payload?.total ?? items.length;
    const totalStudents = payload?.total_students ?? totalRows;
    const totalPages = Math.max(1, payload?.total_pages ?? 1);
    const page = Math.min(filters.page, totalPages);
    const filtersActive = hasActiveFilters(filters);
    const periodIndex = periods.findIndex((item) => item.year === year && item.month === month);
    const pageRange = usePagination({ totalPageCount: totalPages, siblingCount: 1, currentPage: page }) || [];

    const [downloadingId, setDownloadingId] = useState('');
    const [downloadingAll, setDownloadingAll] = useState(false);
    // ZIP joriy filtrga bo'ysunadi. Draft va hisobotsiz qatorlar kirmaydi, son status_counts dan olinadi.
    const downloadableTotal = statusCounts
        ? downloadableCount(filters, statusCounts)
        : items.filter((item) => item.report_id && (item.can_open ?? item.status !== 'draft')).length;

    const applyFilters = useCallback(
        (next, { replace = false } = {}) => {
            router[replace ? 'replace' : 'push'](
                { pathname: LIST_PATH, query: filtersToQuery(sanitizeFilters(next), period) },
                undefined,
                { shallow: true },
            );
        },
        [router, period],
    );

    const goToPeriod = (next) => {
        router.replace(
            { pathname: LIST_PATH, query: filtersToQuery({ ...filters, page: 1 }, next) },
            undefined,
            { shallow: true },
        );
    };

    const download = async (item) => {
        if (!item.report_id) return;
        setDownloadingId(item.report_id);
        try {
            // Fayl nomini backend beradi (Content-Disposition).
            await downloadMonthlyReport(item.report_id);
            toast.success(intl.formatMessage({ id: 'reportDownloaded' }));
        } catch (downloadError) {
            toast.error(apiErrorMessage(downloadError, intl));
        } finally {
            setDownloadingId('');
        }
    };

    const downloadAll = async () => {
        setDownloadingAll(true);
        try {
            await downloadPeriodReports(year, month, filtersToApiParams(filters, period, { paged: false }));
            toast.success(intl.formatMessage({ id: 'reportDownloadedAll' }, { count: downloadableTotal }));
        } catch (downloadError) {
            toast.error(apiErrorMessage(downloadError, intl));
        } finally {
            setDownloadingAll(false);
        }
    };

    useEffect(() => {
        if (!router.isReady || periods.length === 0 || periodIndex >= 0) return;
        goToPeriod(periods[0]);
    }, [router.isReady, periods, periodIndex, year, month]);

    // Filtr kuchaygach sahifa soni kamaysa (yoki ulashilgan havola eskirsa) oxirgi sahifaga o'tamiz.
    // Faqat yangi javob kelgandan keyin: keepPreviousData paytida eski pagination aldamasligi uchun.
    useEffect(() => {
        if (!hasPagination || isValidating) return;
        if (filters.page > totalPages) applyFilters({ ...filters, page: totalPages }, { replace: true });
    }, [hasPagination, isValidating, totalPages, filters.page]);

    const changeMonth = (delta) => {
        const next = periods[periodIndex - delta];
        if (!next) return;
        goToPeriod(next);
    };

    const goToPage = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        applyFilters({ ...filters, page: nextPage });
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
                    <div className="flex flex-wrap items-center gap-3">
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={downloadAll}
                                disabled={downloadingAll || downloadableTotal === 0}
                                title={
                                    downloadableTotal === 0
                                        ? intl.formatMessage({ id: 'reportNothingToDownload' })
                                        : intl.formatMessage({
                                            id: filtersActive ? 'reportDownloadFilteredTitle' : 'reportDownloadAllTitle',
                                        })
                                }
                                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#122B31] hover:bg-[#1B2A32] disabled:opacity-40 text-white font-bold text-xs sm:text-sm"
                            >
                                {downloadingAll ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Download className="w-4 h-4" />
                                )}
                                {intl.formatMessage({ id: 'reportDownloadAll' })}
                                {downloadableTotal > 0 && (
                                    <span className="opacity-70">({downloadableTotal})</span>
                                )}
                            </button>
                        )}
                        <MonthSwitcher
                            year={year}
                            month={month}
                            onChange={changeMonth}
                            canGoBack={periodIndex >= 0 && periodIndex < periods.length - 1}
                            canGoForward={periodIndex > 0}
                        />
                    </div>
                </div>

                <ReportFilters
                    filters={filters}
                    onApply={applyFilters}
                    statusCounts={statusCounts}
                    attentionCounts={attentionCounts}
                    projects={projects}
                />

                {isLoading && (
                    <p className="text-sm text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: '読み込み中...' })}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-red-600">{intl.formatMessage({ id: 'エラーが発生しました' })}</p>
                )}

                {!isLoading && !error && (
                    <div
                        className={`bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] overflow-hidden transition-opacity ${
                            isValidating ? 'opacity-60' : ''
                        }`}
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-[820px] w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/40 text-left text-kanri-third dark:text-gray-400">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">{intl.formatMessage({ id: 'reportStudent' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: 'reportCode' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: 'reportName' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: 'reportType' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: '状態' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: 'reportHours' })}</th>
                                        <th className="px-3 py-3 font-medium">{intl.formatMessage({ id: 'filterCompletion' })}</th>
                                        <th className="px-4 py-3 font-medium" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.length === 0 && (
                                        <tr>
                                            <td colSpan={TABLE_COLUMNS} className="px-4 py-8 text-center text-kanri-third dark:text-gray-400">
                                                {filtersActive ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <p>{intl.formatMessage({ id: 'filterNoMatch' })}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => applyFilters(clearedFilters(filters))}
                                                            className="px-3.5 py-2 rounded-xl border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#122B31] dark:text-white text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-gray-700"
                                                        >
                                                            {intl.formatMessage({ id: 'filterClearFilters' })}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    intl.formatMessage({ id: 'reportEmpty' })
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                    {items.map((item) => {
                                        const percent = completionPercent(item);
                                        const canOpen = item.can_open ?? item.status !== 'draft';
                                        return (
                                            <tr key={item.report_id || item.student_id} className="border-t border-[#E4E9EE] dark:border-gray-700/60">
                                                <td className="px-4 py-3 font-medium text-[#122B31] dark:text-white">{item.student_name}</td>
                                                <td className="px-3 py-3 text-kanri-third dark:text-gray-300">{item.student_code}</td>
                                                <td className="px-3 py-3 text-[#122B31] dark:text-white">{item.title || '—'}</td>
                                                <td className="px-3 py-3 text-xs text-kanri-third dark:text-gray-300">{reportTypeLabel(item.report_type, intl)}</td>
                                                <td className="px-3 py-3"><StatusBadge status={item.status} /></td>
                                                <td className="px-3 py-3 text-[#122B31] dark:text-white">{formatHours(item.total_minutes)}</td>
                                                <td className="px-3 py-3">
                                                    {item.report_id ? (
                                                        <div
                                                            className="flex items-center gap-2"
                                                            title={`${item.filled_days ?? 0}/${completionDenominator(item)}`}
                                                        >
                                                            <div className="h-1.5 w-14 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
                                                                <div
                                                                    className="h-full rounded-full bg-[#122B31] dark:bg-white"
                                                                    style={{ width: `${percent}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs tabular-nums text-[#122B31] dark:text-white">{percent}%</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-kanri-third dark:text-gray-500">—</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {item.report_id ? (
                                                        <div className="inline-flex items-center gap-3">
                                                            {/* can_open=false (draft): detail va Excel 403 REPORT_DRAFT_HIDDEN qaytaradi, ikkala tugma yashirin. */}
                                                            {!canOpen && (
                                                                <span
                                                                    title={intl.formatMessage({ id: 'reportDraftHidden' })}
                                                                    className="text-kanri-third dark:text-gray-500"
                                                                >
                                                                    —
                                                                </span>
                                                            )}
                                                            {canOpen && (
                                                                <Link
                                                                    href={{
                                                                        pathname: '/dashboard/student-reports/[id]',
                                                                        query: { id: item.report_id, year, month },
                                                                    }}
                                                                    title={intl.formatMessage({ id: 'reportOpenTitle' })}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#122B31] dark:text-white font-semibold hover:bg-neutral-50 dark:hover:bg-gray-700"
                                                                >
                                                                    {intl.formatMessage({ id: 'reportOpen' })}
                                                                </Link>
                                                            )}
                                                            {isAdmin && canOpen && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => download(item)}
                                                                    disabled={downloadingId === item.report_id}
                                                                    title={intl.formatMessage({ id: 'reportDownloadTitle' })}
                                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#122B31] dark:text-white font-semibold hover:bg-neutral-50 dark:hover:bg-gray-700 disabled:opacity-50"
                                                                >
                                                                    {downloadingId === item.report_id ? (
                                                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                    ) : (
                                                                        <Download className="w-3.5 h-3.5" />
                                                                    )}
                                                                    {intl.formatMessage({ id: 'reportDownloadShort' })}
                                                                </button>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span
                                                            title={intl.formatMessage({ id: 'reportNoReportYet' })}
                                                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-dashed border-neutral-300 dark:border-gray-700 text-kanri-third dark:text-gray-500 text-xs"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                            {intl.formatMessage({ id: 'reportNoReportYetShort' })}
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {totalRows > 0 && (
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#E4E9EE] dark:border-gray-700/60">
                                <p className="text-xs text-kanri-third dark:text-gray-400">
                                    {intl.formatMessage(
                                        { id: 'reportPaginationSummary' },
                                        { total: totalRows, students: totalStudents, page, totalPages },
                                    )}
                                </p>
                                {totalPages > 1 && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => goToPage(page - 1)}
                                            disabled={page <= 1}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-[#122B31] dark:text-white disabled:opacity-40"
                                        >
                                            <ChevronLeft className="w-3.5 h-3.5" />
                                            {intl.formatMessage({ id: 'paginationPrev' })}
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {pageRange.map((pageNumber, index) =>
                                                pageNumber === '...' ? (
                                                    <span key={`dots-${index}`} className="px-1 text-xs text-kanri-third dark:text-gray-400">…</span>
                                                ) : (
                                                    <button
                                                        key={pageNumber}
                                                        type="button"
                                                        onClick={() => goToPage(pageNumber)}
                                                        className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold ${
                                                            pageNumber === page
                                                                ? 'bg-[#122B31] text-white dark:bg-white dark:text-[#122B31]'
                                                                : 'bg-gray-50 dark:bg-gray-700 text-[#122B31] dark:text-gray-200'
                                                        }`}
                                                    >
                                                        {pageNumber}
                                                    </button>
                                                ),
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => goToPage(page + 1)}
                                            disabled={page >= totalPages}
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
