import {
  Button,
  Flex,
  FormControl,
  Input,
  useToast,
  useDisclosure,
  Spinner,
} from '@chakra-ui/react'

import { useLazyLoginQuery } from '../store'

import { useSignIn } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useState } from 'react'

import ForgotPassword from './ForgotPassword'

const Login = () => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const navigate = useNavigate()
  const toast = useToast()
  const signIn = useSignIn()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, result] = useLazyLoginQuery()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await login({ email, password })

    if (res.isSuccess) {
      if (
        signIn({
          token: res.data.token,
          expiresIn: 1440,
          tokenType: 'Bearer',
          authState: {
            _id: res.data._id,
            username: res.data.username,
            email: res.data.email,
            role: res.data.role,
          },
          refreshToken: res.data.refreshToken, // Only if you are using refreshToken feature
          refreshTokenExpireIn: 1,
        })
      )
        toast({
          position: 'top',
          description: 'Login successfully',
          status: 'success',
          duration: 3000,
          isClosable: false,
        })
      setEmail('')
      setPassword('')
      navigate('/')
    } else {
      toast({
        position: 'top',
        description: res.error.data.message,
        status: 'error',
        duration: 3000,
        isClosable: false,
      })
    }
  }

  return (
    <>
      <FormControl flex="1">
        <form onSubmit={handleSubmit}>
          <Flex
            flexDirection="column"
            align="center"
            justify="center"
            gap="1rem"
            height="75vh"
          >
            <Input
              size="lg"
              id="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              w={{ base: '80%', md: '40%' }}
            />

            <Input
              size="lg"
              id="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              w={{ base: '80%', md: '40%' }}
            />
            <Button type="submit">
              {result.isLoading ? <Spinner /> : 'Login'}
            </Button>
            <Link onClick={onOpen}>Forgot password ?</Link>
          </Flex>
        </form>
      </FormControl>
      <ForgotPassword onOpen={onOpen} isOpen={isOpen} onClose={onClose} />
    </>
  )
}
export default Login
