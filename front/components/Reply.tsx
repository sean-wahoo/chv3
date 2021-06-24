import axios from "axios";
import { GetServerSideProps } from "next";

import { useEffect, useState } from "react";

export default function Reply(props: any) {
    const [replies, setReplies] = useState<any>();
    const comment_data = props.comment_data;

    useEffect(() => {
        const getReplies = async () => {
            const fetchedReplies = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/getRepliesToComment`,
                { params: { comment_id: comment_data.comment_id } }
            );
            setReplies(fetchedReplies);
        };
        getReplies();
    }, []);
    console.log(replies);

    const formatted_replies = replies.map((reply: any) => {
        return (
            <>
                <div
                    key={reply.comment_id}
                    className="flex flex-col w-4/5 my-4 bg-white dark:bg-postBlockDark"
                >
                    <div className="flex flex-row items-center dark:text-postBodyDark">
                        {reply.username}
                    </div>
                    <p className="text-lg dark:text-red-500">{reply.content}</p>
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
                        {reply.num_replies}
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
                        {reply.num_likes}
                    </div>
                </div>
            </>
        );
    });

    return formatted_replies;
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     let replies: any = [];

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
