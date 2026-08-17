import { MenuTabs, StudentListFilter } from '@/components/custom';
import StudentLists from '@/components/custom/students/student-lists';
import Seo from '@/components/Seo/Seo';

export default function Dashboard({ info }) {
    return (
        <>
            <Seo title={info?.title || "ホーム"} description={info?.description || "ホーム"} keywords={info?.keywords || "ホーム"} />

            <MenuTabs />

            <div className="container mx-auto px-4">
                <div className="flex flex-col items-start justify-between gap-5 py-3">
                    <StudentListFilter />

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-6 sm:p-8 bg-white dark:bg-gray-800 border border-transparent dark:border-gray-700/60 shadow-soft-sm dark:shadow-none rounded-[24px] transition-colors duration-300">
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