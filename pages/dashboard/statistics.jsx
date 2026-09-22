import React from 'react';
import useSWR from 'swr';
import { MenuTabs } from '@/components/custom';
import Seo from '@/components/Seo/Seo';
import { authAxios } from '@/utils/axios';
import { useIntl } from 'react-intl';
import {
    Users,
    FolderKanban,
    Award,
    Star,
    UserX,
    CheckCircle,
} from 'lucide-react';

const fetcher = (url) => authAxios.get(url).then((res) => res.data);

export default function MasterStatisticsPage() {
    const intl = useIntl();

    const { data, error, isLoading } = useSWR('statistics/summary', fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 30000,
    });

    const kpi = data?.kpi;
    const skillRanks = data?.skill_ranks || [];
    const topStudents = data?.top_students || [];
    const maxSkillCount = Math.max(...skillRanks.map((s) => s.count), 1);

    const getSkillBadgeColor = (rank) => {
        switch (rank) {
            case 'S':
                return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-400/20 dark:text-amber-300';
            case 'A':
                return 'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-400/20 dark:text-purple-300';
            case 'B':
                return 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-400/20 dark:text-blue-300';
            case 'C':
                return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-400/20 dark:text-emerald-300';
            case 'D':
                return 'bg-orange-500/10 text-orange-600 border-orange-500/30 dark:bg-orange-400/20 dark:text-orange-300';
            default:
                return 'bg-gray-500/10 text-gray-600 border-gray-500/30 dark:bg-gray-400/20 dark:text-gray-300';
        }
    };

    const formatSemesterLabel = (semKey) => {
        if (!semKey) return '-';
        const numMatch = semKey.match(/\d+/);
        if (numMatch?.[0]) {
            try {
                return intl.formatMessage({ id: `semester${numMatch[0]}` });
            } catch {
                return semKey;
            }
        }
        return semKey;
    };

    return (
        <div className="min-h-screen bg-[#f5f5f5] dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Seo title={`${intl.formatMessage({ id: 'statsHeaderMainTitle' })} — Kanri Management`} />
            <MenuTabs />

            <main className="container py-6 sm:py-8 space-y-6">
                {isLoading && !data && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-28 bg-white dark:bg-gray-800 rounded-2xl animate-pulse border border-gray-100 dark:border-gray-700"
                            />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center font-semibold text-sm">
                        {intl.formatMessage({ id: 'statsErrorOccurred' })}
                    </div>
                )}

                {data && (
                    <>
                        {/* KPI cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsTotalStudentsCard' })}
                                    </span>
                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                        {kpi?.total_students}
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                        {intl.formatMessage({ id: 'statsTotalStudentsSub' })}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsActiveProjectsCard' })}
                                    </span>
                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <FolderKanban className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white flex items-baseline gap-1">
                                        {kpi?.active_projects}
                                        <span className="text-xs font-normal text-gray-400">
                                            / {kpi?.total_projects}
                                        </span>
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                                        {intl.formatMessage({ id: 'statsActiveProjectsSub' })}
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`rounded-2xl p-5 border shadow-sm flex flex-col justify-between ${
                                    kpi?.unassigned_students_count > 0
                                        ? 'bg-rose-500/5 border-rose-500/30 dark:bg-rose-500/10 dark:border-rose-500/40'
                                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span
                                        className={`text-[11px] font-bold uppercase tracking-wider ${
                                            kpi?.unassigned_students_count > 0
                                                ? 'text-rose-600 dark:text-rose-400'
                                                : 'text-gray-400'
                                        }`}
                                    >
                                        {intl.formatMessage({ id: 'statsUnassignedStudentsCard' })}
                                    </span>
                                    <div
                                        className={`p-2 rounded-xl ${
                                            kpi?.unassigned_students_count > 0
                                                ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                                                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                        }`}
                                    >
                                        {kpi?.unassigned_students_count > 0 ? (
                                            <UserX className="w-4 h-4" />
                                        ) : (
                                            <CheckCircle className="w-4 h-4" />
                                        )}
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <div
                                        className={`text-2xl font-extrabold ${
                                            kpi?.unassigned_students_count > 0
                                                ? 'text-rose-600 dark:text-rose-400'
                                                : 'text-gray-900 dark:text-white'
                                        }`}
                                    >
                                        {kpi?.unassigned_students_count}
                                    </div>
                                    <div className="text-[11px] font-medium mt-1 text-gray-500 dark:text-gray-400">
                                        {kpi?.unassigned_students_count > 0
                                            ? intl.formatMessage({ id: 'statsUnassignedStudentsSubWarning' })
                                            : intl.formatMessage({ id: 'statsUnassignedStudentsSubOk' })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                            {/* Skill ranks */}
                            <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4 flex flex-col">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Award className="w-4 h-4 text-amber-500 shrink-0" />
                                        <span>{intl.formatMessage({ id: 'statsSkillRankChartTitle' })}</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {intl.formatMessage({ id: 'statsSkillRankChartSub' })}
                                    </p>
                                </div>

                                <div className="space-y-3 pt-1 flex-1">
                                    {skillRanks.map((item) => {
                                        const percent = Math.round((item.count / maxSkillCount) * 100);
                                        return (
                                            <div key={item.rank} className="space-y-1">
                                                <div className="flex justify-between items-center text-xs font-medium">
                                                    <span
                                                        className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getSkillBadgeColor(item.rank)}`}
                                                    >
                                                        Rank {item.rank}
                                                    </span>
                                                    <span className="text-gray-900 dark:text-white font-bold">
                                                        {item.count}{' '}
                                                        <span className="text-[11px] font-normal text-gray-400">
                                                            {intl.formatMessage({ id: 'statsTaTalaba' })}
                                                        </span>
                                                    </span>
                                                </div>
                                                <div className="h-2.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        style={{ width: `${percent}%` }}
                                                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Leaderboard */}
                            <div className="lg:col-span-8 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4 flex flex-col min-w-0">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                                        <span>{intl.formatMessage({ id: 'statsLeaderboardTitle' })}</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {intl.formatMessage({ id: 'statsLeaderboardSub' })}
                                    </p>
                                </div>

                                <div className="overflow-x-auto flex-1">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-gray-100 dark:border-gray-700 text-[11px] text-gray-400 uppercase font-semibold">
                                                <th className="py-3 px-3 sm:px-4">#</th>
                                                <th className="py-3 px-3 sm:px-4">
                                                    {intl.formatMessage({ id: 'statsTableColStudent' })}
                                                </th>
                                                <th className="py-3 px-3 sm:px-4 hidden md:table-cell">
                                                    {intl.formatMessage({ id: 'statsTableColCode' })}
                                                </th>
                                                <th className="py-3 px-3 sm:px-4">
                                                    {intl.formatMessage({ id: 'statsTableColRank' })}
                                                </th>
                                                <th className="py-3 px-3 sm:px-4 hidden xl:table-cell">
                                                    {intl.formatMessage({ id: 'statsTableColSemester' })}
                                                </th>
                                                <th className="py-3 px-3 sm:px-4 text-center">
                                                    {intl.formatMessage({ id: 'statsTableColActiveProjects' })}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                            {topStudents.length === 0 && (
                                                <tr>
                                                <td
                                                    colSpan={6}
                                                    className="py-8 text-center text-gray-400"
                                                >
                                                        {intl.formatMessage({ id: 'statsLeaderboardEmpty' })}
                                                    </td>
                                                </tr>
                                            )}
                                            {topStudents.map((student, idx) => (
                                                <tr
                                                    key={student.id}
                                                    className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                                                >
                                                    <td className="py-3.5 px-3 sm:px-4 font-bold text-gray-500">
                                                        #{idx + 1}
                                                    </td>
                                                    <td className="py-3.5 px-3 sm:px-4">
                                                        <div className="flex items-center gap-2.5 min-w-0">
                                                            <div className="w-8 h-8 rounded-full bg-kanri-primary/10 text-kanri-primary font-bold flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                                                                {student.avatar_url ? (
                                                                    <img
                                                                        src={student.avatar_url}
                                                                        alt={student.full_name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    student.full_name.charAt(0)
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="font-semibold text-xs text-gray-900 dark:text-white truncate">
                                                                    {student.full_name}
                                                                </div>
                                                                <div className="text-[10px] text-gray-400 truncate">
                                                                    {student.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3.5 px-3 sm:px-4 font-mono text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">
                                                        {student.student_code}
                                                    </td>
                                                    <td className="py-3.5 px-3 sm:px-4">
                                                        <span
                                                            className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${getSkillBadgeColor(student.skill_rank)}`}
                                                        >
                                                            Rank {student.skill_rank || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3.5 px-3 sm:px-4 text-xs font-medium text-gray-600 dark:text-gray-300 hidden xl:table-cell">
                                                        {formatSemesterLabel(student.semester)}
                                                    </td>
                                                    <td className="py-3.5 px-3 sm:px-4 text-center">
                                                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                                                            {student.active_projects_count}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
