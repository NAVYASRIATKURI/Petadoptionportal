// Remove these individual imports
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@chakra-ui/react';

import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Image,
  useColorModeValue,
  VStack,
  Center,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  Badge,
  Divider,
  GridItem,
  useToast,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { petAPI } from '../services/api'
import { AddIcon } from '@chakra-ui/icons'

function FilterSidebar({ filters, setFilters }) {
  return (
    <Stack spacing={4} w={'full'}>
      <Heading size="md">Filters</Heading>
      <Select
        placeholder="Species"
        value={filters.species}
        onChange={(e) => setFilters({ ...filters, species: e.target.value })}
      >
        <option value="Dog">Dog</option>
        <option value="Cat">Cat</option>
        <option value="Bird">Bird</option>
        <option value="Other">Other</option>
      </Select>
      <Select
        placeholder="Age"
        value={filters.age}
        onChange={(e) => setFilters({ ...filters, age: e.target.value })}
      >
        <option value="Baby">Baby</option>
        <option value="Young">Young</option>
        <option value="Adult">Adult</option>
        <option value="Senior">Senior</option>
      </Select>
      <Select
        placeholder="Size"
        value={filters.size}
        onChange={(e) => setFilters({ ...filters, size: e.target.value })}
      >
        <option value="Small">Small</option>
        <option value="Medium">Medium</option>
        <option value="Large">Large</option>
      </Select>
      <Select
        placeholder="Gender"
        value={filters.gender}
        onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </Select>
      <Input
        placeholder="Location"
        value={filters.location}
        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
      />
    </Stack>
  )
}

function PetCard({ pet }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Box
        maxW={'445px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'md'}
        p={6}
        overflow={'hidden'}
      >
        <Box h={'210px'} bg={'gray.100'} mt={-6} mx={-6} mb={6} pos={'relative'}>
          <Image
            src={pet.image}
            alt={pet.name}
            objectFit={'cover'}
            h={'full'}
            w={'full'}
          />
        </Box>
        <Stack>
          <Heading color={useColorModeValue('gray.700', 'white')} fontSize={'2xl'}>
            {pet.name}
          </Heading>
          <Text color={'gray.500'}>
            {pet.breed} • {pet.location}
          </Text>
        </Stack>
        <Button
          w={'full'}
          mt={8}
          bg={useColorModeValue('blue.400', 'blue.900')}
          color={'white'}
          rounded={'md'}
          _hover={{
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          onClick={() => setIsOpen(true)}
        >
          Learn More
        </Button>
      </Box>

      {/* Updated Modal with contact information */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody p={6}>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
              <GridItem>
                <Image
                  src={pet.image}
                  alt={pet.name}
                  borderRadius="lg"
                  objectFit="cover"
                  w="full"
                  h="400px"
                />
              </GridItem>
              <GridItem>
                <VStack align="start" spacing={4}>
                  <Heading size="xl">{pet.name}</Heading>
                  <Text fontSize="lg" color="gray.600">
                    {pet.breed} • {pet.age} • {pet.gender}
                  </Text>
                  <Badge colorScheme="green" fontSize="md">
                    {pet.size}
                  </Badge>
                  <Divider />
                  <Text fontSize="md">{pet.description}</Text>
                  <Divider />
                  <Box>
                    <Heading size="md" mb={2}>Contact Information</Heading>
                    <Text><strong>Name:</strong> {pet.contactName}</Text>
                    <Text><strong>Phone:</strong> {pet.contactPhone}</Text>
                    <Text><strong>Email:</strong> {pet.contactEmail}</Text>
                    <Text><strong>Location:</strong> {pet.location}</Text>
                  </Box>
                </VStack>
              </GridItem>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function AddPetModal({ isOpen, onClose }) {
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    gender: '',
    size: '',
    location: '',
    image: '',
    description: '',
    contactName: '',    // Added field
    contactPhone: '',   // Added field
    contactEmail: ''    // Added field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Update required fields to include contact information
    const requiredFields = [
      'name', 
      'species', 
      'breed', 
      'age', 
      'gender', 
      'size', 
      'location', 
      'image',
      'contactName',
      'contactPhone',
      'contactEmail'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      toast({
        title: 'Missing Required Fields',
        description: `Please fill in: ${missingFields.join(', ')}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      console.log('Submitting pet data:', formData); // Add this for debugging
      const response = await petAPI.createPet(formData);
      console.log('Server response:', response);
      
      toast({
        title: 'Success',
        description: 'Pet added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Error details:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add pet',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Put a Pet for Adoption</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {/* Basic Information */}
              <Heading size="sm">Pet Information</Heading>
              <FormControl isRequired>
                <FormLabel>Pet Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Species</FormLabel>
                <Select
                  value={formData.species}
                  onChange={(e) => setFormData({...formData, species: e.target.value})}
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Other">Other</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Breed</FormLabel>
                <Input
                  value={formData.breed}
                  onChange={(e) => setFormData({...formData, breed: e.target.value})}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Age</FormLabel>
                <Select
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                >
                  <option value="">Select Age</option>
                  <option value="Baby">Baby</option>
                  <option value="Young">Young</option>
                  <option value="Adult">Adult</option>
                  <option value="Senior">Senior</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Gender</FormLabel>
                <Select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Size</FormLabel>
                <Select
                  value={formData.size}
                  onChange={(e) => setFormData({...formData, size: e.target.value})}
                >
                  <option value="">Select Size</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Location</FormLabel>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="Enter image URL"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the pet"
                />
              </FormControl>

              {/* Contact Information */}
              <Heading size="sm" mt={4}>Contact Information</Heading>
              <FormControl isRequired>
                <FormLabel>Contact Name</FormLabel>
                <Input
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contact Phone</FormLabel>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Contact Email</FormLabel>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                />
              </FormControl>

              <Button type="submit" colorScheme="blue" mt={4}>
                Submit
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

function AdoptPet() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(true);
  const [allPets, setAllPets] = useState([]); 
  const [filteredPets, setPets] = useState([]);
  // Add filters state
  const [filters, setFilters] = useState({
    species: '',
    age: '',
    size: '',
    gender: '',
    location: ''
  });

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await petAPI.getAllPets();
        setAllPets(response.data);
        setPets(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching pets',
          description: 'Could not load pets',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPets();
  }, [toast]);

  // Add this new useEffect for handling filters
  useEffect(() => {
    let filtered = [...allPets];
    
    if (filters.species) {
      filtered = filtered.filter(pet => pet.species === filters.species);
    }
    if (filters.age) {
      filtered = filtered.filter(pet => pet.age === filters.age);
    }
    if (filters.size) {
      filtered = filtered.filter(pet => pet.size === filters.size);
    }
    if (filters.gender) {
      filtered = filtered.filter(pet => pet.gender === filters.gender);
    }
    if (filters.location) {
      filtered = filtered.filter(pet => 
        pet.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    setPets(filtered);
  }, [filters, allPets]);

  const checkAuth = (action) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to access this feature',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/signin');
      return false;
    }
    return true;
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
        <Box w={{ base: 'full', lg: '250px' }}>
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </Box>
        <Box flex={1}>
          <Flex justify="space-between" align="center" mb={8}>
            <Heading>Available Pets</Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => checkAuth() && onOpen()}
            >
              Add Pet
            </Button>
          </Flex>
          {isLoading ? (
            <Center>
              <Text>Loading pets...</Text>
            </Center>
          ) : (
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
              }}
              gap={6}
            >
              {filteredPets.map((pet) => (
                <PetCard key={pet._id} pet={pet} />
              ))}
            </Grid>
          )}
        </Box>
      </Flex>
      <AddPetModal isOpen={isOpen} onClose={onClose} />
    </Container>
  );
}

export default AdoptPet