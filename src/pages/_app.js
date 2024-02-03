import Login from "@/Components/Login";
import Header from "@/Components/Header";
import Sidebar from "@/Components/Sidebar";
import { auth } from "@/db/firebase";
import "@/styles/globals.css";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { Provider } from "react-redux";
import { useMediaQuery } from "@react-hook/media-query";
import store from "@/redux/store";
export default function App({ Component, pageProps }) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(isLargeScreen);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Provider store={store}>
      <div className="text-black bg-blue-50">
        <Header
          photoUrl={user.photoURL}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <div
          className={`h-screen pt-[95px] grid gap-4 overflow-hidden ${
            isSidebarOpen
              ? "grid-cols-[3fr,9fr] max-sm:grid-cols-[9fr,3fr] "
              : ""
          }`}
          style={{ height: "calc(100vh)" }}
        >
          {/* Left Column */}
          <Scrollbars
            autoHide={true}
            autoHideTimeout={100}
            autoHideDuration={200}
            thumbMinSize={30}
            universal={true}
          >
            <Sidebar
              displayName={user.displayName}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
          </Scrollbars>
          {/* right Column */}
          <Scrollbars
            style={{ height: "calc(80vh)" }}
            autoHide={true}
            autoHideTimeout={100}
            autoHideDuration={200}
            thumbMinSize={30}
            universal={true}
          >
            <div className="w-full">
              <div className="flex flex-col px-4 w-full">
                <Component {...pageProps} />
              </div>
            </div>
          </Scrollbars>
        </div>
      </div>
    </Provider>
  );
}
