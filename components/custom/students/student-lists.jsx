import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import fetcher from '@/utils/fetcher';
import { StudentCard } from '@/components/ui';
import { useIntl } from 'react-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 10;

export default function StudentLists({ onOpenEdit }) {
    const router = useRouter();
    const intl = useIntl();
    const searchQuery = router.query.q || router.query.sq || '';
    const currentPage = Math.max(1, parseInt(String(router.query.page || '1'), 10) || 1);
    const skillRank = router.query.skill_rank || '';
    const workStatus = router.query.work_status || '';
    const semester = router.query.semester || '';

    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', String(PAGE_SIZE));
    if (searchQuery) {
        params.set('q', String(searchQuery));
    }
    if (skillRank) {
        params.set('skill_rank', String(skillRank));
    }
    if (workStatus) {
        params.set('work_status', String(workStatus));
    }
    if (semester) {
        params.set('semester', String(semester));
    }

    const url = `students?${params.toString()}`;
    const { data, error, isLoading } = useSWR(url, (u) => fetcher(u, {}, {}, true));

    const goToPage = (page) => {
        if (page < 1) return;
        const query = { ...router.query, page: String(page) };
        if (!searchQuery) {
            delete query.q;
            delete query.sq;
        }
        router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
    };

    if (isLoading) {
        return (
            <div className="col-span-full p-4 text-center text-gray-500">
                {intl.formatMessage({ id: '読み込み中...' })}
            </div>
        );
    }

    if (error) {
        return (
            <div className="col-span-full p-4 text-center text-red-500">
                {intl.formatMessage({ id: 'エラーが発生しました' })}
            </div>
        );
    }

    const students = data?.data || [];
    const meta = data?.meta || {};
    const total = meta.total ?? students.length;
    const totalPages = meta.total_pages ?? 1;
    const page = meta.page ?? currentPage;

    return (
        <>
            {students.length > 0 ? (
                students.map((student) => (
                    <StudentCard
                        key={student.id}
                        avatar={student.avatar_url || '/images/avatar-1.png'}
                        name={student.full_name}
                        status={student.skill_rank || 'A'}
                        workStatus={student.work_status}
                        gradDate={student.grad_year_month}
                        katakana={student.kana_name}
                        studentId={student.student_code}
                        onClick={() => onOpenEdit?.(student)}
                    />
                ))
            ) : (
                <div className="w-full text-center py-8 text-gray-500 col-span-full">
                    {intl.formatMessage({ id: '学生が見つかりませんでした' })}
                </div>
            )}

            {(students.length > 0 || total > 0) && (
                <div className="col-span-full flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 mt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {intl.formatMessage(
                            { id: 'paginationTotalStudents' },
                            { total, page, totalPages }
                        )}
                    </p>

                    {totalPages > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => goToPage(page - 1)}
                                disabled={page <= 1}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                {intl.formatMessage({ id: 'paginationPrev' })}
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => goToPage(p)}
                                        className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-bold transition-colors ${
                                            p === page
                                                ? 'bg-kanri-primary text-white'
                                                : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => goToPage(page + 1)}
                                disabled={page >= totalPages}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                {intl.formatMessage({ id: 'paginationNext' })}
                                <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
