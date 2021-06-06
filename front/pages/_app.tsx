import "../styles/globals.css";
import { ContextWrapper } from "@utils/context";
import Cookies from "universal-cookie";
import { serverAuth } from "@utils/auth";
import { CookiesProvider } from "react-cookie";

function MyApp({ Component, pageProps, auth }: any) {
    console.log(`auth: ${JSON.stringify(auth)}`);
    return (
        <ContextWrapper appFileUserData={{ ...pageProps }}>
            <CookiesProvider>
                <Component {...pageProps} auth={auth} />
            </CookiesProvider>
        </ContextWrapper>
    );
}

MyApp.getInitialProps = async ({ Component, ctx }: any) => {
    let pageProps = {};
    let auth = {};
    try {
        const cookies = new Cookies(ctx.req?.headers.cookie);
        const token = cookies.get("session");
        const user = await serverAuth(token);
        if (!user) auth = { isAuth: false };
        auth = { user, isAuth: Object.keys(user).length > 0 };
        if (Component.getInitialProps) {
            pageProps = await Component.getInitialProps(ctx);
        }
    } catch (error) {
        console.log(error.code);
    } finally {
        return { pageProps, auth };
    }
};

export default MyApp;
