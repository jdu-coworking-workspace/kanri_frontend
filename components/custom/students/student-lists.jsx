import React from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import fetcher from '@/utils/fetcher';
import { StudentCard } from '@/components/ui';
import { useIntl } from 'react-intl';

export default function StudentLists({ onOpenEdit }) {
    const router = useRouter();
    const intl = useIntl();
    // Get search query from URL (?q=xxx for students list page or ?sq=xxx for dashboard home page)
    const searchQuery = router.query.q || router.query.sq || '';

    // Pass the query param to SWR
    const url = searchQuery ? `students?q=${encodeURIComponent(searchQuery)}` : 'students';
    const { data, error, isLoading } = useSWR(url, (u) => fetcher(u, {}, {}, true));

    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">{intl.formatMessage({ id: '読み込み中...' })}</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{intl.formatMessage({ id: 'エラーが発生しました' })}</div>;
    }

    const students = data?.data || [];

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
        </>
    );
}
