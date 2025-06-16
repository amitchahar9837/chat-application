import {
  Box,
  Grid,
  GridItem,
  Image,
  Text,
  TabList,
  Tabs,
  TabIndicator,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import React from "react";
import Background from "../assets/login2.png";
import { Login, Signup } from "../components";

export default function Auth() {
  return (
    <Box
      w={"100vw"}
      h={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        h={"80vh"}
        bg={"white"}
        border={"2px solid white"}
        boxShadow={"2xl"}
        opacity={0.9}
      >
        <Grid templateColumns={{ xl: "repeat(2, 1fr)" }} w={"100%"} h={"100%"}>
          <GridItem
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            flexDirection={"column"}
            gap={1}
          >
            <Box textAlign={"center"}>
              <Text fontSize={{ base: "4xl", md: "5xl" }} fontWeight={"bold"}>
                Welcome
              </Text>
              <Text
                fontWeight={"medium"}
                textAlign={"center"}
                paddingX={"1rem"}
              >
                Fill in the details to get started with chat application
              </Text>
            </Box>
            <Tabs variant="unstyled" w={"90%"} mt={5}>
              <TabList justifyContent={"center"}>
                <Tab>Login</Tab>
                <Tab>Signup</Tab>
              </TabList>
              <TabIndicator mt="-1.5px" height="2px" bg="purple.600" />
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>

                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>

          <GridItem display={{ base: "none", xl: "block" }}>
            <Image
              src={Background}
              alt="Login-Background"
              w="90%"
              h="90%"
              objectFit="scale-down"
            />
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
