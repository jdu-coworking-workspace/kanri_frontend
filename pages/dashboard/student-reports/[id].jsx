import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import useSWR, { mutate as mutateCache } from 'swr';
import { toast } from 'react-toastify';
import { MenuTabs } from '@/components/custom';
import { StatusBadge } from '@/components/custom/reports/report-ui';
import Seo from '@/components/Seo/Seo';
import { authAxios } from '@/utils/axios';
import fetcher from '@/utils/fetcher';
import { apiErrorMessage, dateLocale, formatHours } from '@/utils/reports';
import { isAdminRole } from '@/utils/roles';

export default function StudentReportDetailPage() {
    const intl = useIntl();
    const router = useRouter();
    const currentUser = useSelector((state) => state.auth.user);
    const isAdmin = isAdminRole(currentUser?.role);
    const reportId = router.isReady ? router.query.id : null;
    const { data, error, isLoading, mutate } = useSWR(
        reportId ? `reports/${reportId}` : null,
        (url) => fetcher(url),
    );
    const report = data?.data;
    const [note, setNote] = useState('');
    const [stipend, setStipend] = useState('');
    const [pending, setPending] = useState('');
    const locale = dateLocale(intl.locale);
    const canReview = isAdmin && report?.status === 'submitted';
    const monthTitle = report
        ? new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(report.year, report.month - 1, 1))
        : '';

    const decide = async (decision) => {
        setPending(decision);
        try {
            const payload = { review_note: note.trim() || null };
            if (decision === 'accept') {
                payload.stipend_amount = stipend === '' ? null : Number(stipend);
            }
            await authAxios.post(`reports/${reportId}/${decision}`, payload);
            await mutate();
            mutateCache((key) => Array.isArray(key) && key[0] === 'reports');
            toast.success(intl.formatMessage({ id: decision === 'accept' ? 'reportAccepted' : 'reportRejected' }));
        } catch (decideError) {
            toast.error(apiErrorMessage(decideError, intl));
        } finally {
            setPending('');
        }
    };

    const download = async () => {
        setPending('download');
        try {
            const response = await authAxios.get(`reports/${reportId}/export`, { responseType: 'blob' });
            const blob = response.data;
            if (blob?.type?.includes('application/json')) {
                toast.error(intl.formatMessage({ id: 'エラーが発生しました' }));
                return;
            }
            const disposition = response.headers['content-disposition'] || '';
            const matched = disposition.match(/filename="([^"]+)"/);
            const filename = matched?.[1] || `report-${report.year}-${report.month}.xlsx`;
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            URL.revokeObjectURL(url);
        } catch (downloadError) {
            toast.error(apiErrorMessage(downloadError, intl));
        } finally {
            setPending('');
        }
    };

    return (
        <>
            <Seo
                title={intl.formatMessage({ id: 'reportReview' })}
                description={intl.formatMessage({ id: 'reportReview' })}
                keywords={intl.formatMessage({ id: '成果報告' })}
            />
            <MenuTabs />
            <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col gap-5">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 p-5 sm:p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px]">
                    <div className="flex flex-col gap-3 min-w-0">
                        <Link
                            href={{
                                pathname: '/dashboard/student-reports',
                                query: { year: report?.year || router.query.year, month: report?.month || router.query.month },
                            }}
                            className="w-fit text-xs font-semibold text-kanri-primary"
                        >
                            {intl.formatMessage({ id: 'reportBack' })}
                        </Link>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl font-bold text-[#122B31] dark:text-white">
                                {report?.student_name || intl.formatMessage({ id: 'reportReview' })}
                            </h1>
                            {report?.student_code && (
                                <p className="text-sm text-kanri-third dark:text-gray-400">{report.student_code}</p>
                            )}
                        </div>
                        {report && (
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                <StatusBadge status={report.status} />
                                <span className="text-sm font-medium text-[#122B31] dark:text-white">{monthTitle}</span>
                                <span className="text-sm text-kanri-third dark:text-gray-400">
                                    {intl.formatMessage({ id: 'reportTotal' })} {formatHours(report.total_minutes)}
                                </span>
                            </div>
                        )}
                    </div>
                    {isAdmin && report && (
                        <button
                            type="button"
                            onClick={download}
                            disabled={pending === 'download'}
                            className="shrink-0 py-2.5 px-4 bg-[#122B31] hover:bg-[#1B2A32] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm"
                        >
                            {intl.formatMessage({ id: 'reportDownload' })}
                        </button>
                    )}
                </div>

                {isLoading && (
                    <p className="text-sm text-kanri-third dark:text-gray-400">{intl.formatMessage({ id: '読み込み中...' })}</p>
                )}
                {error && (
                    <p className="text-sm text-red-600">{intl.formatMessage({ id: 'エラーが発生しました' })}</p>
                )}
                {!isAdmin && report && (
                    <p className="text-sm text-kanri-third dark:text-gray-400">{intl.formatMessage({ id: 'reportReadOnly' })}</p>
                )}
                {report?.review_note && (
                    <div className="rounded-[24px] border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4 text-sm text-[#122B31] dark:text-white">
                        <p className="font-semibold">{intl.formatMessage({ id: 'reportNote' })}</p>
                        <p className="mt-2 leading-6">{report.review_note}</p>
                        {report.stipend_amount != null && (
                            <p className="mt-3 text-kanri-third dark:text-gray-400">
                                {intl.formatMessage({ id: 'reportStipend' })}: {report.stipend_amount}
                            </p>
                        )}
                    </div>
                )}

                {report && (
                    <div className="bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[720px] w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/40 text-left text-kanri-third dark:text-gray-400">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">{intl.formatMessage({ id: 'reportDay' })}</th>
                                        <th className="px-4 py-3 font-medium">{intl.formatMessage({ id: 'reportStart' })}</th>
                                        <th className="px-4 py-3 font-medium">{intl.formatMessage({ id: 'reportFinish' })}</th>
                                        <th className="px-4 py-3 font-medium">{intl.formatMessage({ id: 'reportHours' })}</th>
                                        <th className="px-5 py-3 font-medium">{intl.formatMessage({ id: 'reportMemo' })}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {report.days.map((day) => {
                                        const [dayYear, dayMonth, dayDate] = day.work_date.split('-').map(Number);
                                        const date = new Date(dayYear, dayMonth - 1, dayDate);
                                        const quiet = day.is_day_off ? 'text-kanri-third dark:text-gray-400' : 'text-[#122B31] dark:text-white';
                                        return (
                                            <tr key={day.work_date} className="border-t border-[#E4E9EE] dark:border-gray-700/60">
                                                <td className={`px-5 py-3.5 align-top whitespace-nowrap font-medium ${quiet}`}>
                                                    {date.toLocaleDateString(locale, { month: 'numeric', day: 'numeric', weekday: 'short' })}
                                                    {day.is_day_off ? ` · ${intl.formatMessage({ id: 'reportDayOff' })}` : ''}
                                                </td>
                                                <td className={`px-4 py-3.5 align-top tabular-nums ${quiet}`}>{day.start_time || '—'}</td>
                                                <td className={`px-4 py-3.5 align-top tabular-nums ${quiet}`}>{day.finish_time || '—'}</td>
                                                <td className={`px-4 py-3.5 align-top font-medium tabular-nums ${quiet}`}>
                                                    {day.is_day_off ? '—' : formatHours(day.duration_minutes)}
                                                </td>
                                                <td className={`px-5 py-3.5 align-top leading-6 ${quiet}`}>
                                                    {day.description || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                                <tfoot>
                                    <tr className="border-t border-[#E4E9EE] dark:border-gray-700/60 bg-gray-50 dark:bg-gray-900/40">
                                        <td className="px-5 py-3.5 font-bold text-[#122B31] dark:text-white" colSpan={3}>
                                            {intl.formatMessage({ id: 'reportTotal' })}
                                        </td>
                                        <td className="px-4 py-3.5 font-bold tabular-nums text-[#122B31] dark:text-white">
                                            {formatHours(report.total_minutes)}
                                        </td>
                                        <td className="px-5 py-3.5" />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {report && (
                    <div className="p-5 sm:p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-[#122B31] dark:text-white">
                            {intl.formatMessage({ id: 'reportWeekNotes' })}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[1, 2, 3, 4, 5].map((week) => (
                                <div key={week} className="rounded-xl bg-gray-50 dark:bg-gray-900/40 px-4 py-3">
                                    <p className="text-xs font-medium text-kanri-third dark:text-gray-400">
                                        {intl.formatMessage({ id: 'reportWeek' }, { week })}
                                    </p>
                                    <p className="mt-2 text-sm leading-6 text-[#122B31] dark:text-white whitespace-pre-wrap">
                                        {report[`week_${week}`] || '—'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {canReview && (
                    <div className="p-5 sm:p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-[#122B31] dark:text-white">
                            {intl.formatMessage({ id: 'reportReview' })}
                        </h2>
                        <label className="flex flex-col gap-1.5 text-xs font-medium text-kanri-third dark:text-gray-400 max-w-xs">
                            {intl.formatMessage({ id: 'reportStipend' })}
                            <input
                                type="number"
                                min="0"
                                value={stipend}
                                onChange={(event) => setStipend(event.target.value)}
                                className="rounded-xl border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-[#122B31] dark:text-white"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5 text-xs font-medium text-kanri-third dark:text-gray-400">
                            {intl.formatMessage({ id: 'reportNote' })}
                            <textarea
                                rows={3}
                                value={note}
                                placeholder={intl.formatMessage({ id: 'reportNotePlaceholder' })}
                                onChange={(event) => setNote(event.target.value)}
                                className="rounded-xl border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm leading-6 text-[#122B31] dark:text-white"
                            />
                        </label>
                        <div className="flex justify-end gap-2 pt-1">
                            <button
                                type="button"
                                onClick={() => decide('reject')}
                                disabled={Boolean(pending)}
                                className="py-2.5 px-4 border border-[#E4E9EE] dark:border-gray-600 text-[#122B31] dark:text-white font-bold rounded-xl text-xs sm:text-sm disabled:opacity-60"
                            >
                                {intl.formatMessage({ id: 'reportReject' })}
                            </button>
                            <button
                                type="button"
                                onClick={() => decide('accept')}
                                disabled={Boolean(pending)}
                                className="py-2.5 px-4 bg-[#122B31] hover:bg-[#1B2A32] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm"
                            >
                                {intl.formatMessage({ id: 'reportAccept' })}
                            </button>
                        </div>
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
