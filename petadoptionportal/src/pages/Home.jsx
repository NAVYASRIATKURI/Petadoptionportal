import { Link as RouterLink } from 'react-router-dom'
import {
  Container,
  Stack,
  Flex,
  Box,
  Heading,
  Text,
  Button,
  Image,
  Icon,
  createIcon,
  useColorModeValue,
  SimpleGrid,
  VStack,
  Center,
  useToast,
  Modal,           // Added
  ModalOverlay,    // Added
  ModalContent,    // Added
  ModalBody,       // Added
  ModalCloseButton // Added
} from '@chakra-ui/react'
import { FaHeart, FaHome, FaPaw } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import { petAPI } from '../services/api'
import PetDetails from '../components/PetDetails'  // Added

function FeaturedPetCard({ pet }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        rounded="lg"
        shadow="sm"
        overflow="hidden"
        borderWidth="1px"
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Image
          src={pet.image}
          alt={pet.name}
          h="48"
          w="full"
          objectFit="cover"
        />
        <Box p={6}>
          <Heading size="md" mb={2}>{pet.name}</Heading>
          <Text color="gray.600" mb={4}>{pet.breed} • {pet.location}</Text>
          <Button
            w="full"
            colorScheme="pink"
            onClick={() => setIsOpen(true)}
            _hover={{ bg: 'pink.500' }}
          >
            Learn More
          </Button>
        </Box>
      </Box>

      {/* Pet Details Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={6}>
            <PetDetails pet={pet} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

function StatCard({ icon: IconComponent, number, text }) {
  return (
    <VStack
      bg={useColorModeValue('white', 'gray.700')}
      p={8}
      rounded="lg"
      shadow="sm"
      spacing={4}
    >
      <Icon as={IconComponent} boxSize={8} color="pink.400" />
      <Heading size="lg">{number}</Heading>
      <Text color="gray.600" textAlign="center">{text}</Text>
    </VStack>
  )
}

function Home() {
  const [featuredPets, setFeaturedPets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const response = await petAPI.getAllPets()
        // Get the first 4 pets as featured pets
        setFeaturedPets(response.data.slice(0, 4))
      } catch (error) {
        toast({
          title: 'Error fetching pets',
          description: 'Could not load featured pets',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeaturedPets()
  }, [toast])

  return (
    <>
      <Box>
        {/* Hero Section */}
        <Container maxW="7xl" py={{ base: 20, md: 28 }}>
          <Stack
            align="center"
            spacing={{ base: 8, md: 10 }}
            direction={{ base: 'column', md: 'row' }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '4xl', lg: '6xl' }}
              >
                <Text
                  as="span"
                  position="relative"
                  _after={{
                    content: "''",
                    width: 'full',
                    height: '30%',
                    position: 'absolute',
                    bottom: 1,
                    left: 0,
                    bg: 'pink.400',
                    zIndex: -1,
                  }}
                >
                  Find Your Perfect
                </Text>
                <br />
                <Text as="span" color="pink.400">
                  Furry Friend
                </Text>
              </Heading>
              <Text color="gray.500">
                PetConnect helps you find your perfect companion from local shelters
                and rescue organizations. Give a loving home to a pet in need and make
                a lifelong friend.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: 'column', sm: 'row' }}
              >
                <Button
                  as={RouterLink}
                  to="/adopt"
                  rounded="full"
                  size="lg"
                  fontWeight="normal"
                  px={6}
                  colorScheme="pink"
                  bg="pink.400"
                  _hover={{ bg: 'pink.500' }}
                >
                  Adopt Now
                </Button>
                <Button
                  as={RouterLink}
                  to="/lost-found"
                  rounded="full"
                  size="lg"
                  fontWeight="normal"
                  px={6}
                  leftIcon={<PlayIcon h={4} w={4} color="gray.300" />}
                >
                  Lost & Found
                </Button>
              </Stack>
            </Stack>
            <Flex flex={1} justify="center" align="center" position="relative" w="full">
              <Box
                position="relative"
                height="300px"
                rounded="2xl"
                boxShadow="2xl"
                width="full"
                overflow="hidden"
              >
                <Image
                  alt="Hero Image"
                  fit="cover"
                  align="center"
                  w="100%"
                  h="100%"
                  src="https://images.unsplash.com/photo-1544568100-847a948585b9"
                />
              </Box>
            </Flex>
          </Stack>
        </Container>

        {/* Featured Pets Section */}
        <Box bg="white" py={16}>
          <Container maxW="7xl">
            <Heading textAlign="center" mb={12}>Featured Pets</Heading>
            {isLoading ? (
              <Center>
                <Text>Loading featured pets...</Text>
              </Center>
            ) : (
              <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={8}>
                {featuredPets.map((pet) => (
                  <FeaturedPetCard key={pet._id} pet={pet} />
                ))}
              </SimpleGrid>
            )}
          </Container>
        </Box>

        {/* Statistics Section */}
        <Box bg="gray.50" py={16}>
          <Container maxW="7xl">
            <VStack spacing={8} maxW="3xl" mx="auto">
              <Heading textAlign="center">Did You Know?</Heading>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
                <StatCard
                  icon={FaHeart}
                  number="6.5 Million"
                  text="Pets enter shelters every year in the United States"
                />
                <StatCard
                  icon={FaHome}
                  number="2.7 Million"
                  text="Shelter pets are adopted each year"
                />
                <StatCard
                  icon={FaPaw}
                  number="1 Adoption"
                  text="Can change both a pet's and person's life forever"
                />
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* Call to Action Section */}
        <Box bg="pink.400" color="white" py={16}>
          <Container maxW="7xl">
            <Center>
              <VStack spacing={6} textAlign="center">
                <Heading size="2xl">Ready to Find Your Perfect Companion?</Heading>
                <Text fontSize="xl">
                  Start your journey to pet adoption today and give a loving home to a pet in need.
                </Text>
                <Button
                  as={RouterLink}
                  to="/adopt"
                  size="lg"
                  bg="white"
                  color="pink.400"
                  px={8}
                  _hover={{ bg: 'gray.100' }}
                  rounded="full"
                >
                  Browse Pets
                </Button>
              </VStack>
            </Center>
          </Container>
        </Box>
      </Box>
      <Footer />
    </>
  )
}

const PlayIcon = createIcon({
  displayName: 'PlayIcon',
  viewBox: '0 0 58 58',
  d: 'M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z',
})

export default Home