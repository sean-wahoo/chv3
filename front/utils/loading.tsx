/**
 * loading screen to show during api calls or other stuff
 * @returns loading screen
 */
export default function Loading() {
    return (
        <div className="w-full h-screen bg-white flex flex-row items-center justify-center">
            <h1 className="justify-center items-center font_work_sans_h1 font-bold text-5xl text-indigo-900">
                Loading...
            </h1>
        </div>
    );
}
