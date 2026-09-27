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

export function mergeDays(year, month, serverDays) {
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
            is_day_off: isDayOff,
        });
    }
    return rows;
}

export function reportPayload(year, month, weeks, days) {
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
        })),
    };
}

export function timeOrderInvalid(start, finish) {
    if (!start || !finish) return false;
    return start > finish;
}

export function isDayComplete(day) {
    if (day.is_day_off) return true;
    return Boolean(
        day.start_time
        && day.finish_time
        && day.description?.trim()
        && durationMinutes(day.start_time, day.finish_time) > 0,
    );
}

export function isReportComplete(days) {
    return days.every(isDayComplete);
}

const CODE_MESSAGE = {
    REPORT_INCOMPLETE: 'reportIncomplete',
    REPORT_LOCKED: 'reportLocked',
    REPORT_FUTURE_MONTH: 'reportFutureMonth',
    REPORT_NOT_SUBMITTED: 'reportNotSubmitted',
    REPORT_ALREADY_EXISTS: 'reportAlreadyAdded',
    REPORT_TIME_ORDER: 'reportTimeOrder',
    REPORT_DRAFT_HIDDEN: 'reportDraftHidden',
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
