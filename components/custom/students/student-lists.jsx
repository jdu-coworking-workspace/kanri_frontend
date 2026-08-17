import { StudentCard } from '@/components/ui';
import React from 'react'
import Avatar from './../../ui/Avatar/Avatar';


const studentsData = [
    {
        id: 'JP240004',
        avatar: '/images/avatar-2.png',
        name: 'Mamatova Shahlo',
        status: 'A',
        groupCount: '1',
        katakana: 'ママトワ・シャフロ',
        isLeader: true,
    },
    {
        id: 'UZ240019',
        avatar: '/images/avatar-4.png',
        name: 'Qosimova Muhabbat',
        status: 'B',
        katakana: 'コシモワ・ムハッバット',
    },
    {
        id: 'UZ240009',
        avatar: '/images/avatar-3.png',
        name: 'Ergashev Ulugbek',
        status: 'B',
        katakana: 'エルガシェフ・ウルグベク',
    },
    {
        id: 'JP240010',
        avatar: '/images/avatar-1.png',
        name: '伊藤 みなみ',
        status: 'S',
        groupCount: 2,
        katakana: 'イトウ・ミナミ',
    },
    {
        id: 'UZ240020',
        avatar: '/images/avatar-4.png',
        name: 'Qosimova Muhabbat',
        status: 'B',
        katakana: 'コシモワ・ムハッバット',
    },
    {
        id: 'UZ240011',
        avatar: '/images/avatar-3.png',
        name: 'Ergashev Ulugbek',
        status: 'B',
        katakana: 'エルガシェフ・ウルグベク',
    },
    {
        id: 'JP240012',
        avatar: '/images/avatar-1.png',
        name: '伊藤 みなみ',
        status: 'S',
        groupCount: 2,
        katakana: 'イトウ・ミナミ',
    },
];

export default function StudentLists() {
    return (
        <>
            {
                studentsData?.map((student, idx) => (
                    <StudentCard key={idx} avatar={student.avatar} name={student.name} status={student.status} katakana={student.katakana} studentId={student.id} />
                ))}
        </>
    )
}
