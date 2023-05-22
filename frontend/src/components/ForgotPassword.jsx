import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Spinner,
  Center,
} from '@chakra-ui/react'

import { useState } from 'react'

import { useLazyForgotPasswordQuery } from '../store'

const ForgotPassword = ({ onOpen, onClose, isOpen }) => {
  const toast = useToast()
  const [forgotPassword, result] = useLazyForgotPasswordQuery()
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await forgotPassword({ email })
    if (res.isSuccess) {
      toast({
        position: 'top',
        description: res.data.message,
        status: 'success',
        duration: 3000,
        isClosable: false,
      })
      setEmail('')
      onClose()
    } else {
      setEmail('')
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
    <Modal isCentered isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalHeader>Reset password</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl flex="1">
            <form onSubmit={handleSubmit}>
              <Flex align="center" justify="center" gap="1rem">
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="The email address you used to register"
                  required
                  w="60%"
                />
              </Flex>
              <Center mt="2rem">
                <Button type="submit">
                  {result.isLoading ? <Spinner /> : 'Submit'}
                </Button>
              </Center>
            </form>
          </FormControl>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
export default ForgotPassword
