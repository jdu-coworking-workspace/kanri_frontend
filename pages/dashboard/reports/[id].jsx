import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import useSWR, { mutate as mutateCache } from 'swr';
import { toast } from 'react-toastify';
import { MenuTabs } from '@/components/custom';
import { StatusBadge } from '@/components/custom/reports/report-ui';
import Seo from '@/components/Seo/Seo';
import { ConfirmModal } from '@/components/ui';
import { authAxios } from '@/utils/axios';
import fetcher from '@/utils/fetcher';
import {
    apiErrorMessage,
    dateLocale,
    durationMinutes,
    formatHours,
    isDayComplete,
    isReportComplete,
    mergeDays,
    parseClockInput,
    reportPayload,
    timeOrderInvalid,
} from '@/utils/reports';
import TimeField from '@/components/custom/reports/time-field';

const EMPTY_WEEKS = { week_1: '', week_2: '', week_3: '', week_4: '', week_5: '' };

export default function StudentReportEditorPage() {
    const intl = useIntl();
    const router = useRouter();
    const reportId = router.isReady ? router.query.id : null;
    const { data, error, isLoading, mutate } = useSWR(
        reportId ? `reports/me/${reportId}` : null,
        (url) => fetcher(url),
    );
    const report = data?.data;
    const [days, setDays] = useState([]);
    const [weeks, setWeeks] = useState(EMPTY_WEEKS);
    const [saving, setSaving] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [dayOffDate, setDayOffDate] = useState(null);
    const [showMissing, setShowMissing] = useState(false);
    const editable = Boolean(report?.editable);
    const locale = dateLocale(intl.locale);
    const snapshot = report
        ? [
            report.id,
            report.updated_at,
            report.status,
            ...(report.days || []).map((day) => [
                day.work_date,
                day.start_time || '',
                day.finish_time || '',
                day.description || '',
                day.is_day_off ? '1' : '0',
            ].join('|')),
        ].join(';')
        : '';

    useEffect(() => {
        if (!report) return;
        setDays(mergeDays(report.year, report.month, report.days));
        setWeeks({
            week_1: report.week_1 || '',
            week_2: report.week_2 || '',
            week_3: report.week_3 || '',
            week_4: report.week_4 || '',
            week_5: report.week_5 || '',
        });
    }, [snapshot]);

    const totalMinutes = days.reduce(
        (sum, day) => sum + (day.is_day_off ? 0 : durationMinutes(day.start_time, day.finish_time)),
        0,
    );
    const hydrated = Boolean(report && days.length === report.day_count);
    const monthTitle = report
        ? new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(new Date(report.year, report.month - 1, 1))
        : intl.formatMessage({ id: 'reportTitle' });

    const updateDay = (workDate, patch) => {
        setDays((current) => current.map((day) => (day.work_date === workDate ? { ...day, ...patch } : day)));
    };

    const readField = (workDate, field) => {
        const element = document.querySelector(`[data-report-date="${workDate}"][data-report-field="${field}"]`);
        return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement ? element.value : null;
    };

    const readClock = (workDate, field, fallback) => {
        const raw = readField(workDate, field);
        return parseClockInput(raw == null ? (fallback || '') : raw);
    };

    const daysForSave = () => {
        let invalidTime = false;
        const next = days.map((day) => {
            if (day.is_day_off) {
                return {
                    ...day,
                    start_time: '',
                    finish_time: '',
                    description: '',
                    is_day_off: true,
                };
            }
            const start = readClock(day.work_date, 'start_time', day.start_time);
            const finish = readClock(day.work_date, 'finish_time', day.finish_time);
            if (!start.ok || !finish.ok) invalidTime = true;
            return {
                ...day,
                start_time: start.ok ? start.value : '',
                finish_time: finish.ok ? finish.value : '',
                description: readField(day.work_date, 'description') ?? day.description,
                is_day_off: false,
            };
        });
        return invalidTime ? null : next;
    };

    const askDayOff = (workDate) => {
        const day = days.find((item) => item.work_date === workDate);
        if (!day || !editable) return;
        if (day.is_day_off) {
            updateDay(workDate, { is_day_off: false });
            return;
        }
        setDayOffDate(workDate);
    };

    const confirmDayOff = () => {
        if (!dayOffDate) return;
        updateDay(dayOffDate, {
            is_day_off: true,
            start_time: '',
            finish_time: '',
            description: '',
        });
        setDayOffDate(null);
    };

    const rejectTimeOrder = (currentDays) => {
        if (!currentDays.some((day) => !day.is_day_off && timeOrderInvalid(day.start_time, day.finish_time))) return false;
        toast.error(intl.formatMessage({ id: 'reportTimeOrder' }));
        return true;
    };

    const save = async () => {
        const currentDays = daysForSave();
        if (!currentDays) {
            toast.error(intl.formatMessage({ id: 'reportTimeInvalid' }));
            return;
        }
        setDays(currentDays);
        if (rejectTimeOrder(currentDays)) return;
        setSaving(true);
        try {
            await authAxios.put(`reports/me/${reportId}`, reportPayload(report.year, report.month, weeks, currentDays));
            await mutate();
            mutateCache('reports/me');
            toast.success(intl.formatMessage({ id: 'reportSaved' }));
        } catch (saveError) {
            toast.error(apiErrorMessage(saveError, intl));
        } finally {
            setSaving(false);
        }
    };

    const submit = async () => {
        const currentDays = daysForSave();
        if (!currentDays) {
            toast.error(intl.formatMessage({ id: 'reportTimeInvalid' }));
            return;
        }
        setDays(currentDays);
        if (rejectTimeOrder(currentDays)) return;
        if (!isReportComplete(currentDays)) {
            setShowMissing(true);
            toast.error(intl.formatMessage({ id: 'reportIncomplete' }));
            return;
        }
        setShowMissing(false);
        setSubmitting(true);
        try {
            await authAxios.put(`reports/me/${reportId}`, reportPayload(report.year, report.month, weeks, currentDays));
            await authAxios.post(`reports/me/${reportId}/submit`);
            await mutate();
            mutateCache('reports/me');
            toast.success(intl.formatMessage({ id: 'reportSubmitted' }));
        } catch (submitError) {
            toast.error(apiErrorMessage(submitError, intl));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Seo title={monthTitle} description={monthTitle} keywords={intl.formatMessage({ id: '成果報告' })} />
            <MenuTabs />
            <div className="container mx-auto px-4 py-6 max-w-6xl flex flex-col gap-5">
                <div className="flex flex-col gap-3 p-5 sm:p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px]">
                    <Link href="/dashboard/reports" className="w-fit text-xs font-semibold text-kanri-primary">
                        {intl.formatMessage({ id: 'reportBack' })}
                    </Link>
                    <h1 className="text-2xl font-bold text-[#122B31] dark:text-white">{monthTitle}</h1>
                    {report && (
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                            <StatusBadge status={report.status} />
                            <span className="text-sm text-kanri-third dark:text-gray-400">
                                {intl.formatMessage({ id: 'reportTotal' })} {formatHours(hydrated ? totalMinutes : report.total_minutes)}
                            </span>
                        </div>
                    )}
                </div>

                {(isLoading || (report && !hydrated)) && (
                    <p className="text-sm text-kanri-third dark:text-gray-400">{intl.formatMessage({ id: '読み込み中...' })}</p>
                )}
                {error && (
                    <p className="text-sm text-red-600">{intl.formatMessage({ id: 'エラーが発生しました' })}</p>
                )}

                {report?.status === 'rejected' && (
                    <div className="rounded-[24px] border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-100">
                        <p className="font-semibold">{intl.formatMessage({ id: 'reportRejectedBanner' })}</p>
                        {report.review_note && <p className="mt-2 leading-6">{report.review_note}</p>}
                    </div>
                )}
                {report?.status === 'submitted' && (
                    <div className="rounded-[24px] border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-gray-800 px-5 py-4 text-sm leading-6 text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: 'reportWaitingReview' })}
                    </div>
                )}
                {report?.status === 'approved' && (
                    <div className="rounded-[24px] border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-[url('/images/project-dark-bg.png')] dark:bg-cover dark:bg-center px-5 py-4 text-sm text-[#122B31] dark:text-white">
                        <p className="font-semibold">{intl.formatMessage({ id: 'reportAcceptedLocked' })}</p>
                        {report.review_note && (
                            <p className="mt-2 leading-6">
                                <span className="font-semibold">{intl.formatMessage({ id: 'reportComment' })}: </span>
                                {report.review_note}
                            </p>
                        )}
                    </div>
                )}

                {hydrated && (
                    <div className="bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-[760px] w-full text-sm">
                                <thead className="bg-gray-50 dark:bg-gray-900/40 text-left text-kanri-third dark:text-gray-400">
                                    <tr>
                                        <th className="px-5 py-3 font-medium">{intl.formatMessage({ id: 'reportDay' })}</th>
                                        <th className="px-4 py-3 font-medium">{intl.formatMessage({ id: 'reportStart' })}</th>
                                        <th className="px-4 py-3 font-medium">{intl.formatMessage({ id: 'reportFinish' })}</th>
                                        <th className="px-4 py-3 font-medium">{intl.formatMessage({ id: 'reportHours' })}</th>
                                        <th className="px-5 py-3 font-medium">{intl.formatMessage({ id: 'reportMemo' })}</th>
                                        <th className="px-5 py-3 font-medium">{intl.formatMessage({ id: 'reportDayOff' })}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {days.map((day) => {
                                        const [dayYear, dayMonth, dayDate] = day.work_date.split('-').map(Number);
                                        const date = new Date(dayYear, dayMonth - 1, dayDate);
                                        const minutes = day.is_day_off ? 0 : durationMinutes(day.start_time, day.finish_time);
                                        const invalidOrder = !day.is_day_off && timeOrderInvalid(day.start_time, day.finish_time);
                                        const missing = showMissing && !isDayComplete(day);
                                        const quiet = day.is_day_off ? 'text-kanri-third dark:text-gray-400' : 'text-[#122B31] dark:text-white';
                                        return (
                                            <tr
                                                key={day.work_date}
                                                className={`border-t border-[#E4E9EE] dark:border-gray-700/60 ${missing ? 'bg-red-50 dark:bg-red-950/30' : ''}`}
                                            >
                                                <td className={`px-5 py-3.5 align-top whitespace-nowrap font-medium ${quiet}`}>
                                                    {date.toLocaleDateString(locale, { month: 'numeric', day: 'numeric', weekday: 'short' })}
                                                    {missing && (
                                                        <span className="mt-1.5 block max-w-[9rem] text-[11px] font-medium leading-4 text-red-600">
                                                            {intl.formatMessage({ id: 'reportDayRequired' })}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3.5 align-top">
                                                    <TimeField
                                                        value={day.start_time}
                                                        disabled={!editable || day.is_day_off}
                                                        reportDate={day.work_date}
                                                        reportField="start_time"
                                                        onChange={(next) => updateDay(day.work_date, { start_time: next })}
                                                    />
                                                </td>
                                                <td className="px-4 py-3.5 align-top">
                                                    <TimeField
                                                        value={day.finish_time}
                                                        disabled={!editable || day.is_day_off}
                                                        reportDate={day.work_date}
                                                        reportField="finish_time"
                                                        onChange={(next) => updateDay(day.work_date, { finish_time: next })}
                                                    />
                                                    {invalidOrder && (
                                                        <span className="mt-1.5 block text-[11px] leading-4 text-red-600">
                                                            {intl.formatMessage({ id: 'reportTimeOrder' })}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className={`px-4 py-3.5 align-top whitespace-nowrap font-medium tabular-nums ${quiet}`}>
                                                    {day.is_day_off ? '—' : formatHours(minutes)}
                                                </td>
                                                <td className="px-5 py-3.5 align-top">
                                                    <textarea
                                                        rows={2}
                                                        data-report-date={day.work_date}
                                                        data-report-field="description"
                                                        value={day.description}
                                                        disabled={!editable || day.is_day_off}
                                                        placeholder={intl.formatMessage({ id: 'reportMemoPlaceholder' })}
                                                        onChange={(event) => updateDay(day.work_date, { description: event.target.value })}
                                                        className="w-full min-w-[18rem] resize-y rounded-xl border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm leading-6 text-[#122B31] dark:text-white placeholder:text-[#8897AD] disabled:opacity-60"
                                                    />
                                                </td>
                                                <td className="px-5 py-3.5 align-top">
                                                    <button
                                                        type="button"
                                                        disabled={!editable}
                                                        onClick={() => askDayOff(day.work_date)}
                                                        aria-pressed={day.is_day_off}
                                                        className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
                                                            day.is_day_off
                                                                ? 'bg-[#122B31] text-white dark:bg-white dark:text-[#122B31]'
                                                                : 'border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-900 text-[#122B31] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {intl.formatMessage({ id: 'reportDayOff' })}
                                                    </button>
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
                                            {formatHours(hydrated ? totalMinutes : report.total_minutes)}
                                        </td>
                                        <td className="px-5 py-3.5" colSpan={2} />
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}

                {hydrated && (
                    <div className="p-5 sm:p-6 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-[#122B31] dark:text-white">
                            {intl.formatMessage({ id: 'reportWeekNotes' })}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[1, 2, 3, 4, 5].map((week) => (
                                <label key={week} className="flex flex-col gap-1.5 rounded-xl bg-gray-50 dark:bg-gray-900/40 px-4 py-3 text-xs font-medium text-kanri-third dark:text-gray-400">
                                    {intl.formatMessage({ id: 'reportWeek' }, { week })}
                                    <textarea
                                        rows={2}
                                        value={weeks[`week_${week}`]}
                                        disabled={!editable}
                                        onChange={(event) => setWeeks((current) => ({ ...current, [`week_${week}`]: event.target.value }))}
                                        className="rounded-xl border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm leading-6 text-[#122B31] dark:text-white disabled:opacity-60"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                <ConfirmModal
                    isOpen={Boolean(dayOffDate)}
                    onClose={() => setDayOffDate(null)}
                    onConfirm={confirmDayOff}
                    title={intl.formatMessage({ id: 'reportDayOffConfirmTitle' })}
                    message={intl.formatMessage({ id: 'reportDayOffConfirm' })}
                    confirmText={intl.formatMessage({ id: 'reportDayOffConfirmAction' })}
                    cancelText={intl.formatMessage({ id: 'キャンセル' })}
                    variant="danger"
                />

                {hydrated && editable && (
                    <div className="sticky bottom-4 flex justify-end gap-2 p-4 bg-white/95 dark:bg-gray-800/95 border border-[#E4E9EE] dark:border-gray-700/60 rounded-[24px] shadow-soft-sm">
                        <button
                            type="button"
                            onClick={save}
                            disabled={saving || submitting}
                            className="py-2.5 px-4 border border-[#E4E9EE] dark:border-gray-600 text-[#122B31] dark:text-white font-bold rounded-xl text-xs sm:text-sm disabled:opacity-60"
                        >
                            {intl.formatMessage({ id: 'reportSave' })}
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={saving || submitting}
                            className="py-2.5 px-4 bg-[#122B31] hover:bg-[#1B2A32] disabled:opacity-60 text-white font-bold rounded-xl text-xs sm:text-sm"
                        >
                            {intl.formatMessage({ id: 'reportSubmit' })}
                        </button>
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
