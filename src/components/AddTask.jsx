import { Button, Flex, FormControl, Input, useToast } from '@chakra-ui/react'
import { nanoid } from 'nanoid'
import { useDispatch, useSelector } from 'react-redux'
import { addTodo, setTask } from '../store'

const AddTask = () => {
  const dispatch = useDispatch()
  const { task } = useSelector((state) => state.app)
  const toast = useToast()

  const handleSubmit = (e) => {
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

    const newTodo = {
      id: nanoid(),
      task,
      isCompleted: false,
      isEditing: false,
    }

    dispatch(addTodo(newTodo))
    dispatch(setTask(''))
  }
  return (
    <FormControl>
      <form onSubmit={handleSubmit}>
        <Flex gap="1rem" mt="2rem">
          <Input
            type="text"
            placeholder="Add task"
            value={task}
            onChange={(e) => dispatch(setTask(e.target.value))}
          />
          <Button onClick={handleSubmit}>Add</Button>
        </Flex>
      </form>
    </FormControl>
  )
}
export default AddTask
