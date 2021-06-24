import Reply from "@components/Reply";
import axios from "axios";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

export default function Comment(props: any) {
    const comment_data = props.comment_data;
    const [replies, setReplies] = useState<any>();
    let replies_data;

    const getReplies = async () => {
        const fetchedReplies = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/getRepliesToComment`,
            { params: { comment_id: comment_data.comment_id } }
        );
        console.log(comment_data.comment_id);
        replies_data = fetchedReplies.data;
        console.log(replies_data);
    };

    useEffect(() => {
        getReplies();
    }, []);

    // if (comment_data.num_replies > 0) {
    //     for (let i = 0; i < comment_data.num_replies; i++) {
    //         replies.push(<Reply comment_data={comment_data} />);
    //     }
    // }
    return (
        <>
            <div
                key={comment_data.comment_id}
                className="flex flex-col w-full my-4 bg-white dark:bg-postBlockDark"
            >
                <div className="flex flex-row items-center dark:text-postBodyDark">
                    {comment_data.username}
                </div>
                <p className="text-lg dark:text-postBodyDark">
                    {comment_data.content}
                </p>
                <div className="flex flex-row items-center dark:text-postBodyDark lg:text-xl text-lg mt-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="lg:h-6 lg:w-6 h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                    </svg>{" "}
                    {comment_data.num_replies}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="lg:h-6 lg:w-6 h-5 w-5 mx-2 ml-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>{" "}
                    {comment_data.num_likes}
                </div>
            </div>
            {replies}
        </>
    );
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     let replies: any = [];
//     const replies_data = await axios.get("");
//     try {
//         return {
//             props: {},
//         };
//     } catch (error) {
//         console.error(error);
//     } finally {
//         return {
//             props: {},
//         };
//     }
// };