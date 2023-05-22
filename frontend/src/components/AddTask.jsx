import {
  Button,
  Flex,
  FormControl,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useAddMutation } from '../store'

import { useAuthHeader } from 'react-auth-kit'

const AddTask = () => {
  const toast = useToast()
  const authHeader = useAuthHeader()
  const [task, setTask] = useState('')
  const [addTodo, { isLoading }] = useAddMutation()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!task) {
      toast({
        title: 'Please enter a task',
        status: 'warning',
        duration: 2000,
        isClosable: false,
        position: 'top',
      })
      return
    }

    const res = await addTodo({ task, token: authHeader() })

    setTask('')

    // if (isError) {
    //   toast({
    //     description: res.data.message,
    //     status: 'success',
    //     duration: 2000,
    //     isClosable: false,
    //     position: 'top',
    //   })
    // }
  }
  return (
    <FormControl>
      <form onSubmit={handleSubmit}>
        <Flex gap="1rem" mt="2rem" justify="center">
          <Input
            type="text"
            placeholder="Add task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            width="50%"
          />
          <Button onClick={handleSubmit}>
            {isLoading ? <Spinner /> : 'Add'}
          </Button>
        </Flex>
      </form>
    </FormControl>
  )
}
export default AddTask
