import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "../../redux/slices/AuthSlice";

export default function Signup() {
  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    fullName: "",
  });
  
  const { isSigningUp } = useSelector((state) => state.auth);
  const [show, setShow] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useDispatch();

  const validation = () => {
    if (!signupData.email || !signupData.password || !signupData.fullName) {
      toast.error("All fields are required", { id: "validation-error" });
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setFieldErrors({}); // Reset errors on new attempt
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
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <form onSubmit={handleSignup} style={{ width: "100%" }}>
      <VStack spacing={4}>
        {/* Full Name */}
        <FormControl isInvalid={!!fieldErrors.fullName}>
          <Input
            name="fullName"
            placeholder="Full Name"
            variant="filled"
            rounded="xl"
            h="50px"
            _focus={{ bg: "white", borderColor: "purple.500" }}
            value={signupData.fullName}
            onChange={handleChange}
          />
          <FormErrorMessage>{fieldErrors.fullName?.[0]}</FormErrorMessage>
        </FormControl>

        {/* Email */}
        <FormControl isInvalid={!!fieldErrors.email}>
          <Input
            name="email"
            type="email"
            placeholder="Email Address"
            variant="filled"
            rounded="xl"
            h="50px"
            _focus={{ bg: "white", borderColor: "purple.500" }}
            value={signupData.email}
            onChange={handleChange}
          />
          <FormErrorMessage>{fieldErrors.email?.[0]}</FormErrorMessage>
        </FormControl>

        {/* Password */}
        <FormControl isInvalid={!!fieldErrors.password}>
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
              value={signupData.password}
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
          <FormErrorMessage>{fieldErrors.password?.[0]}</FormErrorMessage>
        </FormControl>

        <Button
          mt={4}
          w="full"
          h="50px"
          colorScheme="purple"
          isLoading={isSigningUp}
          type="submit"
          rounded="xl"
          fontSize="md"
          fontWeight="bold"
          boxShadow="0px 8px 15px rgba(128, 90, 213, 0.2)"
          _hover={{ transform: "translateY(-2px)", boxShadow: "lg" }}
          _active={{ transform: "scale(0.98)" }}
        >
          Create Account
        </Button>
      </VStack>
    </form>
  );
}