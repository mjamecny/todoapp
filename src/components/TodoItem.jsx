import {
  Input,
  ListItem,
  FormControl,
  Tooltip,
  IconButton,
  Flex,
  Text,
} from '@chakra-ui/react'
import { CheckIcon, DeleteIcon, EditIcon } from '@chakra-ui/icons'

import {
  checkTodo,
  updateTodo,
  deleteTodo,
  editTodo,
  selectFilteredTodos,
} from '../store'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

const TodoItem = () => {
  const dispatch = useDispatch()
  const todos = useSelector(selectFilteredTodos)

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  return (
    <>
      {todos.map((todo) => {
        const { id, task, isCompleted, isEditing } = todo
        return (
          <ListItem key={id}>
            <Flex align="center" gap="1rem">
              <Flex align="center" gap=".25rem">
                <Tooltip hasArrow label="Delete">
                  <IconButton
                    size="sm"
                    onClick={() => dispatch(deleteTodo(id))}
                    aria-label="Delete"
                    icon={<DeleteIcon />}
                  />
                </Tooltip>
                <Tooltip hasArrow label="Edit">
                  <IconButton
                    isDisabled={isCompleted}
                    size="sm"
                    onClick={() => {
                      dispatch(editTodo(id))
                    }}
                    aria-label="Edit"
                    icon={<EditIcon />}
                  />
                </Tooltip>
                <Tooltip hasArrow label="Done">
                  <IconButton
                    isDisabled={isCompleted}
                    size="sm"
                    onClick={() => dispatch(checkTodo(id))}
                    aria-label="Check"
                    icon={<CheckIcon />}
                  />
                </Tooltip>
              </Flex>
              {isEditing ? (
                <FormControl>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      dispatch(editTodo(id))
                    }}
                  >
                    <Input
                      type="text"
                      size="md"
                      value={task}
                      onChange={(e) =>
                        dispatch(
                          updateTodo({
                            id,
                            task: e.target.value,
                          })
                        )
                      }
                    />
                  </form>
                </FormControl>
              ) : (
                <Text as={isCompleted ? 'del' : ''} fontSize="xl">
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
