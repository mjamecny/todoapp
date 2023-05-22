import {
  Input,
  ListItem,
  FormControl,
  Tooltip,
  IconButton,
  Flex,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'

import { useAuthHeader } from 'react-auth-kit'
import { useRemoveMutation, useUpdateMutation } from '../store'
import { useState } from 'react'

const TodoItem = ({ todos }) => {
  const authHeader = useAuthHeader()
  const [itemId, setItemId] = useState('')
  const [editedTodo, setEditedTodo] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [remove, { isLoading: isRemoving }] = useRemoveMutation()
  const [update, { isLoading: isUpdating }] = useUpdateMutation()
  const toast = useToast()

  const handleRemove = async (id) => {
    setItemId(id)
    await remove({ id, token: authHeader() })
    setItemId('')
    toast({
      description: 'TODO removed from your list',
      status: 'success',
      duration: 2000,
      isClosable: false,
      position: 'top',
    })
  }

  const handleCheck = async (id) => {
    setItemId(id)
    const res = await update({ id, token: authHeader() })
    setItemId('')
    toast({
      description: res.data.message,
      status: 'success',
      duration: 2000,
      isClosable: false,
      position: 'top',
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await update({
      id: editedTodo._id,
      token: authHeader(),
      task: editedTodo.task,
    })
    toast({
      description: res.data.message,
      status: 'success',
      duration: 2000,
      isClosable: false,
      position: 'top',
    })
    setIsEditing(false)
    setEditedTodo({})
  }

  return (
    <>
      {todos.map((todo) => {
        const { _id, task, isCompleted } = todo
        return (
          <ListItem key={_id}>
            <Flex align="center" gap="1rem">
              <Flex align="center" gap=".25rem">
                <Tooltip hasArrow label="Delete">
                  <IconButton
                    size="sm"
                    bg="red.500"
                    _hover={{ bg: 'red.600' }}
                    onClick={() => handleRemove(_id)}
                    aria-label="Delete"
                    icon={
                      isRemoving && _id === itemId ? (
                        <Spinner />
                      ) : (
                        <DeleteIcon />
                      )
                    }
                  />
                </Tooltip>
                <Tooltip hasArrow label="Edit">
                  <IconButton
                    isDisabled={isCompleted}
                    size="sm"
                    bg="yellow.500"
                    _hover={{ bg: 'yellow.600' }}
                    onClick={() => {
                      setItemId(_id)
                      setIsEditing(true)
                      setEditedTodo(...todos.filter((todo) => todo._id === _id))
                    }}
                    aria-label="Edit"
                    icon={<EditIcon />}
                  />
                </Tooltip>
                <Tooltip hasArrow label="Done">
                  <IconButton
                    isDisabled={isCompleted}
                    size="sm"
                    bg="green.500"
                    _hover={{ bg: 'green.600' }}
                    onClick={() => handleCheck(_id)}
                    aria-label="Check"
                    icon={
                      isUpdating && _id === itemId ? <Spinner /> : <CheckIcon />
                    }
                  />
                </Tooltip>
              </Flex>
              {isEditing && _id === itemId ? (
                <FormControl>
                  <form onSubmit={handleSubmit}>
                    <Input
                      type="text"
                      size="md"
                      value={editedTodo.task}
                      onChange={(e) =>
                        setEditedTodo((prevState) => {
                          return { ...prevState, task: e.target.value }
                        })
                      }
                    />
                  </form>
                </FormControl>
              ) : (
                <Text
                  as={isCompleted ? 'del' : ''}
                  fontSize={{ base: 'sm', md: 'xl' }}
                >
                  {task}
                </Text>
              )}
            </Flex>
          </ListItem>
        )
      })}
    </>
  )
}
export default TodoItem
