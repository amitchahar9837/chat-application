import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/AuthSlice";

export default function Login() {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  
  const { isLoggingIn } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();

  const validation = () => {
    if (!loginData.email || !loginData.password) {
      toast.error("Please fill in all fields", { id: "login-validation" });
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validation()) return;
    dispatch(login(loginData));
  };

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleLogin} style={{ width: "100%" }}>
      <VStack spacing={4}>
        <FormControl>
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            variant="filled"
            rounded="xl"
            h="50px"
            _focus={{ bg: "white", borderColor: "purple.500" }}
            value={loginData.email}
            onChange={handleChange}
          />
        </FormControl>

        <FormControl>
          <InputGroup size="md">
            <Input
              name="password"
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder="Password"
              variant="filled"
              rounded="xl"
              h="50px"
              _focus={{ bg: "white", borderColor: "purple.500" }}
              value={loginData.password}
              onChange={handleChange}
            />
            <InputRightElement h="50px">
              <IconButton
                variant="ghost"
                size="sm"
                icon={show ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          mt={4}
          w="full"
          h="50px"
          colorScheme="purple"
          isLoading={isLoggingIn}
          type="submit"
          rounded="xl"
          fontSize="md"
          fontWeight="bold"
          boxShadow="0px 8px 15px rgba(128, 90, 213, 0.2)"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          _active={{ transform: "scale(0.98)" }}
        >
          Login to Account
        </Button>
      </VStack>
    </form>
  );
}