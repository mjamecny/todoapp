import {
  Button,
  UnorderedList,
  Flex,
  useToast,
  Spinner,
  Center,
  Select,
  Heading,
  Text,
} from '@chakra-ui/react'

import { Link } from 'react-router-dom'

import { useRemoveAllMutation, useGetTodosQuery } from '../store'

import TodoItem from './TodoItem'
import TodoEmpty from './TodoEmpty'
import AddTask from './AddTask'

import { useAuthHeader, useIsAuthenticated } from 'react-auth-kit'

import { useState } from 'react'

const TodoList = () => {
  const isAuthenticated = useIsAuthenticated()
  const [filter, setFilter] = useState('all')
  const authHeader = useAuthHeader()
  const [removeAll, { isLoading: isRemoving }] = useRemoveAllMutation()
  const toast = useToast()
  const { todos, isFetching } = useGetTodosQuery(
    { token: authHeader() },
    {
      skip: !authHeader(),
      selectFromResult: ({ data, isFetching }) => {
        if (filter === 'active') {
          return {
            todos: data?.todos.filter((todo) => !todo.isCompleted) || [],
            isFetching,
          }
        } else if (filter === 'completed') {
          return {
            todos: data?.todos.filter((todo) => todo.isCompleted) || [],
            isFetching,
          }
        } else {
          return {
            todos: data?.todos || [],
            isFetching,
          }
        }
      },
    }
  )

  const handleRemoveAll = async () => {
    const res = await removeAll({ token: authHeader() })
    toast({
      description: 'All TODOs removed from your list',
      status: 'success',
      duration: 2000,
      isClosable: false,
      position: 'top',
    })
  }

  return !isAuthenticated() ? (
    <Flex flexDirection="column" justify="center" align="center" flex="1">
      <Heading>Welcome to TODO app</Heading>
      <Text>Make a list of todos</Text>
      {!isAuthenticated() && (
        <Flex mt="2rem" gap="1rem">
          <Link to="/login">
            <Button>Login</Button>
          </Link>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </Flex>
      )}
    </Flex>
  ) : (
    <>
      <AddTask />
      <Select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        mt="1rem"
        width="50%"
        alignSelf="center"
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="active">Uncompleted</option>
      </Select>
      {isFetching ? (
        <Center height="75vh">
          <Spinner size="xl" />
        </Center>
      ) : todos.length === 0 ? (
        <TodoEmpty />
      ) : (
        <Flex flexDirection="column" mt="2rem" flex="1">
          <Button alignSelf="center" onClick={handleRemoveAll}>
            {isRemoving ? <Spinner /> : 'Delete all'}
          </Button>

          <UnorderedList listStyleType="none" mt="2rem">
            <Flex
              gap="1rem"
              flexDirection="column"
              overflowY="scroll"
              height="400px"
            >
              <TodoItem todos={todos} />
            </Flex>
          </UnorderedList>
        </Flex>
      )}
    </>
  )
}
export default TodoList
