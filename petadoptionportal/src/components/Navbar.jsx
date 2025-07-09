import { Link as RouterLink } from 'react-router-dom'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Avatar,
  Text,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useAuth } from '../context/AuthContext'

const Links = [
  { name: 'Home', path: '/' },
  { name: 'Adopt', path: '/adopt' },
  { name: 'Community', path: '/community' },
  { name: 'Lost & Found', path: '/lost-found' },
]

function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  return (
    <Box bg={useColorModeValue('white', 'gray.900')} px={4} boxShadow="sm">
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <IconButton
          size={'md'}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={'Open Menu'}
          display={{ md: 'none' }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={'center'}>
          <Box fontWeight="bold" fontSize="xl">PetConnect</Box>
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {Links.map((link) => (
              <RouterLink key={link.name} to={link.path}>
                <Button variant="ghost">{link.name}</Button>
              </RouterLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={'center'}>
          {isAuthenticated ? (
            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}
              >
                <HStack>
                  <Avatar
                    size={'sm'}
                    src={user?.avatar}
                    name={`${user?.firstName} ${user?.lastName}`}
                  />
                  <Text display={{ base: 'none', md: 'flex' }}>
                    {user?.firstName}
                  </Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem as={RouterLink} to="/profile">Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Stack direction={'row'} spacing={4}>
              <Button as={RouterLink} to="/signin" variant={'ghost'}>
                Sign In
              </Button>
              <Button
                as={RouterLink}
                to="/signup"
                colorScheme={'blue'}
                variant={'solid'}
              >
                Sign Up
              </Button>
            </Stack>
          )}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: 'none' }}>
          <Stack as={'nav'} spacing={4}>
            {Links.map((link) => (
              <RouterLink key={link.name} to={link.path}>
                <Button variant="ghost" width="full" justifyContent="flex-start">
                  {link.name}
                </Button>
              </RouterLink>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Box>
  )
}

export default Navbar 