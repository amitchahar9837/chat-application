import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/slices/AuthSlice";
import { FaUser } from "react-icons/fa";

export default function Login() {
  const [signupData, setLoginData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  const { isSigningUp } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fieldErrors, setFieldErrors] = useState({});

  const validation = () => {
    if (
      !signupData.email.length ||
      !signupData.password.length ||
      !signupData.fullName.length
    ) {
      toast.error("All fields are required", { id: "validation error" });
      return false;
    }
    return true;
  };
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validation()) return;
    try {
      await dispatch(signup(signupData)).unwrap();
    } catch (err) {
      if (err?.data) {
        setFieldErrors(err.data);
      }
    }
  };

  const handleChange = (e) => {
    setLoginData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  return (
    <form onSubmit={handleSignup}>
      <Input
        type={"text"}
        placeholder="Enter full name"
        rounded="full"
        id="fullName"
        value={signupData.fullName}
        onChange={handleChange}
      />
      {fieldErrors.fullName && (
        <Text color="red.500" fontSize="sm">
          {fieldErrors.fullName[0]}
        </Text>
      )}
      <Input
        mt={4}
        type="email"
        placeholder="Email"
        id="email"
        rounded="full"
        value={signupData.email}
        onChange={handleChange}
      />
      {fieldErrors.email && (
        <Text color="red.500" fontSize="sm">
          {fieldErrors.email[0]}
        </Text>
      )}
      <InputGroup mt={4}>
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Password"
          id="password"
          rounded="full"
          value={signupData.password}
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
      {fieldErrors.password && (
        <Text color="red.500" fontSize="sm">
          {fieldErrors.password[0]}
        </Text>
      )}

      <Button
        mt={6}
        w="full"
        colorScheme="purple"
        isLoading={isSigningUp}
        type="submit"
        rounded="full"
      >
        Signup
      </Button>
    </form>
  );
}
