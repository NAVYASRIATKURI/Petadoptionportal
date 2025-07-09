import { Box, Container, SimpleGrid, Stack, Text, Link, Icon, useColorModeValue } from '@chakra-ui/react'
import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope, FaPhone } from 'react-icons/fa'
import { Link as RouterLink } from 'react-router-dom'

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight="semibold" color="white" mb={4}>
      {children}
    </Text>
  )
}

function Footer() {
  return (
    <Box bg="gray.900" color="gray.300">
      <Container maxW="7xl" py={12}>
        <SimpleGrid columns={{ base: 1, md: 4 }} spacing={8}>
          {/* About Section */}
          <Stack spacing={4}>
            <ListHeader>About PetConnect</ListHeader>
            <Text fontSize="sm">
              Connecting loving homes with pets in need since 2023.
            </Text>
          </Stack>

          {/* Quick Links Section */}
          <Stack spacing={4}>
            <ListHeader>Quick Links</ListHeader>
            <Link as={RouterLink} to="/" _hover={{ color: 'white' }}>
              Home
            </Link>
            <Link as={RouterLink} to="/adopt" _hover={{ color: 'white' }}>
              Adopt a Pet
            </Link>
            <Link as={RouterLink} to="/lost-found" _hover={{ color: 'white' }}>
              Lost and Found
            </Link>
            <Link as={RouterLink} to="/community" _hover={{ color: 'white' }}>
              Community
            </Link>
          </Stack>

          {/* Contact Section */}
          <Stack spacing={4}>
            <ListHeader>Contact</ListHeader>
            <Stack direction="row" spacing={2} align="center">
              <Icon as={FaEnvelope} />
              <Text fontSize="sm">info@petconnect.com</Text>
            </Stack>
            <Stack direction="row" spacing={2} align="center">
              <Icon as={FaPhone} />
              <Text fontSize="sm">(555) 123-4567</Text>
            </Stack>
          </Stack>

          {/* Social Media Section */}
          <Stack spacing={4}>
            <ListHeader>Follow Us</ListHeader>
            <Stack direction="row" spacing={4}>
              <Link href="#" _hover={{ color: 'white' }}>
                <Icon as={FaFacebookF} w={5} h={5} />
              </Link>
              <Link href="#" _hover={{ color: 'white' }}>
                <Icon as={FaTwitter} w={5} h={5} />
              </Link>
              <Link href="#" _hover={{ color: 'white' }}>
                <Icon as={FaInstagram} w={5} h={5} />
              </Link>
            </Stack>
          </Stack>
        </SimpleGrid>

        {/* Copyright Section */}
        <Box
          borderTopWidth={1}
          borderStyle="solid"
          borderColor="gray.800"
          pt={8}
          mt={8}
          textAlign="center"
        >
          <Text fontSize="sm">&copy; 2024 PetConnect. All rights reserved.</Text>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer 