import { useRouter } from "next/router";
import { logout } from "@utils/auth";
import Loading from "@utils/loading";

export default function Home(props: any) {
    const router = useRouter();
    if (process.browser && !props.auth.isAuth) {
        router.push("/login");
    }
    return !props.auth.isAuth ? (
        <Loading />
    ) : (
        <div className="w-full h-screen bg-blue-400 flex flex-col items-center justify-center">
            <div className="bg-white rounded-lg h-auto w-auto p-4">
                <h1 className="font_work_sans_h1 text-5xl text-indigo-900">
                    Index
                </h1>
            </div>
            <div className="mt-4 bg-white rounded-lg h-auto w-auto p-4">
                <button
                    id="logout"
                    onClick={logout}
                    className="font_work_sans_h1 text-5xl text-indigo-900"
                >
                    log out
                </button>
            </div>
        </div>
    );
}
