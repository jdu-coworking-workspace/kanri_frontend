import React, { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { BaseInput, BaseSelect } from "..";

export default function AddStudentModal({ isOpen, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        name: "",
        furigana: "",
        studentId: "",
        gradeLevel: "",
        isGroupLeader: "",
        photo: null,
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
                            学生の追加
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
                        {/* Full Name (氏名) */}
                        <BaseInput
                            variant="modal"
                            label="氏名"
                            placeholder="山田 太郎"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        {/* Furigana (フリガナ) */}
                        <BaseInput
                            variant="modal"
                            label="フリガナ"
                            placeholder="ヤマダ タロウ"
                            value={formData.furigana}
                            onChange={(e) => setFormData({ ...formData, furigana: e.target.value })}
                        />

                        {/* Student ID (学生番号) */}
                        <BaseInput
                            variant="modal"
                            label="学生番号"
                            placeholder="例 : 20260001"
                            value={formData.studentId}
                            onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        />

                        {/* Grade Level & Group Leader (2 col grid) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <BaseSelect
                                variant="modal"
                                label="学年 レベル"
                                placeholder="学年"
                                value={formData.gradeLevel}
                                onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                                options={[
                                    { value: "1", label: "1年" },
                                    { value: "2", label: "2年" },
                                    { value: "3", label: "3年" },
                                    { value: "4", label: "4年" },
                                ]}
                            />
                            <BaseSelect
                                variant="modal"
                                label="グループリーダー"
                                placeholder="学年"
                                value={formData.isGroupLeader}
                                onChange={(e) => setFormData({ ...formData, isGroupLeader: e.target.value })}
                                options={[
                                    { value: "yes", label: "はい" },
                                    { value: "no", label: "いいえ" },
                                ]}
                            />
                        </div>

                        {/* Face Photo Upload (顔写真) */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-[#122B31] dark:text-gray-200">
                                顔写真
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
                                    {formData.photo ? formData.photo.name : "画像を選択"}
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
                                className="w-full py-3 px-4 bg-[#122B31] hover:bg-[#1B2A32] text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
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