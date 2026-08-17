import { ProjectCard } from '@/components/ui'
import React from 'react'

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

export default function ProjectLists() {
    return (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 4xl:grid-cols-3 6xl:grid-cols-4 gap-5 pt-8">
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
            <ProjectCard title="スマート農業IoT管理" tags={[{ label: "トライアル", variant: "trial" }, { label: "稼働", variant: "active" }]} dateRange={"2026/05/25 〜 2026/10/06"} coverImage="/images/project-img.png" students={studentsData} />
        </div>
    )
}
