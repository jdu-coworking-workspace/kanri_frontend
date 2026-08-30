import React, { useState } from "react";
import useSWR from "swr";
import { X, Search, Check, Crown } from "lucide-react";
import fetcher from "@/utils/fetcher";
import { BaseInput } from "..";
import Avatar from "../Avatar/Avatar";
import { useIntl } from "react-intl";

export default function AssignMemberModal({ isOpen, onClose, onSubmit, existingMembers = [] }) {
    const intl = useIntl();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [isLeader, setIsLeader] = useState(false);

    // SWR yordamida barcha talabalarni olish
    const { data, error, isLoading } = useSWR(
        isOpen ? "students" : null,
        (u) => fetcher(u, {}, {}, true)
    );

    if (!isOpen) return null;

    const students = data?.data || [];

    // Allaqachon loyihada bor a'zolarni filtrlab tashlash
    const candidateStudents = students.filter(student => 
        !existingMembers.some(existing => 
            existing.id === student.id || 
            existing.studentCode === student.student_code ||
            existing.name === student.full_name
        )
    );

    // Qidiruv so'roviga qarab filtrlash
    const filteredStudents = candidateStudents.filter(student =>
        student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_code.includes(searchQuery)
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedStudentId) return;
        
        // Tanlangan student obyektini topish
        const selectedStudent = students.find(s => s.id === selectedStudentId);
        if (selectedStudent) {
            onSubmit?.(selectedStudent.id, isLeader);
            // Reset modal state
            setSelectedStudentId(null);
            setIsLeader(false);
            setSearchQuery("");
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
            <div className="flex min-h-full items-center justify-center py-5">
                <div className="w-full max-w-[600px] bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-2xl transition-all flex flex-col h-[600px]">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4 shrink-0">
                        <h2 className="text-xl font-bold text-[#122B31] dark:text-white">
                            {intl.formatMessage({ id: 'メンバーを追加' })}
                        </h2>
                        <button
                            onClick={() => {
                                setSelectedStudentId(null);
                                setIsLeader(false);
                                setSearchQuery("");
                                onClose();
                            }}
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search Field */}
                    <div className="mb-4 shrink-0 relative">
                        <BaseInput
                            variant="modal"
                            placeholder={intl.formatMessage({ id: 'searchStudentByNameOrCode' })}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>

                    {/* Students List Container */}
                    <div className="flex-1 overflow-y-auto mb-4 border border-gray-100 dark:border-gray-800 rounded-2xl p-2 bg-gray-50/50 dark:bg-gray-950/30">
                        {isLoading ? (
                            <div className="text-center py-8 text-sm text-gray-500">{intl.formatMessage({ id: '読み込み中...' })}</div>
                        ) : error ? (
                            <div className="text-center py-8 text-sm text-red-500">{intl.formatMessage({ id: 'エラーが発生しました' })}</div>
                        ) : filteredStudents.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {filteredStudents.map((student) => {
                                    const isSelected = student.id === selectedStudentId;
                                    return (
                                        <div
                                            key={student.id}
                                            onClick={() => setSelectedStudentId(student.id)}
                                            className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer border transition-all ${
                                                isSelected
                                                    ? "bg-[#122B31] text-white border-transparent"
                                                    : "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700/60 hover:bg-gray-50 dark:hover:bg-gray-700/40 text-gray-700 dark:text-gray-200"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={student.avatar_url || '/images/avatar-1.png'}
                                                    alt={student.full_name}
                                                    size="md"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold truncate max-w-[200px]">
                                                        {student.full_name}
                                                    </p>
                                                    <p className={`text-[11px] ${isSelected ? "text-gray-300" : "text-gray-400"}`}>
                                                        {student.student_code}
                                                    </p>
                                                </div>
                                            </div>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-white text-[#122B31] flex items-center justify-center">
                                                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-sm text-gray-400">{intl.formatMessage({ id: 'noStudentsFound' })}</div>
                        )}
                    </div>

                    {/* Leader Checkbox & Action Buttons */}
                    <div className="shrink-0 flex flex-col gap-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-medium text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={isLeader}
                                onChange={(e) => setIsLeader(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-[#122B31] focus:ring-[#122B31] dark:bg-gray-800 dark:border-gray-700"
                            />
                            <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span>{intl.formatMessage({ id: 'addAsLeader' })}</span>
                        </label>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedStudentId(null);
                                    setIsLeader(false);
                                    setSearchQuery("");
                                    onClose();
                                }}
                                className="w-full py-3 px-4 bg-[#EFEFEF] hover:bg-gray-200 text-[#122B31] font-bold rounded-xl text-sm transition-colors"
                            >
                                {intl.formatMessage({ id: 'キャンセル' })}
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!selectedStudentId}
                                className={`w-full py-3 px-4 font-bold rounded-xl text-sm transition-colors shadow-sm ${
                                    selectedStudentId
                                        ? "bg-[#122B31] hover:bg-[#1B2A32] text-white"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                                }`}
                            >
                                {intl.formatMessage({ id: '追加する' })}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
