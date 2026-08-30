import React, { useState } from 'react';
import { MenuTabs, ProjectSearchBox, StudentLists, StudentSearchBox } from '@/components/custom';
import ProjectLists from '@/components/custom/home/project-lists';
import Seo from '@/components/Seo/Seo';
import CreateProjectModal from '@/components/ui/Modal/create-project-modal';
import AddStudentModal from '@/components/ui/Modal/add-student-modal';
import { ConfirmModal } from '@/components/ui';
import { authAxios } from '@/utils/axios';
import { mutate } from 'swr';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

export default function Dashboard({ info }) {
    const intl = useIntl();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [deletingProjectId, setDeletingProjectId] = useState(null);

    const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);

    const showApiErrorToast = (error, fallbackMessage) => {
        if (error.response?.status === 403) {
            toast.error(intl.formatMessage({ id: 'actionNotAllowedStaff' }));
            return;
        }

        const detail = error.response?.data?.detail;
        const errCode = typeof detail === 'object' ? detail.code : null;
        const detailStr = typeof detail === 'string' ? detail : (detail?.message || '');

        if (error.response?.status === 409) {
            if (detailStr.includes('student_code')) {
                toast.error(intl.formatMessage({ id: 'studentCodeExists' }));
                return;
            }
            if (detailStr.includes('email')) {
                toast.error(intl.formatMessage({ id: 'emailExists' }));
                return;
            }
            if (errCode === 'MEMBER_LIMIT_EXCEEDED') {
                toast.warning(intl.formatMessage({ id: 'memberLimitExceeded' }));
                return;
            }
            if (errCode === 'STUDENT_ALREADY_IN_PROJECT') {
                toast.warning(intl.formatMessage({ id: 'studentAlreadyInProject' }));
                return;
            }
            toast.error(detailStr || fallbackMessage);
            return;
        }

        const msg = (typeof detail === 'object' ? detail.message : detail) || error.message || fallbackMessage;
        toast.error(msg);
    };

    const handleOpenCreateModal = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (project) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleDeleteProject = (projectId) => {
        setDeletingProjectId(projectId);
    };

    const handleConfirmDeleteProject = async () => {
        if (!deletingProjectId) return;
        try {
            await authAxios.delete(`projects/${deletingProjectId}`);
            mutate((key) => typeof key === 'string' && key.startsWith('projects'));
        } catch (error) {
            console.error("Loyihani o'chirishda xatolik:", error);
            showApiErrorToast(error, "Loyihani o'chirishda xatolik yuz berdi.");
        } finally {
            setDeletingProjectId(null);
        }
    };

    const handleProjectModalSubmit = async (formData) => {
        try {
            const statusMap = {
                "稼働中": "active",
                "準備中": "planned",
                "計画中": "planned",
                "完了": "done",
                "active": "active",
                "planned": "planned",
                "done": "done"
            };

            const projectPayload = {
                name: formData.title.trim(),
                start_date: formData.startDate 
                    ? formData.startDate.replace(/\//g, '-') 
                    : (editingProject ? editingProject.start_date : new Date().toISOString().split('T')[0]),
                end_date: formData.endDate 
                    ? formData.endDate.replace(/\//g, '-') 
                    : (editingProject ? editingProject.end_date : null),
                status: statusMap[formData.status] || (editingProject ? editingProject.status : "planned"),
                category: formData.category || (editingProject ? editingProject.category : "trial"),
                overview: editingProject ? (editingProject.overview || "") : ""
            };

            if (editingProject) {
                await authAxios.put(`projects/${editingProject.id}`, projectPayload);
            } else {
                await authAxios.post("projects", projectPayload);
            }

            setIsModalOpen(false);
            setEditingProject(null);

            mutate((key) => typeof key === 'string' && key.startsWith('projects'));
        } catch (error) {
            console.error("Loyiha saqlashda xatolik:", error);
            showApiErrorToast(error, "Loyiha saqlashda xatolik yuz berdi.");
        }
    };

    const handleOpenStudentEditModal = (student) => {
        setEditingStudent(student);
        setIsStudentModalOpen(true);
    };

    const handleDeleteStudent = async (studentId) => {
        try {
            await authAxios.delete(`students/${studentId}`);
            setIsStudentModalOpen(false);
            setEditingStudent(null);
            mutate((key) => typeof key === 'string' && key.startsWith('students'));
        } catch (error) {
            console.error("Talabani o'chirishda xatolik:", error);
            showApiErrorToast(error, "Talabani o'chirishda xatolik yuz berdi.");
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

            setIsStudentModalOpen(false);
            setEditingStudent(null);

            mutate((key) => typeof key === 'string' && key.startsWith('students'));
        } catch (error) {
            console.error("Talaba saqlashda xatolik:", error.message || "AxiosError");
            showApiErrorToast(error, "Talaba saqlashda xatolik yuz berdi.");
        }
    };

    // A'zolikni boshqarish handlerlari
    const handleRemoveStudentMember = async (projectId, studentId) => {
        try {
            await authAxios.delete(`projects/${projectId}/members/${studentId}`);
            mutate((key) => typeof key === 'string' && (key.startsWith('projects') || key.startsWith('students')));
        } catch (error) {
            console.error("Talabani loyihadan o'chirishda xatolik:", error);
            showApiErrorToast(error, "Talabani loyihadan o'chirishda xatolik yuz berdi.");
        }
    };

    const handleToggleLeaderStatus = async (project, studentId, currentIsLeader) => {
        const projectId = project.id;
        try {
            const nextIsLeader = !currentIsLeader;

            if (nextIsLeader) {
                // Agar boshqa leader bo'lsa, uni oddiy jamoa a'zosiga aylantiramiz
                const activeLeader = project.members?.find(m => !m.left_at && m.is_leader);
                if (activeLeader && activeLeader.student.id !== studentId) {
                    await authAxios.delete(`projects/${projectId}/members/${activeLeader.student.id}`);
                    await authAxios.post(`projects/${projectId}/members`, {
                        student_id: activeLeader.student.id,
                        is_leader: false
                    });
                }
            }

            await authAxios.delete(`projects/${projectId}/members/${studentId}`);
            await authAxios.post(`projects/${projectId}/members`, {
                student_id: studentId,
                is_leader: nextIsLeader
            });
            mutate((key) => typeof key === 'string' && (key.startsWith('projects') || key.startsWith('students')));
        } catch (error) {
            console.error("Loyiha rahbarligini o'zgartirishda xatolik:", error);
            showApiErrorToast(error, "Loyiha rahbarligini o'zgartirishda xatolik yuz berdi.");
        }
    };

    const handleMoveStudentMember = async (sourceProjectId, studentId, targetProjectId) => {
        if (sourceProjectId && sourceProjectId === targetProjectId) return;
        try {
            if (!sourceProjectId) {
                // Dragged from student list sidebar - assign directly
                await authAxios.post(`projects/${targetProjectId}/members`, {
                    student_id: studentId,
                    is_leader: false
                });
            } else {
                // Dragged from another project - move member
                await authAxios.patch(`projects/${sourceProjectId}/members/${studentId}/move`, {
                    target_project_id: targetProjectId
                });
            }
            mutate((key) => typeof key === 'string' && (key.startsWith('projects') || key.startsWith('students')));
        } catch (error) {
            if (error.response?.status !== 409) {
                console.error("Talabani biriktirish/ko'chirishda xatolik:", error);
            }
            showApiErrorToast(error, "Amalni bajarishda xatolik yuz berdi.");
        }
    };

    return (
        <>
            <Seo 
                title={intl.formatMessage({ id: 'プロジェクト' })} 
                description={intl.formatMessage({ id: 'プロジェクト' })} 
                keywords={intl.formatMessage({ id: 'プロジェクト' })} 
            />

            <MenuTabs />

            <div className="container mx-auto px-4">
                <div className="flex flex-col 2xl:flex-row items-start justify-between gap-5 py-3">

                    {/* Chap tomondagi asosiy kontent maydoni */}
                    <div className="w-full flex-1">
                        <ProjectSearchBox onOpenCreate={handleOpenCreateModal} />
                        <ProjectLists 
                            onOpenEdit={handleOpenEditModal} 
                            onDelete={handleDeleteProject}
                            onAddStudent={() => {}}
                            onRemoveStudent={handleRemoveStudentMember}
                            onToggleLeader={handleToggleLeaderStatus}
                            onMoveStudent={handleMoveStudentMember}
                        />
                    </div>

                    {/* O'ng tomondagi Student paneli */}
                    <div className="w-full 2xl:w-[380px] shrink-0 flex flex-col gap-6 p-6 sm:p-8 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] transition-colors duration-300">
                        <StudentSearchBox />
                        <StudentLists onOpenEdit={handleOpenStudentEditModal} />
                    </div>

                </div>
            </div>

            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingProject(null);
                }}
                onSubmit={handleProjectModalSubmit}
                editingProject={editingProject}
            />

            <AddStudentModal
                isOpen={isStudentModalOpen}
                onClose={() => {
                    setIsStudentModalOpen(false);
                    setEditingStudent(null);
                }}
                onSubmit={handleStudentModalSubmit}
                onDelete={handleDeleteStudent}
                editingStudent={editingStudent}
            />

            <ConfirmModal
                isOpen={!!deletingProjectId}
                onClose={() => setDeletingProjectId(null)}
                onConfirm={handleConfirmDeleteProject}
                title={intl.formatMessage({ id: 'confirmDeleteProjectTitle' })}
                message={intl.formatMessage({ id: 'confirmDeleteProject' })}
                confirmText={intl.formatMessage({ id: '削除' })}
                cancelText={intl.formatMessage({ id: 'キャンセル' })}
                variant="danger"
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