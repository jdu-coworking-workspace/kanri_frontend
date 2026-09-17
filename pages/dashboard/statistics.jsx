import React, { useState } from 'react';
import useSWR from 'swr';
import { MenuTabs } from '@/components/custom';
import Seo from '@/components/Seo/Seo';
import { authAxios } from '@/utils/axios';
import { useIntl } from 'react-intl';
import Link from 'next/link';
import { 
    Users, 
    FolderKanban, 
    Briefcase, 
    Award, 
    TrendingUp, 
    RefreshCw, 
    CheckCircle2, 
    Clock, 
    PlayCircle, 
    XCircle,
    Star,
    Layers,
    UserX,
    Filter,
    PieChart,
    BarChart3,
    Calendar,
    ArrowUpRight,
    UserCheck,
    AlertCircle
} from 'lucide-react';

const fetcher = (url) => authAxios.get(url).then((res) => res.data);

export default function MasterStatisticsPage() {
    const intl = useIntl();
    
    // Module 6: Filter States
    const [period, setPeriod] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Build SWR API URL with filters
    const apiUrl = `statistics/summary?period=${period}&status_filter=${statusFilter}&category_filter=${categoryFilter}`;

    const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 30000,
    });

    const kpi = data?.kpi;
    const projectStatuses = data?.project_statuses || [];
    const skillRanks = data?.skill_ranks || [];
    const semesters = data?.semesters || [];
    const workStatuses = data?.work_statuses || [];
    const categories = data?.categories || [];
    const topStudents = data?.top_students || [];
    const unassignedStudentsList = data?.unassigned_students_list || [];
    const staffWorkloads = data?.staff_workloads || [];
    const monthlyTrends = data?.monthly_trends || [];

    // Helper for Skill Rank Badge Colors
    const getSkillBadgeColor = (rank) => {
        switch (rank) {
            case 'S': return 'bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-400/20 dark:text-amber-300';
            case 'A': return 'bg-purple-500/10 text-purple-600 border-purple-500/30 dark:bg-purple-400/20 dark:text-purple-300';
            case 'B': return 'bg-blue-500/10 text-blue-600 border-blue-500/30 dark:bg-blue-400/20 dark:text-blue-300';
            case 'C': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:bg-emerald-400/20 dark:text-emerald-300';
            case 'D': return 'bg-orange-500/10 text-orange-600 border-orange-500/30 dark:bg-orange-400/20 dark:text-orange-300';
            default: return 'bg-gray-500/10 text-gray-600 border-gray-500/30 dark:bg-gray-400/20 dark:text-gray-300';
        }
    };

    // Helper for Status Icon & Color
    const getStatusStyle = (status) => {
        switch (status) {
            case 'active':
                return { icon: PlayCircle, color: 'text-emerald-500 bg-emerald-500/10', bar: 'bg-emerald-500' };
            case 'done':
                return { icon: CheckCircle2, color: 'text-blue-500 bg-blue-500/10', bar: 'bg-blue-500' };
            case 'planned':
                return { icon: Clock, color: 'text-amber-500 bg-amber-500/10', bar: 'bg-amber-500' };
            case 'cancelled':
                return { icon: XCircle, color: 'text-rose-500 bg-rose-500/10', bar: 'bg-rose-500' };
            default:
                return { icon: Layers, color: 'text-gray-500 bg-gray-500/10', bar: 'bg-gray-500' };
        }
    };

    // Dynamic i18n label helpers
    const formatStatusLabel = (statusKey) => {
        switch (statusKey) {
            case 'active': return intl.formatMessage({ id: '稼働中' });
            case 'done': return intl.formatMessage({ id: '完了' });
            case 'planned': return intl.formatMessage({ id: '計画中' });
            case 'cancelled': return intl.formatMessage({ id: 'statsCancelled' });
            default: return statusKey;
        }
    };

    const formatCategoryLabel = (catKey) => {
        switch (catKey) {
            case 'it': return intl.formatMessage({ id: 'IT・開発' });
            case 'video': return intl.formatMessage({ id: '動画制作' });
            case 'light_work': return intl.formatMessage({ id: '軽作業' });
            case 'trial': return intl.formatMessage({ id: '体験学習' });
            default: return catKey;
        }
    };

    const formatWorkStatusLabel = (wsKey) => {
        switch (wsKey) {
            case 'active': return intl.formatMessage({ id: 'activeStatus' });
            case 'intern': return intl.formatMessage({ id: 'internStatus' });
            case 'on_leave': return intl.formatMessage({ id: 'onLeaveStatus' });
            default: return wsKey;
        }
    };

    const formatSemesterLabel = (semKey) => {
        if (!semKey) return '-';
        const numMatch = semKey.match(/\d+/);
        if (numMatch && numMatch[0]) {
            const semId = `semester${numMatch[0]}`;
            try {
                return intl.formatMessage({ id: semId });
            } catch (e) {
                return semKey;
            }
        }
        return semKey;
    };

    const maxSkillCount = Math.max(...skillRanks.map(s => s.count), 1);
    const maxSemesterCount = Math.max(...semesters.map(s => s.count), 1);
    const maxTrendStudents = Math.max(...monthlyTrends.map(t => t.new_students), 1);
    const maxStaffProjects = Math.max(...staffWorkloads.map(s => s.projects_count), 1);

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Seo title={`${intl.formatMessage({ id: '統計' })} — Kanri Management`} />

            {/* Navigation Bar */}
            <MenuTabs />

            <main className="container py-6 sm:py-8 space-y-8">
                {/* Header Title Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60">
                    <div>
                        <div className="flex items-center gap-2 text-kanri-primary dark:text-blue-400 font-semibold text-sm mb-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{intl.formatMessage({ id: 'statsAnalyticsHeaderTitle' })}</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                            {intl.formatMessage({ id: 'statsHeaderMainTitle' })}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {intl.formatMessage({ id: 'statsHeaderSubTitle' })}
                        </p>
                    </div>

                    <button
                        onClick={() => mutate()}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-kanri-primary/10 text-kanri-primary hover:bg-kanri-primary hover:text-white dark:bg-blue-500/20 dark:text-blue-300 dark:hover:bg-blue-600 dark:hover:text-white transition-all duration-200 font-medium text-sm self-start lg:self-auto"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>{intl.formatMessage({ id: 'statsRefreshBtn' })}</span>
                    </button>
                </div>

                {/* Module 6: Interactive Filters Bar */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                        <Filter className="w-4 h-4 text-kanri-primary dark:text-blue-400" />
                        <span>Filtrlar Control:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {/* Period Filter */}
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                            >
                                <option value="all" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsFilterAllTime' })}</option>
                                <option value="month" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsFilterThisMonth' })}</option>
                                <option value="year" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsFilterThisYear' })}</option>
                            </select>
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600">
                            <FolderKanban className="w-4 h-4 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                            >
                                <option value="all" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsAllStatuses' })}</option>
                                <option value="active" className="dark:bg-gray-800">{intl.formatMessage({ id: '稼働中' })}</option>
                                <option value="done" className="dark:bg-gray-800">{intl.formatMessage({ id: '完了' })}</option>
                                <option value="planned" className="dark:bg-gray-800">{intl.formatMessage({ id: '計画中' })}</option>
                                <option value="cancelled" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsCancelled' })}</option>
                            </select>
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700/50 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-600">
                            <Layers className="w-4 h-4 text-gray-400" />
                            <select
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                                className="bg-transparent text-xs font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                            >
                                <option value="all" className="dark:bg-gray-800">{intl.formatMessage({ id: 'statsAllCategories' })}</option>
                                <option value="it" className="dark:bg-gray-800">{intl.formatMessage({ id: 'IT・開発' })}</option>
                                <option value="video" className="dark:bg-gray-800">{intl.formatMessage({ id: '動画制作' })}</option>
                                <option value="light_work" className="dark:bg-gray-800">{intl.formatMessage({ id: '軽作業' })}</option>
                                <option value="trial" className="dark:bg-gray-800">{intl.formatMessage({ id: '体験学習' })}</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && !data && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-28 bg-white dark:bg-gray-800 rounded-2xl animate-pulse p-4 border border-gray-100 dark:border-gray-700" />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-center">
                        <p className="font-semibold">{intl.formatMessage({ id: 'エラーが発生しました' })}</p>
                    </div>
                )}

                {data && (
                    <>
                        {/* Module 1: Expanded Summary KPI Cards (6 Cards Grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

                            {/* Card 1: Total Students */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsTotalStudentsCard' })}
                                    </span>
                                    <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                        {kpi?.total_students}
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                        {kpi?.graduated_students_count > 0 ? `${kpi.graduated_students_count} bitiruvchi` : intl.formatMessage({ id: 'statsTotalStudentsSub' })}
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Total Projects */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsActiveProjectsCard' })}
                                    </span>
                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        <FolderKanban className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                        {kpi?.active_projects} <span className="text-xs font-normal text-gray-400">/ {kpi?.total_projects}</span>
                                    </div>
                                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                                        {kpi?.done_projects} {intl.formatMessage({ id: 'statsActiveProjectsSub' })}
                                    </div>
                                </div>
                            </div>

                            {/* Card 3: Completion Rate */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsCompletionRateCard' })}
                                    </span>
                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                                        {kpi?.completion_rate_percent}%
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1.5 overflow-hidden">
                                        <div style={{ width: `${kpi?.completion_rate_percent}%` }} className="h-full bg-indigo-500 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Working Rate */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsWorkingRateCard' })}
                                    </span>
                                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                        <Briefcase className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">
                                        {kpi?.working_rate_percent}%
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                        {kpi?.working_students} {intl.formatMessage({ id: 'statsWorkingRateSub' })}
                                    </div>
                                </div>
                            </div>

                            {/* Card 5: Unassigned Students (Highlight Warning) */}
                            <div className={`rounded-2xl p-5 border shadow-sm relative overflow-hidden group ${
                                kpi?.unassigned_students_count > 0 
                                    ? 'bg-rose-500/5 border-rose-500/20 dark:bg-rose-500/10 dark:border-rose-500/30' 
                                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60'
                            }`}>
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
                                        {intl.formatMessage({ id: 'statsUnassignedStudentsCard' })}
                                    </span>
                                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                                        <UserX className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                                        {kpi?.unassigned_students_count} <span className="text-xs font-normal text-gray-400">bo'sh</span>
                                    </div>
                                    <div className="text-[11px] text-rose-500/80 font-medium mt-0.5">
                                        {kpi?.unassigned_students_count > 0 ? "Loyihaga biriktirish kerak" : "Barcha talabalar band"}
                                    </div>
                                </div>
                            </div>

                            {/* Card 6: Avg Students per Project */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/60 shadow-sm relative overflow-hidden group">
                                <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                                        {intl.formatMessage({ id: 'statsAvgStudentsPerProjectCard' })}
                                    </span>
                                    <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                        <Award className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                                        {kpi?.avg_students_per_project} <span className="text-xs font-normal text-gray-400">t/p</span>
                                    </div>
                                    <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                                        Rank: <span className="font-bold">{kpi?.top_skill_rank}</span>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Module 5: Progress & Trends (Student Growth & Project Trends) */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-kanri-primary dark:text-blue-400" />
                                    <span>{intl.formatMessage({ id: 'statsMonthlyGrowthTitle' })}</span>
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {intl.formatMessage({ id: 'statsMonthlyGrowthSub' })}
                                </p>
                            </div>

                            {/* Monthly Bar / Line Comparison */}
                            <div className="h-56 flex items-end justify-between gap-3 pt-8 pb-3 px-3 border-b border-gray-100 dark:border-gray-700">
                                {monthlyTrends.map((t) => {
                                    const studentHeight = Math.max(Math.round((t.new_students / maxTrendStudents) * 100), 8);
                                    return (
                                        <div key={t.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                                            <div className="flex items-baseline gap-1 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-blue-600">{t.new_students}t</span>
                                                <span className="text-emerald-600">/{t.created_projects}p</span>
                                            </div>
                                            <div className="w-full flex items-end justify-center gap-1.5 h-full">
                                                {/* Students Bar */}
                                                <div
                                                    style={{ height: `${studentHeight}%` }}
                                                    className="w-1/2 bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all duration-300"
                                                    title={`${intl.formatMessage({ id: 'statsNewStudentsLabel' })}: ${t.new_students}`}
                                                />
                                                {/* Projects Bar */}
                                                <div
                                                    style={{ height: `${Math.max(t.created_projects * 20, 10)}%` }}
                                                    className="w-1/2 bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-300"
                                                    title={`${intl.formatMessage({ id: 'statsCreatedProjectsLabel' })}: ${t.created_projects}`}
                                                />
                                            </div>
                                            <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">
                                                {t.month_label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 pt-1">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                                    <span>{intl.formatMessage({ id: 'statsNewStudentsLabel' })}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded-sm" />
                                    <span>{intl.formatMessage({ id: 'statsCreatedProjectsLabel' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Module 4: Staff Workload & Performance */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-5">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Users className="w-5 h-5 text-indigo-500" />
                                    <span>{intl.formatMessage({ id: 'statsStaffWorkloadTitle' })}</span>
                                </h2>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {intl.formatMessage({ id: 'statsStaffWorkloadSub' })}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {staffWorkloads.map((st) => {
                                    const percent = Math.round((st.projects_count / maxStaffProjects) * 100);
                                    return (
                                        <div key={st.staff_id} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30 border border-gray-100 dark:border-gray-700 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm border border-indigo-500/20">
                                                    {st.staff_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900 dark:text-white">
                                                        {st.staff_name}
                                                    </div>
                                                    <div className="text-xs text-gray-400 truncate max-w-[160px]">
                                                        {st.staff_email}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1 pt-1">
                                                <div className="flex justify-between text-xs font-semibold">
                                                    <span className="text-gray-500 dark:text-gray-400">Loyihalar:</span>
                                                    <span className="text-gray-900 dark:text-white">{st.projects_count} ta ({st.active_projects_count} faol)</span>
                                                </div>
                                                <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                                    <div style={{ width: `${percent}%` }} className="h-full bg-indigo-500 rounded-full" />
                                                </div>
                                            </div>

                                            <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                                👥 {st.managed_students_count} {intl.formatMessage({ id: 'statsManagedStudents' })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Module 2 & 3: Student & Project Statistics Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Chart 1: Project Status Breakdown */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-5">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FolderKanban className="w-5 h-5 text-kanri-primary dark:text-blue-400" />
                                        <span>{intl.formatMessage({ id: 'statsProjectStatusChartTitle' })}</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {intl.formatMessage({ id: 'statsProjectStatusChartSub' })}
                                    </p>
                                </div>

                                <div className="h-4 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden flex">
                                    {projectStatuses.map((ps) => {
                                        const style = getStatusStyle(ps.status);
                                        return (
                                            <div
                                                key={ps.status}
                                                style={{ width: `${ps.percentage}%` }}
                                                className={`h-full ${style.bar} transition-all duration-500`}
                                                title={`${formatStatusLabel(ps.status)}: ${ps.count} (${ps.percentage}%)`}
                                            />
                                        );
                                    })}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                    {projectStatuses.map((ps) => {
                                        const style = getStatusStyle(ps.status);
                                        const IconComp = style.icon;
                                        return (
                                            <div key={ps.status} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-700">
                                                <div className="flex items-center gap-2.5">
                                                    <div className={`p-2 rounded-lg ${style.color}`}>
                                                        <IconComp className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                                        {formatStatusLabel(ps.status)}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-base font-bold text-gray-900 dark:text-white">
                                                        {ps.count}
                                                    </span>
                                                    <span className="text-xs text-gray-400 block">
                                                        {ps.percentage}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Chart 2: Skill Ranks Breakdown */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-5">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Award className="w-5 h-5 text-amber-500" />
                                        <span>{intl.formatMessage({ id: 'statsSkillRankChartTitle' })}</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {intl.formatMessage({ id: 'statsSkillRankChartSub' })}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {skillRanks.map((item) => {
                                        const percent = Math.round((item.count / maxSkillCount) * 100);
                                        return (
                                            <div key={item.rank} className="space-y-1">
                                                <div className="flex justify-between items-center text-sm font-medium">
                                                    <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getSkillBadgeColor(item.rank)}`}>
                                                        Rank {item.rank}
                                                    </span>
                                                    <span className="text-gray-900 dark:text-white font-bold">
                                                        {item.count} <span className="text-xs font-normal text-gray-400">{intl.formatMessage({ id: 'statsTaTalaba' })}</span>
                                                    </span>
                                                </div>
                                                <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                                    <div
                                                        style={{ width: `${percent}%` }}
                                                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Unassigned Students Spotlight Section ⚠️ */}
                        {unassignedStudentsList.length > 0 && (
                            <div className="bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl p-6 border border-rose-500/20 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" />
                                            <span>{intl.formatMessage({ id: 'statsUnassignedSpotlightTitle' })}</span>
                                        </h2>
                                        <p className="text-xs text-rose-500/80 mt-0.5">
                                            {intl.formatMessage({ id: 'statsUnassignedSpotlightSub' })}
                                        </p>
                                    </div>
                                    <Link
                                        href="/dashboard/students"
                                        className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors inline-flex items-center gap-1.5"
                                    >
                                        <span>Talabalar Bo'limiga O'tish</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {unassignedStudentsList.map((st) => (
                                        <div key={st.id} className="p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 flex items-center justify-between shadow-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-rose-500/10 text-rose-600 font-bold flex items-center justify-center text-sm">
                                                    {st.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-gray-900 dark:text-white">
                                                        {st.full_name}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {st.student_code}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getSkillBadgeColor(st.skill_rank)}`}>
                                                {st.skill_rank || 'N/A'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top Active Students Leaderboard */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/60 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                                        <span>{intl.formatMessage({ id: 'statsLeaderboardTitle' })}</span>
                                    </h2>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                        {intl.formatMessage({ id: 'statsLeaderboardSub' })}
                                    </p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-100 dark:border-gray-700 text-xs text-gray-400 uppercase">
                                            <th className="py-3 px-4">#</th>
                                            <th className="py-3 px-4">{intl.formatMessage({ id: 'statsTableColStudent' })}</th>
                                            <th className="py-3 px-4">{intl.formatMessage({ id: 'statsTableColCode' })}</th>
                                            <th className="py-3 px-4">Skill Rank</th>
                                            <th className="py-3 px-4">{intl.formatMessage({ id: 'statsTableColSemester' })}</th>
                                            <th className="py-3 px-4 text-center">{intl.formatMessage({ id: 'statsTableColActiveProjects' })}</th>
                                            <th className="py-3 px-4 text-right">{intl.formatMessage({ id: 'statsTableColPoints' })}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700/60">
                                        {topStudents.map((student, idx) => (
                                            <tr key={student.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                                                <td className="py-3.5 px-4 font-bold text-gray-500">
                                                    {idx === 0 && <span className="text-lg">🥇</span>}
                                                    {idx === 1 && <span className="text-lg">🥈</span>}
                                                    {idx === 2 && <span className="text-lg">🥉</span>}
                                                    {idx > 2 && <span>#{idx + 1}</span>}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-kanri-primary/10 text-kanri-primary font-bold flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-700">
                                                            {student.avatar_url ? (
                                                                <img src={student.avatar_url} alt={student.full_name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                student.full_name.charAt(0)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 dark:text-white">
                                                                {student.full_name}
                                                            </div>
                                                            <div className="text-xs text-gray-400">
                                                                {student.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 font-mono text-xs text-gray-500 dark:text-gray-400">
                                                    {student.student_code}
                                                </td>
                                                <td className="py-3.5 px-4">
                                                    <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${getSkillBadgeColor(student.skill_rank)}`}>
                                                        Rank {student.skill_rank || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-xs font-medium text-gray-600 dark:text-gray-300">
                                                    {formatSemesterLabel(student.semester)}
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                                        {student.active_projects_count} {intl.formatMessage({ id: 'statsTaLoyiha' })}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-extrabold text-kanri-primary dark:text-blue-400">
                                                    {student.points} pt
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
