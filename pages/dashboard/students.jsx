import React, { useState } from 'react';
import { MenuTabs, StudentListFilter } from '@/components/custom';
import StudentLists from '@/components/custom/students/student-lists';
import Seo from '@/components/Seo/Seo';
import AddStudentModal from '@/components/ui/Modal/add-student-modal';
import { authAxios } from '@/utils/axios';
import { mutate } from 'swr';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

export default function Dashboard({ info }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const handleOpenCreateModal = () => {
        setEditingStudent(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (student) => {
        setEditingStudent(student);
        setIsModalOpen(true);
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            await authAxios.delete(`students/${studentId}`);
            setIsModalOpen(false);
            setEditingStudent(null);
            mutate((key) => typeof key === 'string' && key.startsWith('students'));
        } catch (error) {
            console.error("Talabani o'chirishda xatolik:", error);
            if (error.response?.status === 403) {
                toast.error(intl.formatMessage({ id: 'actionNotAllowedStaff' }));
                return;
            }
            const msg = error.response?.data?.detail?.message || error.response?.data?.detail || "Talabani o'chirishda xatolik yuz berdi.";
            toast.error(msg);
        }
    };

    const handleStudentModalSubmit = async (formData) => {
        try {
            const studentPayload = {
                full_name: formData.name,
                kana_name: formData.furigana,
                student_code: formData.studentId,
                email: formData.email && formData.email.trim() ? formData.email.trim() : `${formData.studentId}@kanri.com`,
                semester: formData.semester || "1-semestr",
                skill_rank: formData.skillRank || "C",
                work_status: formData.workStatus || "active",
                grad_year_month: formData.gradYearMonth ? formData.gradYearMonth.replace(/\//g, '-') : null,
            };

            let studentId = editingStudent?.id;

            if (editingStudent) {
                await authAxios.put(`students/${editingStudent.id}`, studentPayload);
            } else {
                const res = await authAxios.post("students", studentPayload);
                studentId = res.data?.data?.id;
            }

            if (studentId && formData.photo) {
                const uploadData = new FormData();
                uploadData.append("student_id", studentId);
                uploadData.append("file", formData.photo);

                await authAxios.post("uploads/avatar", uploadData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            setIsModalOpen(false);
            setEditingStudent(null);
            mutate((key) => typeof key === 'string' && key.startsWith('students'));
        } catch (error) {
            console.error("Talaba saqlashda xatolik:", error.message || "AxiosError");
            if (error.response?.status === 403) {
                toast.error(intl.formatMessage({ id: 'actionNotAllowedStaff' }));
                return;
            }
            const detail = error.response?.data?.detail;
            const msgString = typeof detail === 'string' ? detail : (detail?.message || '');

            if (error.response?.status === 409 || msgString.includes('student_code') || msgString.includes('email')) {
                if (msgString.includes('student_code')) {
                    toast.error(intl.formatMessage({ id: 'studentCodeExists' }));
                    return;
                }
                if (msgString.includes('email')) {
                    toast.error(intl.formatMessage({ id: 'emailExists' }));
                    return;
                }
            }
            const fallbackMsg = msgString || "Talaba saqlashda xatolik yuz berdi.";
            toast.error(fallbackMsg);
        }
    };

    const intl = useIntl();

    return (
        <>
            <Seo 
                title={intl.formatMessage({ id: '学生' })} 
                description={intl.formatMessage({ id: '学生' })} 
                keywords={intl.formatMessage({ id: '学生' })} 
            />

            <MenuTabs />

            <div className="container mx-auto px-4">
                <div className="flex flex-col items-start justify-between gap-5 py-3">
                    <StudentListFilter onOpenCreate={handleOpenCreateModal} />

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-6 sm:p-8 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] transition-colors duration-300">
                        <StudentLists onOpenEdit={handleOpenEditModal} />
                    </div>

                </div>
            </div>

            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingStudent(null);
                }}
                onSubmit={handleStudentModalSubmit}
                onDelete={handleDeleteStudent}
                editingStudent={editingStudent}
            />
        </>
    );
}

export async function getServerSideProps({ locale }) {
    try {
        const pageData = {
            title: "ホーム",
            description: "ホーム",
            keywords: "ホーム"
        }

        return {
            props: {
                info: pageData,
            },
        };
    } catch (error) {
        return { notFound: true };
    }
}