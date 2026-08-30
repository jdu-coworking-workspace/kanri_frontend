import React, { useState, useRef, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { BaseInput, BaseSelect, DateInput } from "..";
import { useIntl } from "react-intl";

export default function CreateProjectModal({ isOpen, onClose, onSubmit, editingProject = null }) {
    const intl = useIntl();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        startDate: "",
        endDate: "",
        status: "準備中",
        category: "trial", // Default category
        image: null,
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        setError("");
        if (editingProject) {
            const reverseStatusMap = {
                "active": "稼働中",
                "planned": "準備中",
                "done": "完了"
            };

            setFormData({
                title: editingProject.name || "",
                startDate: editingProject.start_date ? editingProject.start_date.replace(/-/g, '/') : "",
                endDate: editingProject.end_date ? editingProject.end_date.replace(/-/g, '/') : "",
                status: reverseStatusMap[editingProject.status] || "準備中",
                category: editingProject.category || "trial",
                image: null,
            });
        } else {
            setFormData({
                title: "",
                startDate: "",
                endDate: "",
                status: "準備中",
                category: "trial",
                image: null,
            });
        }
    }, [editingProject, isOpen]);

    if (!isOpen) return null;

    const validateDateStr = (dateStr) => {
        if (!dateStr || !dateStr.trim()) return true;
        const normalized = dateStr.trim().replace(/\//g, "-");
        const match = normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
        if (!match) return false;
        const y = parseInt(match[1], 10);
        const m = parseInt(match[2], 10) - 1;
        const d = parseInt(match[3], 10);
        if (y < 1900 || y > 2100 || m < 0 || m > 11 || d < 1 || d > 31) return false;
        const dt = new Date(y, m, d);
        return dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.title.trim()) {
            setError(intl.formatMessage({ id: 'projectNameRequired' }));
            return;
        }

        if (!validateDateStr(formData.startDate) || !validateDateStr(formData.endDate)) {
            setError(intl.formatMessage({ id: 'invalidDateFormat' }));
            return;
        }

        setError("");
        onSubmit?.(formData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
        }
    };

    return (
        /* Tashqi qism Scroll bo'lishi uchun inset-0 va overflow-y-auto qo'shildi */
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
            <div className="flex min-h-full items-center justify-center py-5">
                <div className="w-full max-w-[740px] bg-white dark:bg-gray-900 rounded-[24px] p-6 shadow-2xl transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg sm:text-2xl font-bold text-[#122B31] dark:text-white">
                            {editingProject ? intl.formatMessage({ id: 'プロジェクトを編集' }) : intl.formatMessage({ id: 'プロジェクトを作成' })}
                        </h2>
                        <button
                            onClick={onClose}
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

                        {/* Project Name */}
                        <BaseInput
                            variant="modal"
                            label={intl.formatMessage({ id: 'プロジェクトの名前' })}
                            placeholder={intl.formatMessage({ id: 'グループ名を入力してください' })}
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value });
                                if (error) setError("");
                            }}
                            error={error}
                        />

                        {/* Date Picker Range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <DateInput
                                variant="modal"
                                label={intl.formatMessage({ id: '開始日' })}
                                placeholder="YYYY/MM/DD"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                            <DateInput
                                variant="modal"
                                label={intl.formatMessage({ id: '終了日' })}
                                placeholder="YYYY/MM/DD"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>

                        {/* Status Select & Category Select (2 col grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <BaseSelect
                                variant="modal"
                                label={intl.formatMessage({ id: 'ステータス' })}
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                options={[
                                    { value: "稼働中", label: intl.formatMessage({ id: '稼働中' }) },
                                    { value: "準備中", label: intl.formatMessage({ id: '計画中' }) },
                                    { value: "完了", label: intl.formatMessage({ id: '完了' }) },
                                ]}
                            />
                            <BaseSelect
                                variant="modal"
                                label={intl.formatMessage({ id: 'カテゴリ' })}
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                options={[
                                    { value: "trial", label: intl.formatMessage({ id: 'トライアル' }) },
                                    { value: "it", label: intl.formatMessage({ id: 'IT・開発' }) },
                                    { value: "video", label: intl.formatMessage({ id: '動画制作' }) },
                                    { value: "light_work", label: intl.formatMessage({ id: '軽作業' }) },
                                ]}
                            />
                        </div>

                        {/* Project Image Upload Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#122B31] dark:text-gray-200">
                                {intl.formatMessage({ id: 'プロジェクト画像' })}
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
                                    {formData.image ? formData.image.name : intl.formatMessage({ id: '画像を選択' })}
                                </span>
                                <Upload className="w-4 h-4 text-[#8897AD]" />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="sm:grid flex flex-col-reverse grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-full py-3 px-4 bg-[#EFEFEF] hover:bg-gray-200 text-[#122B31] font-bold rounded-xl text-sm transition-colors"
                            >
                                {intl.formatMessage({ id: 'キャンセル' })}
                            </button>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-[#1B2A32] hover:bg-[#122B31] text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                            >
                                {editingProject ? intl.formatMessage({ id: '保存する' }) : intl.formatMessage({ id: '追加する' })}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}