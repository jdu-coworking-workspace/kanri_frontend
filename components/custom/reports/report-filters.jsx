import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { AlertCircle, Clock, Search, SlidersHorizontal, X } from 'lucide-react';
import { BaseInput, BaseSelect } from '@/components/ui';
import useDebouncedValue from '@/hooks/useDebouncedValue';
import { reportTypeLabel, statusMessageId } from '@/utils/reports';
import {
    REPORT_STATUSES,
    SORT_OPTIONS,
    clearedFilters,
    hasActiveFilters,
} from '@/utils/reportFilters';

const SEARCH_DEBOUNCE_MS = 350;

const SORT_LABEL_IDS = {
    name_asc: 'filterSortNameAsc',
    name_desc: 'filterSortNameDesc',
    hours_asc: 'filterSortHoursAsc',
    hours_desc: 'filterSortHoursDesc',
    status: 'filterSortStatus',
    updated_desc: 'filterSortUpdatedDesc',
    submitted_desc: 'filterSortSubmittedDesc',
    completion_asc: 'filterSortCompletionAsc',
    completion_desc: 'filterSortCompletionDesc',
};

const ATTENTION_ITEMS = [
    { value: 'submitted_stale', labelId: 'filterAttentionStale', Icon: Clock },
    { value: 'rejected', labelId: 'filterAttentionRejected', Icon: AlertCircle },
];

const CHIP_ACTIVE = 'bg-[#122B31] text-white border-[#122B31] dark:bg-white dark:text-[#122B31] dark:border-white';
const CHIP_IDLE =
    'bg-white dark:bg-gray-800 text-[#122B31] dark:text-gray-200 border-[#E4E9EE] dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700';

export function statusFilterLabel(status, intl) {
    if (status === 'not_created') return intl.formatMessage({ id: 'filterStatusNotCreated' });
    return intl.formatMessage({ id: statusMessageId(status) });
}

export default function ReportFilters({
    filters,
    onApply,
    statusCounts,
    attentionCounts,
    projects = [],
}) {
    const intl = useIntl();
    const [search, setSearch] = useState(filters.q);
    const [moreOpen, setMoreOpen] = useState(Boolean(filters.projectId));
    const lastPushedQuery = useRef(filters.q);
    const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS);

    // URL tashqaridan o'zgarganda (back/forward, "tozalash", ulashilgan havola) inputni moslaymiz.
    // O'zimiz yozgan qiymat qaytib kelganda inputga tegmaymiz, aks holda yozayotgan matn o'chib ketadi.
    useEffect(() => {
        if (filters.q !== lastPushedQuery.current) {
            lastPushedQuery.current = filters.q;
            setSearch(filters.q);
        }
    }, [filters.q]);

    useEffect(() => {
        const next = debouncedSearch.trim();
        if (next === lastPushedQuery.current) return;
        lastPushedQuery.current = next;
        onApply({ ...filters, q: next, page: 1 }, { replace: true });
    }, [debouncedSearch]);

    useEffect(() => {
        if (filters.projectId) setMoreOpen(true);
    }, [filters.projectId]);

    const apply = (patch) => onApply({ ...filters, ...patch, page: 1 });

    const toggleStatus = (value) => {
        const has = filters.status.includes(value);
        const status = has
            ? filters.status.filter((item) => item !== value)
            : [...filters.status, value];
        const patch = { status };
        if (!has) {
            patch.attention = '';
            // "Yaratilmagan" hisobotning turi yo'q: tur filtri bilan birga natija doim bo'sh bo'lardi.
            if (value === 'not_created') patch.reportType = '';
        }
        apply(patch);
    };

    const changeType = (value) => {
        if (!value) {
            apply({ reportType: '' });
            return;
        }
        apply({
            reportType: value,
            status: filters.status.filter((item) => item !== 'not_created'),
        });
    };

    const toggleAttention = (value) => {
        if (filters.attention === value) {
            apply({ attention: '' });
            return;
        }
        apply({ attention: value, status: [] });
    };

    const projectName = (id) =>
        projects.find((project) => String(project.id) === id)?.name || id.slice(0, 8);

    const chips = [];
    if (filters.q) {
        chips.push({ key: 'q', group: 'filterSearch', label: filters.q, patch: { q: '' } });
    }
    filters.status.forEach((status) => {
        chips.push({
            key: `status:${status}`,
            group: 'filterStatus',
            label: statusFilterLabel(status, intl),
            patch: { status: filters.status.filter((item) => item !== status) },
        });
    });
    if (filters.reportType) {
        chips.push({
            key: 'type',
            group: 'filterReportType',
            label: reportTypeLabel(filters.reportType, intl),
            patch: { reportType: '' },
        });
    }
    if (filters.projectId) {
        chips.push({
            key: 'project',
            group: 'filterProject',
            label: projectName(filters.projectId),
            patch: { projectId: '' },
        });
    }
    if (filters.attention) {
        const item = ATTENTION_ITEMS.find((entry) => entry.value === filters.attention);
        chips.push({
            key: 'attention',
            group: 'filterAttention',
            label: intl.formatMessage({ id: item.labelId }),
            patch: { attention: '' },
        });
    }

    const typeOptions = [
        { value: '', label: intl.formatMessage({ id: 'filterAllTypes' }) },
        { value: 'hourly', label: reportTypeLabel('hourly', intl) },
        { value: 'output', label: reportTypeLabel('output', intl) },
    ];
    const sortOptions = SORT_OPTIONS.map((value) => ({
        value,
        label: intl.formatMessage({ id: SORT_LABEL_IDS[value] }),
    }));
    const projectOptions = [
        { value: '', label: intl.formatMessage({ id: 'filterAllProjects' }) },
        ...projects.map((project) => ({ value: String(project.id), label: project.name })),
    ];
    const detailCount = filters.projectId ? 1 : 0;

    return (
        <div className="flex flex-col gap-4 p-5 bg-white dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px]">
            {/* Asosiy qator: qidiruv + tur + saralash + "Batafsil" */}
            <div className="grid grid-cols-1 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_auto] gap-3 items-end">
                <BaseInput
                    label={intl.formatMessage({ id: 'filterSearch' })}
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={intl.formatMessage({ id: 'filterSearchPlaceholder' })}
                    leftIcon={<Search className="w-4 h-4" />}
                    maxLength={100}
                />
                <BaseSelect
                    label="filterReportType"
                    value={filters.reportType}
                    onChange={(event) => changeType(event.target.value)}
                    options={typeOptions}
                    placeholder="filterAllTypes"
                />
                <BaseSelect
                    label="filterSort"
                    value={filters.sort}
                    onChange={(event) => apply({ sort: event.target.value })}
                    options={sortOptions}
                    placeholder="filterSort"
                />
                <button
                    type="button"
                    onClick={() => setMoreOpen((open) => !open)}
                    aria-expanded={moreOpen}
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-[#E4E9EE] dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-semibold text-[#122B31] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    {intl.formatMessage({ id: moreOpen ? 'filterLess' : 'filterMore' })}
                    {detailCount > 0 && (
                        <span className="min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-[#122B31] text-white dark:bg-white dark:text-[#122B31] text-[11px] font-bold">
                            {detailCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Status chip'lari (son bilan) */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[#122B31] dark:text-gray-200">
                    {intl.formatMessage({ id: 'filterStatus' })}
                </span>
                <div className="flex flex-wrap gap-2">
                    {REPORT_STATUSES.map((status) => {
                        const active = filters.status.includes(status);
                        const count = statusCounts?.[status];
                        return (
                            <button
                                key={status}
                                type="button"
                                aria-pressed={active}
                                onClick={() => toggleStatus(status)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors ${active ? CHIP_ACTIVE : CHIP_IDLE}`}
                            >
                                {statusFilterLabel(status, intl)}
                                {count != null && <span className="opacity-70">({count})</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Faqat e'tibor talab qiladiganlar */}
            <div className="flex flex-col gap-2">
                <span className="text-sm font-medium text-[#122B31] dark:text-gray-200">
                    {intl.formatMessage({ id: 'filterAttention' })}
                </span>
                <div className="flex flex-wrap gap-2">
                    {ATTENTION_ITEMS.map(({ value, labelId, Icon }) => {
                        const active = filters.attention === value;
                        const count = attentionCounts?.[value];
                        return (
                            <button
                                key={value}
                                type="button"
                                aria-pressed={active}
                                disabled={!active && count === 0}
                                onClick={() => toggleAttention(value)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${active ? CHIP_ACTIVE : CHIP_IDLE}`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                {intl.formatMessage({ id: labelId })}
                                {count != null && <span className="opacity-70">({count})</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* "Batafsil" paneli */}
            {moreOpen && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-[#E4E9EE] dark:border-gray-700/60">
                    <BaseSelect
                        label="filterProject"
                        value={filters.projectId}
                        onChange={(event) => apply({ projectId: event.target.value })}
                        options={projectOptions}
                        placeholder="filterAllProjects"
                    />
                </div>
            )}

            {/* Aktiv filterlar */}
            {chips.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[#E4E9EE] dark:border-gray-700/60">
                    <span className="text-xs text-kanri-third dark:text-gray-400">
                        {intl.formatMessage({ id: 'filterActive' })}
                    </span>
                    {chips.map((chip) => (
                        <span
                            key={chip.key}
                            className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-xs font-medium text-[#122B31] dark:text-gray-100"
                        >
                            {intl.formatMessage(
                                { id: 'filterChip' },
                                { label: intl.formatMessage({ id: chip.group }), value: chip.label },
                            )}
                            <button
                                type="button"
                                onClick={() => apply(chip.patch)}
                                aria-label={intl.formatMessage({ id: 'filterRemove' })}
                                title={intl.formatMessage({ id: 'filterRemove' })}
                                className="w-5 h-5 inline-flex items-center justify-center rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                    {hasActiveFilters(filters) && (
                        <button
                            type="button"
                            onClick={() => onApply(clearedFilters(filters))}
                            className="ml-auto text-xs font-semibold text-[#122B31] dark:text-white underline underline-offset-2 hover:opacity-70"
                        >
                            {intl.formatMessage({ id: 'filterClearAll' })}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
