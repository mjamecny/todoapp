import { Flex } from '@chakra-ui/react'

import AddTask from './components/AddTask'
import TodoList from './components/TodoList'
import Header from './components/Header'
import Footer from './components/Footer'

const App = () => {
  return (
    <Flex
      maxW="800px"
      margin="0 auto"
      mt="1rem"
      flexDirection="column"
      paddingX="1rem"
    >
      <Header />
      <AddTask />
      <TodoList />
      <Footer />
    </Flex>
  )
}

export default App
