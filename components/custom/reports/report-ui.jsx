import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useIntl } from 'react-intl';
import { dateLocale, isCurrentPeriod, statusMessageId } from '@/utils/reports';

const STATUS_CLASS = {
    draft: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
    submitted: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200',
    approved: 'bg-black text-white dark:bg-white dark:text-black',
    rejected: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200',
};

export function StatusBadge({ status }) {
    const intl = useIntl();
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_CLASS[status] || STATUS_CLASS.draft}`}>
            {intl.formatMessage({ id: statusMessageId(status) })}
        </span>
    );
}

export function MonthSwitcher({ year, month, onChange, canGoBack = true, canGoForward }) {
    const intl = useIntl();
    const label = new Intl.DateTimeFormat(dateLocale(intl.locale), {
        year: 'numeric',
        month: 'long',
    }).format(new Date(year, month - 1, 1));
    const forwardDisabled = canGoForward === undefined ? isCurrentPeriod(year, month) : !canGoForward;

    return (
        <div className="inline-flex items-center gap-2">
            <button
                type="button"
                onClick={() => onChange(-1)}
                disabled={!canGoBack}
                aria-label={intl.formatMessage({ id: 'reportPrevMonth' })}
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#E4E9EE] dark:border-gray-700 text-[#122B31] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="min-w-[9rem] text-center text-sm sm:text-base font-bold text-[#122B31] dark:text-white">
                {label}
            </span>
            <button
                type="button"
                onClick={() => onChange(1)}
                disabled={forwardDisabled}
                aria-label={intl.formatMessage({ id: 'reportNextMonth' })}
                className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-[#E4E9EE] dark:border-gray-700 text-[#122B31] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
