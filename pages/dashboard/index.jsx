import { MenuTabs, ProjectSearchBox, StudentLists, StudentSearchBox } from '@/components/custom';
import ProjectLists from '@/components/custom/home/project-lists';
import Seo from '@/components/Seo/Seo';

export default function Dashboard({ info }) {
    return (
        <>
            <Seo title={info?.title || "ホーム"} description={info?.description || "ホーム"} keywords={info?.keywords || "ホーム"} />

            <MenuTabs />

            <div className="container mx-auto px-4">
                <div className="flex flex-col 2xl:flex-row items-start justify-between gap-5 py-3">

                    {/* Chap tomondagi asosiy kontent maydoni */}
                    <div className="w-full flex-1">
                        <ProjectSearchBox />
                        <ProjectLists />
                    </div>

                    {/* O'ng tomondagi Student paneli */}
                    <div className="w-full 2xl:w-[380px] flex flex-col gap-6 p-6 sm:p-8 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] transition-colors duration-300">
                        <StudentSearchBox />
                        <StudentLists />
                    </div>

                </div>
            </div>
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