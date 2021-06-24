import axios from "axios";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import Navbar, { MobileBottomNav } from "@components/Navbar";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { DetailedComment } from "@utils/interfaces";
import Comment from "@components/Comment";

export default function Post(props: any) {
    const router = useRouter();
    if (process.browser && !props.auth.isAuth) {
        router.push("/login");
    }
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-us");

    const comments = props.comments.map((comment: DetailedComment) => {
        return <Comment comment_data={comment} />;
    });

    // const comments = props.comments.map((comment: DetailedComment) => {
    //     props.replies.forEach((reply: any) => {

    //     })
    //     return (
    //         <>
    //             <div
    //                 key={comment.comment_id}
    //                 className="flex flex-col w-full my-4 bg-white dark:bg-postBlockDark"
    //             >
    //                 <div className="flex flex-row items-center dark:text-postBodyDark">
    //                     {comment.username}
    //                 </div>
    //                 <p className="text-lg dark:text-postBodyDark">
    //                     {props.post_data.content}
    //                 </p>
    //                 <div className="flex flex-row items-center dark:text-postBodyDark lg:text-xl text-lg mt-1">
    //                     <svg
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         className="lg:h-6 lg:w-6 h-5 w-5 mr-2"
    //                         fill="none"
    //                         viewBox="0 0 24 24"
    //                         stroke="currentColor"
    //                     >
    //                         <path
    //                             strokeLinecap="round"
    //                             strokeLinejoin="round"
    //                             strokeWidth={2}
    //                             d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
    //                         />
    //                     </svg>{" "}
    //                     {comment.num_replies}
    //                     <svg
    //                         xmlns="http://www.w3.org/2000/svg"
    //                         className="lg:h-6 lg:w-6 h-5 w-5 mx-2 ml-4"
    //                         fill="none"
    //                         viewBox="0 0 24 24"
    //                         stroke="currentColor"
    //                     >
    //                         <path
    //                             strokeLinecap="round"
    //                             strokeLinejoin="round"
    //                             strokeWidth={2}
    //                             d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    //                         />
    //                     </svg>{" "}
    //                     {comment.num_likes}
    //                 </div>
    //             </div>
    //         </>
    //     );
    // });

    return (
        <div className="w-full min-h-screen bg-pageBgLight dark:bg-pageBgDark flex flex-col font-work-sans font-normal">
            <Navbar user_data={props.auth.user} />
            <div className="pt-20 pb-16 md:mt-12 mt-2 mx-auto mb-auto mt-2 xl:w-3/5 lg:w-3/4 md:w-4/5 w-full flex flex-col">
                <div className="grid grid-cols-3 gap-4">
                    <div className="xl:col-span-2 col-span-3 bg-white w-full dark:bg-postBlockDark dark:text-white md:border md:rounded-none rounded-lg border-lightBorder dark:border-black p-4 px-6">
                        <div className="flex flex-col">
                            <h2 className="lg:hidden md:text-sm text-xs opacity-50">
                                posted by {props.post_data.username}{" "}
                                {timeAgo.format(
                                    new Date(props.post_data.created_at)
                                )}
                            </h2>
                            <div className="flex flex-row items-center justify-between">
                                <h1 className="lg:text-2xl text-xl font-medium">
                                    {props.post_data.title}
                                </h1>
                                <h2 className="hidden lg:block">
                                    posted by {props.post_data.username}{" "}
                                    {timeAgo.format(
                                        new Date(props.post_data.created_at)
                                    )}
                                </h2>
                            </div>
                            <p className="lg:mt-8 md:mt-4 mt-2 lg:text-xl md:text-lg dark:text-postBodyDark">
                                {props.post_data.content}
                            </p>
                            <div className="flex flex-row ml-auto items-center">
                                <h4 className="xl:text-2xl text-xl  mr-2">
                                    {props.post_data.num_likes}
                                </h4>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="xl:h-7 xl:w-7 h-6 w-6"
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
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="xl:col-span-1 xl:block hidden bg-white w-full dark:bg-postBlockDark md:border md:rounded-none rounded-lg border-lightBorder dark:border-black p-4 "></div>
                    <div className="xl:col-span-2 col-span-3 bg-white w-full dark:bg-postBlockDark md:border md:rounded-none rounded-lg border-lightBorder dark:border-black p-4 ">
                        {comments}
                    </div>
                </div>
            </div>
            <MobileBottomNav user_data={props.auth.user} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    let post_data;
    let comments;

    try {
        post_data = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/getPost`,
            { params: { post_id: context.params?.post_id } }
        );

        comments = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/getCommentsForPost`,
            {
                params: { post_id: context.params?.post_id },
            }
        );

        console.log(comments.data);
        return {
            props: {
                post_data: post_data.data,
                comments: comments.data,
                // replies: replies,
            },
        };
    } catch (error) {
        console.error(error);
    } finally {
        return {
            props: {
                post_data: post_data?.data,
                comments: comments?.data,
                // replies: replies,
            },
        };
    }
};
