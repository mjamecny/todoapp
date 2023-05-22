import {
  Center,
  Heading,
  IconButton,
  Button,
  useColorMode,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Flex,
  useToast,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from '@chakra-ui/react'

import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { FaCheckDouble, FaUser } from 'react-icons/fa'
import { BsBoxArrowRight } from 'react-icons/bs'

import { useLazyLogoutQuery, useRemoveCurrentUserMutation } from '../store'

import { Link } from 'react-router-dom'

import {
  useIsAuthenticated,
  useAuthUser,
  useSignOut,
  useAuthHeader,
} from 'react-auth-kit'

import { useRef } from 'react'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = useRef()
  const { colorMode, toggleColorMode } = useColorMode()
  const [removeCurrentUser] = useRemoveCurrentUserMutation()
  const isAuthenticated = useIsAuthenticated()
  const auth = useAuthUser()
  const signOut = useSignOut()
  const authHeader = useAuthHeader()
  const [logout] = useLazyLogoutQuery()
  const toast = useToast()

  const handleSignOut = async () => {
    const refreshToken = localStorage.getItem('_auth_refresh')
    const res = await logout({ authToken: authHeader(), refreshToken })

    if (res.isSuccess) {
      signOut()
      toast({
        title: 'Logged out',
        status: 'success',
        position: 'top',
        duration: 3000,
        isClosable: false,
      })
    }
  }

  const handleDeleteAccount = async () => {
    onClose()
    await removeCurrentUser({ token: authHeader(), id: auth()._id })
    signOut()
  }
  return (
    <>
      <Center gap="1rem">
        <Link to="/">
          <Icon as={FaCheckDouble} w={8} h={8} />
          <Heading>TODO APP</Heading>
        </Link>
      </Center>

      <Center mt="2rem" gap="1rem">
        <IconButton
          textAlign="center"
          size="md"
          onClick={toggleColorMode}
          aria-label={
            colorMode === 'light'
              ? 'Change to dark mode'
              : 'Change to light mode'
          }
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        />
        {isAuthenticated() && (
          <Flex gap=".5rem">
            <Menu>
              <MenuButton px={4} py={2} borderRadius="md" borderWidth="1px">
                <Flex align="center" gap=".5rem">
                  <FaUser /> {auth().username}
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuGroup title="User panel">
                  <MenuItem onClick={onOpen}>Delete account</MenuItem>
                  <Link to="/updatePassword">
                    <MenuItem>Change Password</MenuItem>
                  </Link>
                </MenuGroup>
              </MenuList>
            </Menu>
            <IconButton
              textAlign="center"
              size="md"
              onClick={handleSignOut}
              aria-label={
                colorMode === 'light'
                  ? 'Change to dark mode'
                  : 'Change to light mode'
              }
              icon={<Icon as={BsBoxArrowRight} />}
            />
          </Flex>
        )}
      </Center>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
        isCentered
      >
        <AlertDialogOverlay bg="blackAlpha.300" backdropFilter="blur(10px)">
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Account
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
export default Header
