import React, { useState, useRef } from "react";
import { X, Calendar, Upload } from "lucide-react";
import { BaseInput, BaseSelect } from "..";

export default function CreateProjectModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        title: "",
        startDate: "",
        endDate: "",
        status: "稼働中",
        image: null,
    });

    const fileInputRef = useRef(null);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
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
                            プロジェクトを作成
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
                        {/* Project Name */}
                        <BaseInput
                            variant="modal"
                            label="プロジェクトの名前"
                            placeholder="グループ名を入力してください"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />

                        {/* Date Picker Range */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <BaseInput
                                variant="modal"
                                label="開始日"
                                placeholder="YYYY/MM/DD"
                                rightIcon={<Calendar className="w-4 h-4" />}
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                            <BaseInput
                                variant="modal"
                                label="終了日"
                                placeholder="YYYY/MM/DD"
                                rightIcon={<Calendar className="w-4 h-4" />}
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>

                        {/* Status Select */}
                        <BaseSelect
                            variant="modal"
                            label="ステータス"
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            options={[
                                { value: "稼働中", label: "稼働中" },
                                { value: "準備中", label: "準備中" },
                                { value: "完了", label: "完了" },
                            ]}
                        />

                        {/* Group Image Upload Input */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#122B31] dark:text-gray-200">
                                グループ画像
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
                                    {formData.image ? formData.image.name : "画像を選択"}
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
                                キャンセル
                            </button>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-[#1B2A32] hover:bg-[#122B31] text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
                            >
                                追加する
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}