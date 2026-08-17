import { BaseInput, Button } from '@/components/ui'
import AddStudentModal from '@/components/ui/Modal/add-student-modal';
import React, { useState } from 'react'
import { useIntl } from 'react-intl';

export default function StudentListFilter() {
    const intl = useIntl();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateProject = (data) => {
        // Bu yerda API request jo'natishingiz mumkin
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="flex sm:flex-row flex-col justify-between gap-3 w-full">
                <BaseInput placeholder={intl.formatMessage({ id: '名前で絞り込み' })} />
                <div className="flex sm:justify-start justify-end">
                    <Button
                        onClick={() => setIsModalOpen(true)}
                        leftIcon={`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.99996 2.91675V11.0834M2.91663 7.00008H11.0833" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`}
                    >
                        学生を追加
                    </Button>
                </div>
            </div>

            {/* Modal Oyna */}
            <AddStudentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProject}
            />
        </>
    )
}
