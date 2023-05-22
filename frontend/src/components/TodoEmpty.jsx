import { Flex, Text } from '@chakra-ui/react'

const TodoEmpty = () => {
  return (
    <Flex justify="center" align="center" height="35vh" flex="auto">
      <Text fontSize="3xl">Your list is empty</Text>
    </Flex>
  )
}
export default TodoEmpty
