import { authAxios } from '@/utils/axios';

// Backend schemas/work_report.py bilan bir xil limitlar.
export const MAX_MEMO_LENGTH = 2000;
export const MAX_WEEK_NOTE_LENGTH = 4000;
export const MAX_REVIEW_NOTE_LENGTH = 4000;
export const MAX_WORK_MINUTES = 1440;
export const MAX_OUTPUT_COUNT = 100000;

// Eski hisobotlarda saqlanib qolgan yaponcha default label'lar.
const LEGACY_CONDITION_LABELS = {
    1: ['[条件１]', '[条件1]', '条件１', '条件1', '条件 1'],
    2: ['[条件２]', '[条件2]', '条件２', '条件2', '条件 2'],
};

export function conditionLabel(report, index, intl) {
    const raw = index === 1 ? report?.condition_1_label : report?.condition_2_label;
    const fallbackId = index === 1 ? 'reportWorkType1' : 'reportWorkType2';
    const value = String(raw ?? '').trim();
    if (!value) return intl.formatMessage({ id: fallbackId });
    if ((LEGACY_CONDITION_LABELS[index] || []).includes(value)) {
        return intl.formatMessage({ id: fallbackId });
    }
    return value;
}

export function reportTypeLabel(reportType, intl) {
    if (reportType === 'output') return intl.formatMessage({ id: 'reportTypeOutput' });
    if (reportType === 'hourly') return intl.formatMessage({ id: 'reportTypeHourly' });
    return '—';
}

export function formatHours(minutes) {
    const total = Number(minutes) || 0;
    const hours = Math.floor(total / 60);
    const mins = total % 60;
    return `${hours}:${String(mins).padStart(2, '0')}`;
}

export function durationMinutes(start, finish) {
    if (!start || !finish) return 0;
    const [startHour, startMinute] = start.split(':').map(Number);
    const [finishHour, finishMinute] = finish.split(':').map(Number);
    if ([startHour, startMinute, finishHour, finishMinute].some((part) => Number.isNaN(part))) return 0;
    let startTotal = startHour * 60 + startMinute;
    let finishTotal = finishHour * 60 + finishMinute;
    if (finishTotal < startTotal) finishTotal += 24 * 60;
    return finishTotal - startTotal;
}

export function isCurrentPeriod(year, month) {
    const now = new Date();
    return year === now.getFullYear() && month === now.getMonth() + 1;
}

export function readPeriod(query) {
    const now = new Date();
    const fallback = { year: now.getFullYear(), month: now.getMonth() + 1 };
    const year = Number(query?.year);
    const month = Number(query?.month);
    if (!Number.isInteger(year) || year < 2000 || year > 2100) return fallback;
    if (!Number.isInteger(month) || month < 1 || month > 12) return fallback;
    if (year > fallback.year || (year === fallback.year && month > fallback.month)) return fallback;
    return { year, month };
}

export function shiftPeriod(year, month, delta) {
    const date = new Date(year, month - 1 + delta, 1);
    const next = { year: date.getFullYear(), month: date.getMonth() + 1 };
    const now = new Date();
    if (next.year > now.getFullYear() || (next.year === now.getFullYear() && next.month > now.getMonth() + 1)) {
        return { year, month };
    }
    if (next.year < 2000) return { year, month };
    return next;
}

export function parseClockInput(raw) {
    const original = String(raw ?? '').trim();
    if (!original) return { ok: true, value: '' };

    const compact = original.toLowerCase().replace(/\s+/g, '');
    let meridiem = null;
    let body = compact;
    if (body.endsWith('am')) {
        meridiem = 'am';
        body = body.slice(0, -2);
    } else if (body.endsWith('pm')) {
        meridiem = 'pm';
        body = body.slice(0, -2);
    }
    body = body.replace('.', ':');
    if (body.endsWith(':')) body = body.slice(0, -1);

    let hour;
    let minute;
    if (body.includes(':')) {
        const parts = body.split(':');
        if (parts.length !== 2 || !/^\d{1,2}$/.test(parts[0]) || !/^\d{1,2}$/.test(parts[1])) {
            return { ok: false, value: '' };
        }
        hour = Number(parts[0]);
        minute = Number(parts[1]);
    } else if (/^\d{1,2}$/.test(body)) {
        hour = Number(body);
        minute = 0;
    } else if (/^\d{3,4}$/.test(body)) {
        const padded = body.padStart(4, '0');
        hour = Number(padded.slice(0, -2));
        minute = Number(padded.slice(-2));
    } else {
        return { ok: false, value: '' };
    }

    if (meridiem) {
        if (hour < 1 || hour > 12) return { ok: false, value: '' };
        if (meridiem === 'am') hour = hour === 12 ? 0 : hour;
        else hour = hour === 12 ? 12 : hour + 12;
    }

    if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return { ok: false, value: '' };
    return {
        ok: true,
        value: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    };
}

export function clockDraftInvalid(raw) {
    const text = String(raw ?? '').trim();
    if (!text) return false;
    const compact = text.toLowerCase().replace(/\s+/g, '');
    if (/[ap]m$/.test(compact)) return !parseClockInput(text).ok;
    if (/[ap]$/.test(compact)) return false;

    const body = compact.replace('.', ':').replace(/[ap]$/, '');
    if (!/^\d{0,2}:?\d{0,2}$/.test(body)) return true;
    const [hour = '', minute = ''] = body.split(':');
    if (hour.length === 2 && Number(hour) > 23) return true;
    if (minute.length === 2 && Number(minute) > 59) return true;
    return false;
}

export function clockMeridiem(raw) {
    const text = String(raw ?? '').trim();
    const parsed = parseClockInput(text);
    if (!parsed.ok || !parsed.value) return '';
    const compact = text.toLowerCase().replace(/\s+/g, '');
    const body = compact.replace(/[ap]m$/, '').replace('.', ':');
    const hourPart = body.split(':')[0];
    const explicit = /[ap]m$/.test(compact);
    if (!explicit && !body.includes(':') && hourPart.length < 2) return '';
    return Number(parsed.value.slice(0, 2)) < 12 ? 'AM' : 'PM';
}

export function clockValue(value) {
    if (!value) return '';
    const match = String(value).match(/^(\d{2}:\d{2})/);
    return match ? match[1] : '';
}

export function mergeDays(year, month, serverDays, reportType = 'hourly') {
    const last = new Date(year, month, 0).getDate();
    const byDate = {};
    (serverDays || []).forEach((day) => {
        byDate[day.work_date] = day;
    });
    const rows = [];
    for (let day = 1; day <= last; day += 1) {
        const workDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const source = byDate[workDate] || {};
        const isDayOff = Boolean(source.is_day_off);
        rows.push({
            work_date: workDate,
            start_time: isDayOff ? '' : clockValue(source.start_time),
            finish_time: isDayOff ? '' : clockValue(source.finish_time),
            description: isDayOff ? '' : (source.description || ''),
            work_minutes: isDayOff ? '' : (source.work_minutes ?? ''),
            count_1: isDayOff ? '' : (source.count_1 ?? ''),
            count_2: isDayOff ? '' : (source.count_2 ?? ''),
            report_type: reportType,
            is_day_off: isDayOff,
        });
    }
    return rows;
}

export function reportPayload(year, month, weeks, days) {
    const numeric = (value) => {
        const parsed = parseNumericInput(value);
        return parsed.ok ? parsed.value : null;
    };
    return {
        year,
        month,
        week_1: weeks.week_1 || null,
        week_2: weeks.week_2 || null,
        week_3: weeks.week_3 || null,
        week_4: weeks.week_4 || null,
        week_5: weeks.week_5 || null,
        days: days.map((day) => ({
            work_date: day.work_date,
            is_day_off: Boolean(day.is_day_off),
            start_time: day.is_day_off ? null : (day.start_time || null),
            finish_time: day.is_day_off ? null : (day.finish_time || null),
            description: day.is_day_off ? null : (day.description?.trim() ? day.description.trim() : null),
            work_minutes: day.is_day_off ? null : numeric(day.work_minutes),
            count_1: day.is_day_off ? null : numeric(day.count_1),
            count_2: day.is_day_off ? null : numeric(day.count_2),
        })),
    };
}

export function timeOrderInvalid(start, finish) {
    if (!start || !finish) return false;
    return start > finish;
}

export function parseNumericInput(raw) {
    const text = String(raw ?? '').trim();
    if (!text) return { ok: true, value: null };
    if (!/^\d+$/.test(text)) return { ok: false, value: null };
    return { ok: true, value: Number(text) };
}

// 成果制: faqat biror maydoni kiritilgan kun "kiritilgan" hisoblanadi.
export function outputRowEntered(day) {
    if (!day || day.is_day_off) return false;
    return Boolean(
        Number(day.work_minutes) > 0
        || Number(day.count_1) > 0
        || Number(day.count_2) > 0
        || String(day.description ?? '').trim(),
    );
}

// 成果制: kiritilgan kun uchun ish vaqti (daqiqa) majburiy.
export function outputRowComplete(day) {
    if (!day || day.is_day_off) return true;
    return Number(day.work_minutes) > 0;
}

export function isDayComplete(day, reportType = 'hourly') {
    if (day.is_day_off) return true;
    if (reportType === 'output') return outputRowComplete(day);
    return Boolean(
        day.start_time
        && day.finish_time
        && day.description?.trim()
        && durationMinutes(day.start_time, day.finish_time) > 0,
    );
}

export function hasOutputData(day) {
    return outputRowEntered(day);
}

export function isReportComplete(days, reportType = 'hourly') {
    if (reportType === 'output') {
        // 成果制: ishbay — oyning barcha kunlari shart emas, faqat
        // ma'lumot kiritilgan kunlar to'liq bo'lishi kerak.
        const filled = days.filter((day) => outputRowEntered(day));
        return filled.length > 0 && filled.every((day) => outputRowComplete(day));
    }
    return days.every((day) => isDayComplete(day, reportType));
}

export function hasAnyOutputEntry(days) {
    return days.some((day) => outputRowEntered(day));
}

// Reportda umuman biror ma'lumot kiritilganmi (kunlar yoki haftalik izohlar).
export function hasAnyReportData(days, weeks, reportType = 'hourly') {
    if (Object.values(weeks || {}).some((value) => String(value ?? '').trim())) return true;
    if (reportType === 'output') return hasAnyOutputEntry(days);
    return days.some((day) => day.is_day_off || Boolean(
        day.start_time
        || day.finish_time
        || String(day.description ?? '').trim(),
    ));
}

function normalizeNumber(value) {
    if (value === '' || value == null) return '';
    const parsed = Number(value);
    return Number.isFinite(parsed) ? String(parsed) : '';
}

// Saqlangan holat bilan solishtirish uchun barqaror imzo.
export function reportStateSignature(days, weeks) {
    const dayPart = (days || []).map((day) => [
        day.work_date,
        day.is_day_off ? '1' : '0',
        day.start_time || '',
        day.finish_time || '',
        String(day.description ?? '').trim(),
        normalizeNumber(day.work_minutes),
        normalizeNumber(day.count_1),
        normalizeNumber(day.count_2),
    ].join('|')).join(';');
    const weekPart = [1, 2, 3, 4, 5]
        .map((index) => String(weeks?.[`week_${index}`] ?? '').trim())
        .join('|');
    return `${dayPart}::${weekPart}`;
}

// Qatorni qizil ko'rsatish qoidasi: faqat kiritilgan, lekin to'liq bo'lmagan kun.
export function isDayMissing(day, reportType = 'hourly') {
    if (day.is_day_off) return false;
    if (reportType === 'output') return outputRowEntered(day) && !outputRowComplete(day);
    return !isDayComplete(day, reportType);
}

export function validateReportDays(days, reportType = 'hourly') {
    const errors = [];
    days.forEach((day) => {
        if (day.is_day_off) return;
        if (String(day.description ?? '').length > MAX_MEMO_LENGTH) {
            errors.push({ work_date: day.work_date, field: 'description', code: 'reportMemoTooLong' });
        }
        if (reportType !== 'output') return;

        const minutes = parseNumericInput(day.work_minutes);
        if (!minutes.ok || (minutes.value != null && minutes.value > MAX_WORK_MINUTES)) {
            errors.push({ work_date: day.work_date, field: 'work_minutes', code: 'reportWorkMinutesRange' });
        }
        [['count_1', 'reportCountRange'], ['count_2', 'reportCountRange']].forEach(([field, code]) => {
            const parsed = parseNumericInput(day[field]);
            if (!parsed.ok || (parsed.value != null && parsed.value > MAX_OUTPUT_COUNT)) {
                errors.push({ work_date: day.work_date, field, code });
            }
        });
    });
    return errors;
}

export function validateWeekNotes(weeks) {
    return Object.values(weeks || {}).some((value) => String(value ?? '').length > MAX_WEEK_NOTE_LENGTH);
}

const CODE_MESSAGE = {
    REPORT_INCOMPLETE: 'reportIncomplete',
    REPORT_LOCKED: 'reportLocked',
    REPORT_FUTURE_MONTH: 'reportFutureMonth',
    REPORT_NOT_SUBMITTED: 'reportNotSubmitted',
    REPORT_ALREADY_EXISTS: 'reportAlreadyAdded',
    REPORT_LIMIT_REACHED: 'reportLimitReached',
    REPORT_TITLE_EXISTS: 'reportTitleExists',
    REPORT_TYPE_EXISTS: 'reportTypeExists',
    REPORT_TIME_ORDER: 'reportTimeOrder',
    REPORT_DRAFT_HIDDEN: 'reportDraftHidden',
    REPORT_EXPORT_EMPTY: 'reportNothingToDownload',
    STUDENT_PROFILE_NOT_FOUND: 'reportNoProfile',
};

export function apiErrorMessage(error, intl) {
    const detail = error?.response?.data?.detail ?? error?.data?.detail;
    const code = detail && typeof detail === 'object' ? detail.code : null;
    if (code && CODE_MESSAGE[code]) return intl.formatMessage({ id: CODE_MESSAGE[code] });
    if (typeof detail === 'string') return detail;
    if (detail?.message) return detail.message;
    return intl.formatMessage({ id: 'エラーが発生しました' });
}

export function statusMessageId(status) {
    if (status === 'submitted') return 'reportStatusSubmitted';
    if (status === 'approved') return 'reportStatusApproved';
    if (status === 'rejected') return 'reportStatusRejected';
    if (status === 'draft') return 'reportStatusDraft';
    return 'reportNotStarted';
}

export function dateLocale(locale) {
    if (locale === 'jp') return 'ja';
    return locale || 'ja';
}

export async function downloadMonthlyReport(reportId, fallbackName = 'report.xlsx') {
    return saveBlobResponse(
        () => authAxios.get(`reports/${reportId}/export`, { responseType: 'blob' }),
        fallbackName,
    );
}

// `filters`: filtersToApiParams(..., { paged: false }) natijasi. Berilsa faqat filtrga mos hisobotlar yuklanadi.
export async function downloadPeriodReports(year, month, filters = {}) {
    const name = `reports_${year}-${String(month).padStart(2, '0')}.zip`;
    return saveBlobResponse(
        () => authAxios.get('reports/export', {
            responseType: 'blob',
            params: { ...filters, year, month },
            // status=a&status=b (axios standarti status[]=a bo'lardi, FastAPI uni o'qimaydi)
            paramsSerializer: { indexes: null },
        }),
        name,
    );
}

async function saveBlobResponse(request, fallbackName) {
    const response = await request();
    const blob = response.data;
    if (blob?.type?.includes('application/json')) {
        const text = await blob.text();
        let data = {};
        try {
            data = JSON.parse(text);
        } catch {
            data = {};
        }
        const error = new Error('API request failed');
        error.data = data;
        throw error;
    }
    const disposition = response.headers['content-disposition'] || '';
    const matched = disposition.match(/filename="([^"]+)"/);
    const filename = matched?.[1] || fallbackName;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    return filename;
}

export function monthName(year, month, locale, withYear = false) {
    return new Intl.DateTimeFormat(
        dateLocale(locale),
        withYear ? { month: 'long', year: 'numeric' } : { month: 'long' },
    ).format(new Date(year, month - 1, 1));
}

// Groups reports by month, newest first. Includes every month and every status.
export function groupReportsByPeriod(items) {
    const map = new Map();
    (items || []).forEach((item) => {
        const key = `${item.year}-${item.month}`;
        if (!map.has(key)) map.set(key, { year: item.year, month: item.month, items: [] });
        map.get(key).items.push(item);
    });
    return Array.from(map.values()).sort((a, b) => b.year - a.year || b.month - a.month);
}

// Student's own export. 
export async function downloadMyReport(reportId, fallbackName = 'report.xlsx') {
    return saveBlobResponse(
        () => authAxios.get(`reports/me/${reportId}/export`, { responseType: 'blob' }),
        fallbackName,
    );
}
