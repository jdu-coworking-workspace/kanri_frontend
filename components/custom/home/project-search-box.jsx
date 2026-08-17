import { BaseInput, BaseSelect, Button } from '@/components/ui';
import CreateProjectModal from '@/components/ui/Modal/create-project-modal';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';

export default function ProjectSearchBox() {
    const intl = useIntl();
    const [group, setGroup] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCreateProject = (data) => {
        // Bu yerda API request jo'natishingiz mumkin
        setIsModalOpen(false);
    };

    return (
        <>
            <div className='flex 6xl:flex-row flex-col 6xl:items-baseline items-start justify-between w-full gap-3'>
                <div className='grid grid-cols-2 lg:grid-cols-3 w-full 6xl:w-3/4 shrink-0 gap-3 sm:gap-4'>
                    <BaseInput placeholder={intl.formatMessage({ id: '名前で絞り込み' })} />
                    <BaseInput placeholder={intl.formatMessage({ id: '学生名で絞り込み' })} />
                    <div className='grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-1 col-span-2'>
                        <BaseSelect
                            label="状態"
                            labelPosition="left"
                            options={[
                                { value: 'a', label: '全て' },
                                { value: 'b', label: 'B' },
                            ]}
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                        />
                        <BaseSelect
                            label="種別"
                            labelPosition="left"
                            options={[
                                { value: 'a', label: '全て' },
                                { value: 'b', label: 'B' },
                            ]}
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                        />
                    </div>
                </div>
                <Button
                    onClick={() => setIsModalOpen(true)}
                    leftIcon={`<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.99996 2.91675V11.0834M2.91663 7.00008H11.0833" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`}
                >
                    グループに追加
                </Button>
            </div>

            {/* Modal Oyna */}
            <CreateProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateProject}
            />
        </>
    );
}