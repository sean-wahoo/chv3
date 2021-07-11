import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import { GetServerSideProps } from "next";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import Loading from "@utils/loading";
import Navbar, { MobileBottomNav } from "@components/Navbar";
import { DetailedPost } from "@utils/interfaces";

export default function Home(props: any) {
    const router = useRouter();
    if (process.browser && !props.auth.isAuth) {
        router.push("/login");
    }
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo("en-us");
    const posts = props.posts.map((post: DetailedPost) => {
        return (
            <div
                key={post.post_id}
                className="w-full bg-white dark:bg-postBlockDark md:border md:rounded-none rounded-lg border-lightBorder dark:border-black p-4 my-1"
            >
                <h4 className="text-sm md:hidden ml-auto dark:text-postBodyDark ">
                    posted by {post.username}{" "}
                    {timeAgo.format(new Date(post.created_at))}
                </h4>

                <div className="flex flex-row">
                    <Link href={`/post/${post.post_id}`}>
                        <h4 className="cursor-pointer hover:underline font-medium mr-auto text-xl dark:text-white">
                            {post.title}
                        </h4>
                    </Link>
                    <h4 className="lg:text-md md:text-sm md:block hidden ml-auto dark:text-white">
                        posted by {post.username}{" "}
                        {timeAgo.format(new Date(post.created_at))}
                    </h4>
                </div>
                <Link href={`/post/${post.post_id}`}>
                    <p className="cursor-pointer my-4 text-postBodyLight dark:text-postBodyDark">
                        {post.content}
                    </p>
                </Link>
                <p className="dark:text-white">
                    {post.num_likes} likes · {post.num_comments} comments
                </p>
            </div>
        );
    });

    return !props.auth.isAuth ? (
        <Loading />
    ) : (
        <div className="w-full min-h-screen bg-pageBgLight dark:bg-pageBgDark flex flex-col font-work-sans font-normal">
            <Navbar user_data={props.auth.user} />
            <div className="pt-20 pb-16 mx-auto mb-auto mt-2 xl:w-2/5 lg:w-3/5 md:w-4/5 w-full flex flex-col">
                {posts}
            </div>
            <MobileBottomNav user_data={props.auth.user} />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const posts = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/getPosts`
    );

    return {
        props: {
            posts: posts.data,
        },
    };
};
