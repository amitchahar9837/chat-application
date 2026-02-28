import { Box, Flex, Image, Text, Tabs, TabList, Tab, TabPanels, TabPanel, TabIndicator, useColorModeValue } from "@chakra-ui/react";
import Background from "../assets/login2.png";
import { Login, Signup } from "../components";

export default function Auth() {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Flex 
      minH="100vh" 
      align="center" 
      justify="center" 
      bgGradient="linear(to-br, purple.500, blue.400)"
      p={4}
    >
      <Box
        maxW="1000px"
        w="full"
        bg="whiteAlpha.900"
        backdropFilter="blur(10px)"
        borderRadius="3xl"
        boxShadow="2xl"
        overflow="hidden"
      >
        <Flex direction={{ base: "column", lg: "row" }} align="stretch">
          
          {/* Left Side: Form Section */}
          <Box flex="1" p={{ base: 6, md: 12 }}>
            <Box mb={8} textAlign="center">
              <Text fontSize="3xl" fontWeight="800" letterSpacing="tight" color="purple.700">
                GupShup
              </Text>
              <Text color="gray.500" mt={2}>
                Connect with the world in a click.
              </Text>
            </Box>

            <Tabs variant="unstyled" isFitted>
              <TabList bg="gray.100" p={1} borderRadius="full">
                <Tab _selected={{ bg: "white", shadow: "sm", borderRadius: "full" }} fontWeight="600">Login</Tab>
                <Tab _selected={{ bg: "white", shadow: "sm", borderRadius: "full" }} fontWeight="600">Signup</Tab>
              </TabList>
              
              <TabPanels mt={6}>
                <TabPanel p={0}><Login /></TabPanel>
                <TabPanel p={0}><Signup /></TabPanel>
              </TabPanels>
            </Tabs>
          </Box>

          {/* Right Side: Image/Branding (Hidden on mobile) */}
          <Flex 
            flex="1" 
            bg="purple.50" 
            align="center" 
            justify="center" 
            display={{ base: "none", lg: "flex" }}
            p={8}
          >
            <Box textAlign="center">
              <Image 
                src={Background} 
                alt="Auth Illustration" 
                maxH="400px" 
                objectFit="contain"
                transition="transform 0.3s ease"
                _hover={{ transform: "scale(1.05)" }}
              />
              <Text mt={6} fontSize="xl" fontWeight="bold" color="purple.800">
                Talk Freely, Securely.
              </Text>
            </Box>
          </Flex>
          
        </Flex>
      </Box>
    </Flex>
  );
}