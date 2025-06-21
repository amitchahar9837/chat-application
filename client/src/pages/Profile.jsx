import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBack } from 'react-icons/io5'
import { FaTrash, FaPlus } from 'react-icons/fa'
import { Box, Button, Center, Flex, Grid, IconButton, Input, Text } from '@chakra-ui/react'
import { useSelector } from 'react-redux'

const Profile = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [image, setImage] = useState(null)
    const [hovered, setHovered] = useState(false)
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user)

    return (
        <Flex bg="#1b1c24" h="100vh" justify="center" align="center" direction="column" gap="10">
            <Box w={{ base: '80vw', md: '50vw', lg:'auto' }} gap="10" display="flex" flexDirection="column">
                <IconButton
                    aria-label="Go back"
                    icon={<IoArrowBack />}
                    color="whiteAlpha.900"
                    fontSize={{ base: '2xl', lg: '3xl' }}
                    variant="unstyled"
                    onClick={() => navigate(-1)}
                    _hover={{ cursor: 'pointer' }}
                />
                <Flex gap="10" flexDir={{base:'column', sm:'row'}} alignItems={{base:'center'}}>
                    <Box position="relative" w="32" h="32" md={{ w: '48', h: '48' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} rounded={'full'}>
                        <Center
                            w="32"
                            h="32"
                            md={{ w: '48', h: '48' }}
                            rounded="full"
                            bg="black"
                            overflow="hidden"
                            borderWidth="1px"
                            borderColor="whiteAlpha.400"
                            justifyContent="center"
                        >
                            {image ? (
                                <img src={image} alt="profile" className="w-full h-full object-cover" />
                            ) : (
                                <Text fontSize="5xl" color="white" display={'flex'} justifyContent="center" alignItems="center" textTransform={'uppercase'} h={'32'} w={'32'}>
                                     {firstName ? firstName.charAt(0) : user.email.charAt(0)}
                                </Text>
                            )}
                        </Center>
                        {hovered && (
                            <Center position="absolute" inset="0" bg="blackAlpha.500" rounded="full" cursor="pointer">
                            {image ? (
                              <FaTrash color="white" size={'3rem'} />
                            ) : (
                              <FaPlus color="white" size={'3rem'} />
                            )}
                          </Center>
                        )}
                    </Box>
                    <Flex flex={1} w={{base:'full'}} direction="column" gap="5" textColor={'white'} justify="center" align="center">
                        <Box w="full" >
                        <Input
                            placeholder="Email"
                            type="email"
                            isDisabled
                            bg="#2c2e3b"
                            border="none"
                            rounded="lg"
                            p="6"
                            value={user.email}
                            _disabled={{ opacity: 1, cursor: 'not-allowed' }}
                        />
                        </Box>
                        <Box w="full" >
                        <Input
                            placeholder="First Name"
                            type="text"
                            onChange={(e) => setFirstName(e.target.value)}
                            bg="#2c2e3b"
                            border="none"
                            rounded="lg"
                            p="6"
                            value={firstName}
                        />
                        </Box>
                        <Box w="full" >
                        <Input
                            placeholder="Last Name"
                            type="text"
                            onChange={(e) => setLastName(e.target.value)}
                            bg="#2c2e3b"
                            border="none"
                            rounded="lg"
                            p="6"
                            value={lastName}
                        />
                        </Box>
                    </Flex>
                </Flex>   
            <Box w="full">
                <Button w="full" padding="6" color={'white'} bg="purple.700" _hover={{ bg: 'purple.800' }} transition="all 0.3s">
                    Save Changes
                </Button>
            </Box>
            </Box>
        </Flex>
    )
}

export default Profile
