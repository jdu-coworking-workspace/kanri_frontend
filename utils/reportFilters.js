// Admin "Student reports" sahifasi filtrlari.
// Filter holati URL query'da saqlanadi: ?year=2026&month=11&status=submitted&q=ali&page=2

export const REPORT_STATUSES = ['draft', 'submitted', 'approved', 'rejected', 'not_created'];
// Draft hisobotlar eksportga kirmaydi (ZIP ga ham, bitta fayl uchun ham: 403 REPORT_DRAFT_HIDDEN).
export const DOWNLOADABLE_STATUSES = ['submitted', 'approved', 'rejected'];
export const REPORT_TYPE_FILTERS = ['hourly', 'output'];
// Backend qiymatlari: submitted_stale (3+ kundan beri ko'rilmagan), rejected (qayta yuborilmagan).
export const ATTENTION_FILTERS = ['submitted_stale', 'rejected'];

// UI'da bitta tanlov, API'ga `sort` + `order` bo'lib ketadi.
const SORT_API = {
    name_asc: ['name', 'asc'],
    name_desc: ['name', 'desc'],
    hours_asc: ['total_hours', 'asc'],
    hours_desc: ['total_hours', 'desc'],
    status: ['status', 'asc'],
    updated_desc: ['updated_at', 'desc'],
    submitted_desc: ['submitted_at', 'desc'],
    completion_asc: ['completion', 'asc'],
    completion_desc: ['completion', 'desc'],
};
export const SORT_OPTIONS = Object.keys(SORT_API);

export const DEFAULT_SORT = 'name_asc';
export const PAGE_SIZE = 20;
export const MAX_SEARCH_LENGTH = 100;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const EMPTY_FILTERS = Object.freeze({
    q: '',
    status: [],
    reportType: '',
    projectId: '',
    attention: '',
    sort: DEFAULT_SORT,
    page: 1,
});

function firstValue(value) {
    return Array.isArray(value) ? value[0] : value;
}

// Bir-biriga zid kombinatsiyalarni tozalaydi (natija doim bo'sh bo'lib qolmasligi uchun):
// - attention (tezkor chip) status filtrini almashtiradi;
// - hourly/output turi "not_created" bilan birga bo'lolmaydi (yaratilmagan hisobotning turi yo'q).
export function sanitizeFilters(filters) {
    let { status, reportType } = filters;
    const { attention } = filters;
    if (attention) status = [];
    if (reportType && status.includes('not_created')) reportType = '';
    return { ...filters, status, reportType };
}

export function readFilters(query = {}) {
    const q = String(firstValue(query.q) ?? '').trim().slice(0, MAX_SEARCH_LENGTH);

    let status = String(firstValue(query.status) ?? '')
        .split(',')
        .map((item) => item.trim())
        .filter((item) => REPORT_STATUSES.includes(item));
    status = status.filter((item, index) => status.indexOf(item) === index);

    let reportType = String(firstValue(query.report_type) ?? '').trim();
    // "none" = hisobot yaratmagan studentlar = not_created filtri bilan bir xil.
    if (reportType === 'none') {
        reportType = '';
        if (!status.includes('not_created')) status = [...status, 'not_created'];
    }
    if (!REPORT_TYPE_FILTERS.includes(reportType)) reportType = '';

    const rawProject = String(firstValue(query.project_id) ?? '').trim();
    const projectId = UUID_PATTERN.test(rawProject) ? rawProject : '';

    const rawAttention = String(firstValue(query.attention) ?? '').trim();
    const attention = ATTENTION_FILTERS.includes(rawAttention) ? rawAttention : '';

    const rawSort = String(firstValue(query.sort) ?? '').trim();
    const sort = SORT_OPTIONS.includes(rawSort) ? rawSort : DEFAULT_SORT;

    const page = Math.max(1, parseInt(String(firstValue(query.page) ?? '1'), 10) || 1);

    return sanitizeFilters({ q, status, reportType, projectId, attention, sort, page });
}

// URL uchun: faqat standart qiymatdan farq qiladigan maydonlar yoziladi.
export function filtersToQuery(filters, period) {
    const query = { year: String(period.year), month: String(period.month) };
    if (filters.q) query.q = filters.q;
    if (filters.status.length) query.status = filters.status.join(',');
    if (filters.reportType) query.report_type = filters.reportType;
    if (filters.projectId) query.project_id = filters.projectId;
    if (filters.attention) query.attention = filters.attention;
    if (filters.sort && filters.sort !== DEFAULT_SORT) query.sort = filters.sort;
    if (filters.page > 1) query.page = String(filters.page);
    return query;
}

// API uchun. `status` va `report_type` massiv: fetcher/axios ularni takroriy parametr qilib yuboradi.
// GET /reports va GET /reports/export bir xil filtr parametrlarini qabul qiladi
// (q, status, report_type, project_id, attention, sort, order, year, month).
// Eksport butun to'plamni yuklaydi, shuning uchun unda page/limit yuborilmaydi (`paged: false`).
export function filtersToApiParams(filters, period, { paged = true } = {}) {
    const params = { year: period.year, month: period.month };
    if (filters.q) params.q = filters.q;
    if (filters.status.length) params.status = [...filters.status];
    if (filters.reportType) params.report_type = [filters.reportType];
    if (filters.projectId) params.project_id = filters.projectId;
    if (filters.attention) params.attention = filters.attention;
    const [sort, order] = SORT_API[filters.sort] || SORT_API[DEFAULT_SORT];
    params.sort = sort;
    params.order = order;
    if (paged) {
        params.page = filters.page;
        params.limit = PAGE_SIZE;
    }
    return params;
}

export function hasActiveFilters(filters) {
    return Boolean(
        filters.q
        || filters.status.length
        || filters.reportType
        || filters.projectId
        || filters.attention,
    );
}

export function clearedFilters(filters) {
    return { ...filters, q: '', status: [], reportType: '', projectId: '', attention: '', page: 1 };
}

// Excel eksport tugmasi yonidagi son. Draft va hisobotsiz (not_created) qatorlar yuklanmaydi.
export function downloadableCount(filters, statusCounts) {
    if (!statusCounts) return 0;
    const selected = filters.status.length ? filters.status : DOWNLOADABLE_STATUSES;
    return selected
        .filter((item) => DOWNLOADABLE_STATUSES.includes(item))
        .reduce((sum, item) => sum + (Number(statusCounts[item]) || 0), 0);
}

// Backend `completion` saralashi bilan bir xil formula: filled_days / entry_count
// (entry_count: hourly uchun oy kunlari, output uchun ma'lumot kiritilgan kunlar).
export function completionDenominator(item) {
    return Number(item.entry_count ?? item.day_count) || 0;
}

export function completionPercent(item) {
    const total = completionDenominator(item);
    if (!total) return 0;
    return Math.min(100, Math.round(((Number(item.filled_days) || 0) / total) * 100));
}
