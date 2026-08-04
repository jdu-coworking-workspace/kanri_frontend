import Seo from '@/components/Seo/Seo';

export default function Home({ info }) {
  return (
    <>
      <Seo title={"CADS - Digital Security Learning v1.0"} description={"CADS is a simple guide to online safety. Learn how to avoid scams and protect your data."} keywords={"CADS, digital security, online safety, xavfsizlik, cybersecurity, o'rganish, cads uz, cads.uz, kiberxavfsizlikни o'rganish, toshkent kiberxavfsizlik"} />

    </>
  );
}


export async function getServerSideProps({ locale }) {
  try {
    const pageData = {
      title: "CADS",
      description: "CADS",
      keywords: "CADS"
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