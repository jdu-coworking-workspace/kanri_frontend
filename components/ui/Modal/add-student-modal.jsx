import React, { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { BaseInput, BaseSelect, DateInput, ConfirmModal } from "..";
import { useIntl } from "react-intl";

export default function AddStudentModal({ isOpen, onClose, onSubmit, editingStudent = null, onDelete = null }) {
    const intl = useIntl();
    const [error, setError] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        furigana: "",
        studentId: "",
        email: "",
        semester: "1-semestr",
        skillRank: "C",
        workStatus: "active",
        gradYearMonth: "",
        isGroupLeader: "no",
        photo: null,
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        setError("");
        if (editingStudent) {
            setFormData({
                name: editingStudent.full_name || "",
                furigana: editingStudent.kana_name || "",
                studentId: editingStudent.student_code || "",
                email: editingStudent.email || "",
                semester: editingStudent.semester || "1-semestr",
                skillRank: editingStudent.skill_rank || "C",
                workStatus: editingStudent.work_status || "active",
                gradYearMonth: editingStudent.grad_year_month ? editingStudent.grad_year_month.replace(/-/g, '/') : "",
                isGroupLeader: "no",
                photo: null,
            });
        } else {
            setFormData({
                name: "",
                furigana: "",
                studentId: "",
                email: "",
                semester: "1-semestr",
                skillRank: "C",
                workStatus: "active",
                gradYearMonth: "",
                isGroupLeader: "no",
                photo: null,
            });
        }
    }, [editingStudent, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.name.trim() || !formData.studentId || !formData.studentId.trim()) {
            setError(intl.formatMessage({ id: 'allFieldsRequired' }));
            return;
        }

        if (formData.email && formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            setError(intl.formatMessage({ id: 'invalidEmail' }));
            return;
        }

        setError("");
        onSubmit?.(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, photo: file }));
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
            <div className="flex min-h-full items-center justify-center py-5">
                <div className="w-full max-w-[740px] bg-white dark:bg-gray-900 rounded-[24px] p-6 sm:p-8 shadow-2xl transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#122B31] dark:text-white">
                            {editingStudent ? intl.formatMessage({ id: '学生を編集' }) : intl.formatMessage({ id: '学生の追加' })}
                        </h2>
                        <button
                            onClick={onClose}
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {error && (
                            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-xl border border-red-100 dark:border-red-900">
                                {error}
                            </div>
                        )}

                        {/* Full Name & Furigana */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <BaseInput
                                variant="modal"
                                label={intl.formatMessage({ id: '氏名' })}
                                placeholder={intl.formatMessage({ id: '山田 太郎' })}
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    if (error) setError("");
                                }}
                            />
                            <BaseInput
                                variant="modal"
                                label={intl.formatMessage({ id: 'フリガナ' })}
                                placeholder={intl.formatMessage({ id: 'ヤマダ タロウ' })}
                                value={formData.furigana}
                                onChange={(e) => setFormData({ ...formData, furigana: e.target.value })}
                            />
                        </div>

                        {/* Student ID & Email Address */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <BaseInput
                                variant="modal"
                                label={intl.formatMessage({ id: '学生番号' })}
                                placeholder={intl.formatMessage({ id: '例 : 20260001' })}
                                value={formData.studentId}
                                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                            />
                            <BaseInput
                                variant="modal"
                                label={intl.formatMessage({ id: 'emailAddress' })}
                                placeholder="225158@jdu.uz"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>

                        {/* Semester & Skill Rank */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <BaseSelect
                                variant="modal"
                                label={intl.formatMessage({ id: 'semester' })}
                                value={formData.semester}
                                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                                options={[
                                    { value: "1-semestr", label: intl.formatMessage({ id: 'semester1' }) },
                                    { value: "2-semestr", label: intl.formatMessage({ id: 'semester2' }) },
                                    { value: "3-semestr", label: intl.formatMessage({ id: 'semester3' }) },
                                    { value: "4-semestr", label: intl.formatMessage({ id: 'semester4' }) },
                                    { value: "5-semestr", label: intl.formatMessage({ id: 'semester5' }) },
                                    { value: "6-semestr", label: intl.formatMessage({ id: 'semester6' }) },
                                    { value: "7-semestr", label: intl.formatMessage({ id: 'semester7' }) },
                                    { value: "8-semestr", label: intl.formatMessage({ id: 'semester8' }) },
                                    { value: "9-semestr", label: intl.formatMessage({ id: 'semester9' }) },
                                ]}
                            />
                            <BaseSelect
                                variant="modal"
                                label={intl.formatMessage({ id: 'skillRank' })}
                                value={formData.skillRank}
                                onChange={(e) => setFormData({ ...formData, skillRank: e.target.value })}
                                options={[
                                    { value: "S", label: intl.formatMessage({ id: 'rankS' }) },
                                    { value: "A", label: intl.formatMessage({ id: 'rankA' }) },
                                    { value: "B", label: intl.formatMessage({ id: 'rankB' }) },
                                    { value: "C", label: intl.formatMessage({ id: 'rankC' }) },
                                    { value: "D", label: intl.formatMessage({ id: 'rankD' }) },
                                    { value: "E", label: intl.formatMessage({ id: 'rankE' }) },
                                ]}
                            />
                        </div>

                        {/* Work Status & Graduation Date */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <BaseSelect
                                variant="modal"
                                label={intl.formatMessage({ id: 'workStatus' })}
                                value={formData.workStatus}
                                onChange={(e) => setFormData({ ...formData, workStatus: e.target.value })}
                                options={[
                                    { value: "active", label: intl.formatMessage({ id: 'activeStatus' }) },
                                    { value: "intern", label: intl.formatMessage({ id: 'internStatus' }) },
                                    { value: "on_leave", label: intl.formatMessage({ id: 'onLeaveStatus' }) },
                                ]}
                            />
                            <DateInput
                                variant="modal"
                                label={intl.formatMessage({ id: 'gradDate' })}
                                placeholder="YYYY/MM/DD"
                                value={formData.gradYearMonth}
                                onChange={(e) => setFormData({ ...formData, gradYearMonth: e.target.value })}
                            />
                        </div>

                        {/* Face Photo Upload */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#122B31] dark:text-gray-200">
                                {intl.formatMessage({ id: '顔写真' })}
                            </label>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full bg-[#F5F8FA] dark:bg-gray-800 border border-[#E4E9EE] dark:border-gray-700 rounded-xl px-3.5 py-2.5 text-sm flex items-center justify-between cursor-pointer hover:bg-[#EEF3F7] transition-colors"
                            >
                                <span className="text-[#8897AD] truncate">
                                    {formData.photo ? formData.photo.name : intl.formatMessage({ id: '画像を選択' })}
                                </span>
                                <Upload className="w-4 h-4 text-[#8897AD]" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-3 mt-4 pt-2">
                            {editingStudent && (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex-1"
                                >
                                    {intl.formatMessage({ id: '削除' })}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-3 px-4 bg-[#EFEFEF] hover:bg-gray-200 text-[#122B31] font-bold rounded-xl text-sm transition-colors flex-1"
                            >
                                {intl.formatMessage({ id: 'キャンセル' })}
                            </button>
                            <button
                                type="submit"
                                className="py-3 px-4 bg-[#122B31] hover:bg-[#1B2A32] text-white font-bold rounded-xl text-sm transition-colors shadow-sm flex-1"
                            >
                                {editingStudent ? intl.formatMessage({ id: '保存する' }) : intl.formatMessage({ id: '追加する' })}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ConfirmModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={() => {
                    setShowDeleteConfirm(false);
                    onDelete?.(editingStudent?.id);
                }}
                title={intl.formatMessage({ id: 'confirmDeleteStudentTitle' })}
                message={intl.formatMessage({ id: 'confirmDeleteStudent' })}
                confirmText={intl.formatMessage({ id: '削除' })}
                cancelText={intl.formatMessage({ id: 'キャンセル' })}
                variant="danger"
            />
        </div>
    );
}