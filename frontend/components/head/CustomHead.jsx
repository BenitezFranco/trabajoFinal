import Head from 'next/head';

const CustomHead = ({ title, description }) => {
    return (
        <Head>
            <title>{title || "FoodBook"}</title>
            {description && <meta name="description" content={description} />}
        </Head>
    );
};

export default CustomHead;
