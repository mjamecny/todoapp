import {
  Center,
  Heading,
  IconButton,
  useColorMode,
  Icon,
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

import { FaCheckDouble } from 'react-icons/fa'

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <>
      <Center gap="1rem">
        <Icon as={FaCheckDouble} w={8} h={8} />
        <Heading>TODO APP</Heading>
      </Center>

      <Center mt="2rem">
        <IconButton
          textAlign="center"
          size="md"
          onClick={toggleColorMode}
          aria-label={
            colorMode === 'light'
              ? 'Change to dark mode'
              : 'Change to light mode'
          }
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        />
      </Center>
    </>
  )
}
export default Header
