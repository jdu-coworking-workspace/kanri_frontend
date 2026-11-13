import React, { useEffect, useRef, useState } from "react";
import { useIntl } from "react-intl";
import { AlertCircle, CheckCircle2, Download, FileSpreadsheet, Upload, X } from "lucide-react";
import { authAxios } from "@/utils/axios";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".xlsx", ".csv"];

function extractFilename(disposition, fallback) {
    const matched = /filename="?([^";]+)"?/i.exec(disposition || "");
    return matched?.[1] || fallback;
}

async function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
}

export default function BulkStudentModal({ isOpen, onClose, onImported }) {
    const intl = useIntl();
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [skipInvalid, setSkipInvalid] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [downloading, setDownloading] = useState("");
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    useEffect(() => {
        if (!isOpen) {
            setFile(null);
            setSkipInvalid(false);
            setUploading(false);
            setDownloading("");
            setError("");
            setResult(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const t = (id, values) => intl.formatMessage({ id }, values);

    const handleDownloadTemplate = async (format) => {
        setError("");
        setDownloading(format);
        try {
            const response = await authAxios.get(`students/bulk/template/${format}`, {
                responseType: "blob",
            });
            const filename = extractFilename(
                response.headers["content-disposition"],
                `students.${format}`,
            );
            await saveBlob(response.data, filename);
        } catch (downloadError) {
            setError(t("bulkTemplateFailed"));
        } finally {
            setDownloading("");
        }
    };

    const handleFileChange = (event) => {
        const selected = event.target.files?.[0];
        setError("");
        setResult(null);
        if (!selected) {
            setFile(null);
            return;
        }

        const lowerName = selected.name.toLowerCase();
        if (!ALLOWED_EXTENSIONS.some((ext) => lowerName.endsWith(ext))) {
            setError(t("bulkInvalidFileType"));
            setFile(null);
            event.target.value = "";
            return;
        }
        if (selected.size > MAX_FILE_SIZE_BYTES) {
            setError(t("bulkFileTooLarge"));
            setFile(null);
            event.target.value = "";
            return;
        }
        setFile(selected);
    };

    const handleUpload = async () => {
        if (!file) {
            setError(t("bulkNoFileSelected"));
            return;
        }

        setUploading(true);
        setError("");
        setResult(null);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("skip_invalid", String(skipInvalid));

            const response = await authAxios.post("students/bulk/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                timeout: 120000,
            });
            setResult(response.data);
            if (response.data?.created_count > 0) {
                onImported?.(response.data);
            }
        } catch (uploadError) {
            const detail = uploadError.response?.data?.detail;
            if (detail && typeof detail === "object") {
                setResult({
                    total: 0,
                    created_count: 0,
                    failed_count: detail.errors?.length || 0,
                    created: [],
                    errors: detail.errors || [],
                });
                setError(detail.message || t("bulkFailed"));
            } else {
                setError(typeof detail === "string" ? detail : t("bulkFailed"));
            }
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm p-4">
            <div className="flex min-h-full items-center justify-center py-5">
                <div className="w-full max-w-[720px] bg-white dark:bg-gray-900 rounded-[24px] p-6 sm:p-8 shadow-2xl">
                    <div className="flex items-start justify-between gap-4 mb-5">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-[#122B31] dark:text-white">
                                {t("bulkStudentTitle")}
                            </h2>
                            <p className="mt-1 text-sm text-[#8897AD] dark:text-gray-400">
                                {t("bulkStudentDescription")}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-8 h-8 shrink-0 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Template download */}
                    <div className="rounded-2xl border border-[#E4E9EE] dark:border-gray-700 bg-[#F5F8FA] dark:bg-gray-800/60 p-4">
                        <p className="text-sm font-semibold text-[#122B31] dark:text-gray-200 mb-3">
                            {t("bulkTemplateSection")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button
                                type="button"
                                onClick={() => handleDownloadTemplate("xlsx")}
                                disabled={Boolean(downloading)}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-[#122B31] dark:text-gray-100 hover:bg-[#EEF3F7] dark:hover:bg-gray-800 disabled:opacity-60 transition-colors"
                            >
                                <FileSpreadsheet className="w-4 h-4" />
                                {downloading === "xlsx" ? t("bulkDownloading") : t("bulkDownloadXlsx")}
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDownloadTemplate("csv")}
                                disabled={Boolean(downloading)}
                                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border border-[#E4E9EE] dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-2.5 text-sm font-semibold text-[#122B31] dark:text-gray-100 hover:bg-[#EEF3F7] dark:hover:bg-gray-800 disabled:opacity-60 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                {downloading === "csv" ? t("bulkDownloading") : t("bulkDownloadCsv")}
                            </button>
                        </div>
                        <p className="mt-3 text-xs text-[#8897AD] dark:text-gray-400">
                            {t("bulkTemplateSampleHint")}
                        </p>
                    </div>

                    {/* File picker */}
                    <div className="mt-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <div
                            role="button"
                            tabIndex={0}
                            onClick={() => fileInputRef.current?.click()}
                            onKeyDown={(event) => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault();
                                    fileInputRef.current?.click();
                                }
                            }}
                            className="w-full cursor-pointer rounded-xl border border-dashed border-[#C9D4DF] dark:border-gray-600 bg-[#F5F8FA] dark:bg-gray-800 px-4 py-6 text-center hover:bg-[#EEF3F7] dark:hover:bg-gray-700/60 transition-colors"
                        >
                            <Upload className="w-6 h-6 mx-auto text-[#8897AD]" />
                            <p className="mt-2 text-sm font-semibold text-[#122B31] dark:text-gray-100 truncate">
                                {file ? file.name : t("bulkChooseFile")}
                            </p>
                            <p className="mt-1 text-xs text-[#8897AD] dark:text-gray-400">
                                {t("bulkFileHint")}
                            </p>
                        </div>
                    </div>

                    {/* Skip invalid */}
                    <label className="mt-4 flex items-start gap-2.5 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={skipInvalid}
                            onChange={(event) => setSkipInvalid(event.target.checked)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#122B31] focus:ring-[#122B31]"
                        />
                        <span>
                            <span className="block text-sm font-medium text-[#122B31] dark:text-gray-200">
                                {t("bulkSkipInvalid")}
                            </span>
                            <span className="block text-xs text-[#8897AD] dark:text-gray-400">
                                {t("bulkSkipInvalidHint")}
                            </span>
                        </span>
                    </label>

                    {error && (
                        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950/30 p-3 text-xs font-semibold text-red-600 dark:text-red-400">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {result && (
                        <div className="mt-4 rounded-xl border border-[#E4E9EE] dark:border-gray-700 p-4">
                            <p className="text-sm font-bold text-[#122B31] dark:text-gray-100">
                                {t("bulkResultTitle")}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 text-emerald-700 dark:text-emerald-400">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    {t("bulkCreatedCount", { count: result.created_count ?? 0 })}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-amber-700 dark:text-amber-400">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    {t("bulkFailedCount", { count: result.failed_count ?? 0 })}
                                </span>
                            </div>

                            {result.errors?.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-xs font-bold text-[#122B31] dark:text-gray-200">
                                        {t("bulkRowErrors")}
                                    </p>
                                    <ul className="mt-2 max-h-48 overflow-y-auto space-y-1.5 pr-1">
                                        {result.errors.map((rowError, index) => (
                                            <li
                                                key={`${rowError.row}-${index}`}
                                                className="rounded-lg bg-[#F5F8FA] dark:bg-gray-800 px-3 py-2 text-xs text-[#122B31] dark:text-gray-200"
                                            >
                                                <span className="font-bold">
                                                    {t("bulkRowLabel", { row: rowError.row })}
                                                </span>
                                                {rowError.student_code ? ` · ${rowError.student_code}` : ""}
                                                <ul className="mt-1 list-disc list-inside text-[#8897AD] dark:text-gray-400">
                                                    {(rowError.errors || []).map((message, msgIndex) => (
                                                        <li key={msgIndex}>{message}</li>
                                                    ))}
                                                </ul>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-xl bg-[#EFEFEF] hover:bg-gray-200 px-4 py-3 text-sm font-bold text-[#122B31] transition-colors"
                        >
                            {result ? t("bulkDone") : t("bulkClose")}
                        </button>
                        <button
                            type="button"
                            onClick={handleUpload}
                            disabled={!file || uploading}
                            className="flex-1 rounded-xl bg-[#122B31] hover:bg-[#1B2A32] px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? t("bulkUploading") : t("bulkUpload")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
