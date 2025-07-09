import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
  Image,
  useToast,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { lostFoundAPI } from '../services/api'

  // Mock data for lost and found pets
  const mockListings = [
    {
      id: 1,
      type: 'Lost',
      species: 'Dog',
      breed: 'Labrador',
      color: 'Yellow',
      size: 'Large',
      location: 'Central Park, New York',
      date: '2024-02-15',
      description: 'Lost my friendly Labrador near Central Park. He responds to Max and is wearing a blue collar.',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=724&q=80',
    },
    {
      id: 2,
      type: 'Found',
      species: 'Cat',
      breed: 'Tabby',
      color: 'Grey',
      size: 'Medium',
      location: 'Downtown LA',
      date: '2024-02-14',
      description: 'Found a friendly tabby cat wearing a red collar. Very affectionate and well-behaved.',
      image: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    },
  ]
  
  // Update the initial formData state in ReportForm
  function ReportForm() {
    const [formData, setFormData] = useState({
      type: 'Lost',
      species: '',
      breed: '',
      color: '',
      size: '',
      location: '',
      date: '',
      description: '',
      image: '',
      // Add contact fields
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const toast = useToast()
  
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
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      setIsSubmitting(true)
      try {
        await lostFoundAPI.createReport(formData)
        toast({
          title: 'Report submitted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        // Reset form
        setFormData({
          type: 'Lost',
          species: '',
          breed: '',
          color: '',
          size: '',
          location: '',
          date: '',
          description: '',
          image: '',
        })
      } catch (error) {
        toast({
          title: 'Error submitting report',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsSubmitting(false)
      }
    }
  
    return (
      <Box
        bg={useColorModeValue('white', 'gray.700')}
        p={8}
        rounded={'lg'}
        boxShadow={'lg'}
      >
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Heading size="lg">Report Lost/Found Pet</Heading>
          <RadioGroup
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value })}
          >
            <Stack direction="row">
              <Radio value="Lost">Lost Pet</Radio>
              <Radio value="Found">Found Pet</Radio>
            </Stack>
          </RadioGroup>
          <FormControl isRequired>
            <FormLabel>Species</FormLabel>
            <Select
              placeholder="Select species"
              value={formData.species}
              onChange={(e) =>
                setFormData({ ...formData, species: e.target.value })
              }
            >
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
              onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Color</FormLabel>
            <Input
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Size</FormLabel>
            <Select
              placeholder="Select size"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            >
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </Select>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Location</FormLabel>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Date</FormLabel>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Description</FormLabel>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Image URL</FormLabel>
            <Input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </FormControl>
          {/* Add Contact Information Section */}
          <Heading size="md" alignSelf="start" mt={4}>Contact Information</Heading>
          <FormControl isRequired>
            <FormLabel>Contact Name</FormLabel>
            <Input
              value={formData.contactName}
              onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Contact Phone</FormLabel>
            <Input
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Contact Email</FormLabel>
            <Input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            />
          </FormControl>
  
          <Button 
            type="submit" 
            colorScheme="blue" 
            w="full"
            isLoading={isSubmitting}
          >
            Submit Report
          </Button>
        </VStack>
      </Box>
    )
  }
  
  // Update the ListingCard component to include contact modal
  function ListingCard({ listing }) {
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
              src={listing.image}
              alt={`${listing.type} ${listing.species}`}
              objectFit={'cover'}
              h={'full'}
              w={'full'}
            />
          </Box>
          <Stack>
            <Text
              color={listing.type === 'Lost' ? 'red.500' : 'green.500'}
              textTransform={'uppercase'}
              fontWeight={800}
              fontSize={'sm'}
              letterSpacing={1.1}
            >
              {listing.type}
            </Text>
            <Text color={'gray.500'}>
              {listing.breed} • {listing.color} • {listing.size}
            </Text>
            <Text color={'gray.500'}>{listing.description}</Text>
          </Stack>
          <Stack mt={6} direction={'row'} spacing={4} align={'center'}>
            <Stack direction={'column'} spacing={0} fontSize={'sm'}>
              <Text fontWeight={600}>{listing.location}</Text>
              <Text color={'gray.500'}>{new Date(listing.date).toLocaleDateString()}</Text>
            </Stack>
          </Stack>
          <Button
            w={'full'}
            mt={8}
            bg={listing.type === 'Lost' ? 'red.400' : 'green.400'}
            color={'white'}
            rounded={'md'}
            _hover={{
              transform: 'translateY(-2px)',
              boxShadow: 'lg',
            }}
            onClick={() => setIsOpen(true)}
          >
            Contact
          </Button>
        </Box>
  
        {/* Contact Information Modal */}
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Contact Information</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <VStack align="start" spacing={4}>
                <Box>
                  <Text fontWeight="bold">Contact Name:</Text>
                  <Text>{listing.contactName}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Phone Number:</Text>
                  <Text>{listing.contactPhone}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{listing.contactEmail}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Location:</Text>
                  <Text>{listing.location}</Text>
                </Box>
              </VStack>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  }
  
  function LostAndFound() {
    const [listings, setListings] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const toast = useToast()
  
    useEffect(() => {
      const fetchListings = async () => {
        try {
          const response = await lostFoundAPI.getAllReports()
          setListings(response.data)
        } catch (error) {
          toast({
            title: 'Error fetching listings',
            description: 'Could not load lost and found listings',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        } finally {
          setIsLoading(false)
        }
      }
  
      fetchListings()
    }, [toast])
  
    return (
      <Container maxW={'7xl'} py={12}>
        <Flex direction={{ base: 'column', lg: 'row' }} gap={8}>
          <Box w={{ base: 'full', lg: '400px' }}>
            <ReportForm />
          </Box>
          <Box flex={1}>
            <Heading mb={8}>Recent Listings</Heading>
            {isLoading ? (
              <Center>
                <Text>Loading listings...</Text>
              </Center>
            ) : (
              <Grid
                templateColumns={{
                  base: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                  xl: 'repeat(3, 1fr)',
                }}
                gap={8}
              >
                {listings.map((listing) => (
                  <ListingCard key={listing._id} listing={listing} />
                ))}
              </Grid>
            )}
          </Box>
        </Flex>
      </Container>
    )
  }
  
  export default LostAndFound