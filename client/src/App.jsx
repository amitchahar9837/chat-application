import { Auth, Homepage, Profile } from "./pages";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./redux/slices/AuthSlice";
import { Spinner, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import "./App.css";
import { setSelectedUser } from "./redux/slices/ChatSlice";
import { ChatContainer } from "./components";

export default function App() {
  const { isCheckingAuth, authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(setSelectedUser(null));
  }, []);

  if (isCheckingAuth && !authUser) {
    return (
      <VStack colorPalette="teal">
        <Spinner color="colorPalette.600" />
        <Text color="colorPalette.600">Loading...</Text>
      </VStack>
    );
  }
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/auth" />}
        />
        {isMobile && (
          <Route
            path="/chat/:userId"
            element={authUser ? <ChatContainer /> : <Navigate to="/auth" />}
          />
        )}
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/auth" />}
        />
        <Route
          path="/auth"
          element={authUser ? <Navigate to="/" /> : <Auth />}
        />

        <Route path="*" element={<Navigate to={authUser ? "/" : "/auth"} />} />
      </Routes>
    </>
  );
}
