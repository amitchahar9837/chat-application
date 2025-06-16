import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import  { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from '../../redux/slices/AuthSlice'

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const {isLoggingIn} = useSelector(state =>state.auth)
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const validation = () => {
    if (!loginData.email.length || !loginData.password.length) {
      toast.error("All fields are required", {id:"validation error"});
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validation()) return;
    dispatch(login(loginData))
  };

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  return (
    <form onSubmit={handleLogin}>
      <FormControl>
        <Input
          type="email"
          placeholder="Email"
          rounded="full"
          name="email"
          value={loginData.email}
          onChange={handleChange}
        />
      </FormControl>

      <InputGroup mt={4}>
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Password"
          rounded="full"
          name="password"
          value={loginData.password}
          onChange={handleChange}
        />
        <InputRightElement width="4.5rem">
          <Icon
            as={show ? ViewOffIcon : ViewIcon}
            onClick={() => setShow(!show)}
            cursor="pointer"
          />
        </InputRightElement>
      </InputGroup>

      <Button
        mt={6}
        w="full"
        colorScheme="purple"
        isLoading={isLoggingIn}
        type="submit"
        rounded="full"
      >
        Login
      </Button>
    </form>
  );
}
