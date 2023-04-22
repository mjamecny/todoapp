import { Center, Icon, Link, Text } from '@chakra-ui/react'
import { FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <Center height="50px" flexDirection="column" mt="2rem">
      <Link href="https://github.com/mjamecny/todoapp" target="blank">
        <Icon as={FaGithub} boxSize={5} />
      </Link>
      <Text>&copy; 2023</Text>
    </Center>
  )
}
export default Footer
