import { Button, UnorderedList, Flex, Text } from '@chakra-ui/react'

import { deleteAll, selectFilteredTodos } from '../store'

import { useDispatch, useSelector } from 'react-redux'

import TodoItem from './TodoItem'
import TodoFilter from './TodoFilter'
import TodoEmpty from './TodoEmpty'

const TodoList = () => {
  const dispatch = useDispatch()
  const todos = useSelector(selectFilteredTodos)

  return (
    <>
      {todos.length !== 0 ? (
        <Flex flexDirection="column" mt="2rem">
          <Button alignSelf="center" onClick={() => dispatch(deleteAll())}>
            Delete all
          </Button>
          <TodoFilter />
          <UnorderedList listStyleType="none" mt="2rem">
            <Flex gap="1rem" flexDirection="column">
              <TodoItem />
            </Flex>
          </UnorderedList>
        </Flex>
      ) : (
        <TodoEmpty />
      )}
    </>
  )
}
export default TodoList
