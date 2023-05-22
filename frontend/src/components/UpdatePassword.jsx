import {
  Button,
  Flex,
  FormControl,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react'

import { useUpdatePasswordMutation } from '../store'

import { useAuthHeader, useSignOut } from 'react-auth-kit'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

const UpdatePassword = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const signOut = useSignOut()
  const authHeader = useAuthHeader()
  const [passwordCurrent, setPasswordCurrent] = useState('')
  const [password, setPassword] = useState('')
  const [updatePassword, result] = useUpdatePasswordMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await updatePassword({
      token: authHeader(),
      password,
      passwordCurrent,
    })

    if (res.error) {
      toast({
        position: 'top',
        description: res.error.data.message,
        status: 'error',
        duration: 3000,
        isClosable: false,
      })
    } else {
      toast({
        position: 'top',
        description:
          'Password updated successfully. Please log in with new password.',
        status: 'success',
        duration: 3000,
        isClosable: false,
      })

      setPasswordCurrent('')
      setPassword('')
      signOut()
      navigate('/login')
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
              id="passwordCurrent"
              name="passwordCurrent"
              value={passwordCurrent}
              placeholder="Current Password"
              onChange={(e) => setPasswordCurrent(e.target.value)}
              type="password"
              required
              w={{ base: '80%', md: '40%' }}
            />
            <Input
              size="lg"
              id="password"
              name="password"
              value={password}
              placeholder="New Password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              w={{ base: '80%', md: '40%' }}
            />
            <Button type="submit">
              {result.isLoading ? <Spinner /> : 'Submit'}
            </Button>
          </Flex>
        </form>
      </FormControl>
    </>
  )
}
export default UpdatePassword
