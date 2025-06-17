import { Auth, Homepage, Profile } from "./pages";
import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./redux/slices/AuthSlice";
import { Spinner, Text, VStack } from "@chakra-ui/react";
import "./App.css";
import { connectSocket } from "./utils/socket";

export default function App() {
  const { isCheckingAuth, authUser, socket } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  useEffect(() => {
    console.log(authUser._id)
    if (authUser?._id) {
      connectSocket(authUser._id); 
    }
  }, [authUser]);

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
