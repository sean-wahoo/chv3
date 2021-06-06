import { GetServerSideProps } from "next";
import { protectedPageRequest } from "@utils/protected";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";

export default function fakeProtected(props: any) {
    return <h1>this is a protected route</h1>;
    // const router = useRouter();
    // if (props.isAuth) {
    //     return <h1>this route is protected</h1>;
    // } else {
    //     console.log(Object.keys(router));
    // }
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     const token = context.req.cookies.session;
//     console.log(`token: ${token}`);

//     return { props };
// };
