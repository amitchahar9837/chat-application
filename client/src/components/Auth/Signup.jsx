import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import  { useState } from "react";
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
  const {isSigningUp} = useSelector(state => state.auth)
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validation = () =>{
    if(!signupData.email.length || !signupData.password.length || !signupData.fullName.length){
        toast.error("All fields are required", {id:"validation error"});
        return false;
    }
    return true;
  }
  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validation()) {
      return;
    }
    dispatch(signup(signupData))
  }

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
      <Input
      mt={4}
        type="email"
        placeholder="Email"
        id="email"
        rounded="full"
        value={signupData.email}
        onChange={handleChange}
      />
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
