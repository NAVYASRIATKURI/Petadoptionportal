import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Avatar,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useToast,
  Center,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { userAPI, adoptionAPI, communityAPI } from '../services/api'

// Mock user data
const mockUser = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '(555) 123-4567',
  address: '123 Main St, New York, NY 10001',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
}

const mockAdoptions = [
  {
    id: 1,
    petName: 'Max',
    species: 'Dog',
    breed: 'Golden Retriever',
    adoptionDate: '2024-01-15',
    status: 'Completed',
  },
  {
    id: 2,
    petName: 'Luna',
    species: 'Cat',
    breed: 'Siamese',
    adoptionDate: '2024-02-01',
    status: 'In Progress',
  },
]

const mockActivity = [
  {
    id: 1,
    type: 'Post',
    title: 'My First Day with Max',
    date: '2024-02-15',
    engagement: '24 likes • 8 comments',
  },
  {
    id: 2,
    type: 'Comment',
    title: 'Tips for New Pet Parents',
    date: '2024-02-14',
    engagement: '3 likes',
  },
]

function ProfileInformation() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    avatar: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  const handleSave = async () => {
    try {
      const response = await userAPI.updateProfile(userData)
      
      // Update local storage with new user data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
      const updatedUser = {
        ...currentUser,
        firstName: userData.firstName,
        lastName: userData.lastName
      }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Update state with response data
      setUserData({
        ...response.data,
        firstName: response.data.firstName || userData.firstName,
        lastName: response.data.lastName || userData.lastName
      })

      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      setIsEditing(false)
      
      // Force a page refresh to update the header
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await userAPI.getProfile()
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
        
        // Combine API response with local storage data
        setUserData({
          firstName: response.data.firstName || currentUser.firstName || '',
          lastName: response.data.lastName || currentUser.lastName || '',
          email: response.data.email || currentUser.email || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
          avatar: response.data.avatar || ''
        })
      } catch (error) {
        toast({
          title: 'Error fetching profile',
          description: 'Could not load user profile',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [toast])

  if (isLoading) {
    return <Center><Text>Loading profile...</Text></Center>
  }

  return (
    <Stack spacing={8}>
      <Flex align="center" direction={{ base: 'column', md: 'row' }} gap={8}>
        <Avatar size="2xl" src={userData.avatar} />
        <VStack align="start" flex={1}>
          <Heading size="lg">
            {userData.firstName} {userData.lastName}
          </Heading>
          <Text color="gray.500">{userData.email}</Text>
        </VStack>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </Button>
      </Flex>

      <Stack spacing={4}>
        {isEditing ? (
          <>
            <FormControl>
              <FormLabel>First Name</FormLabel>
              <Input
                value={userData.firstName}
                onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Last Name</FormLabel>
              <Input
                value={userData.lastName}
                onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                value={userData.phone}
                onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input
                value={userData.address}
                onChange={(e) => setUserData({ ...userData, address: e.target.value })}
              />
            </FormControl>
            <Button colorScheme="blue" onClick={handleSave}>
              Save Changes
            </Button>
          </>
        ) : (
          <>
            <Text><strong>Phone:</strong> {userData.phone || 'Not provided'}</Text>
            <Text><strong>Address:</strong> {userData.address || 'Not provided'}</Text>
          </>
        )}
      </Stack>
    </Stack>
  )
}

function AdoptionHistory() {
  const [adoptions, setAdoptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchAdoptions = async () => {
      try {
        const response = await adoptionAPI.getAllAdoptions()
        setAdoptions(response.data)
      } catch (error) {
        toast({
          title: 'Error fetching adoptions',
          description: 'Could not load adoption history',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAdoptions()
  }, [toast])

  if (isLoading) {
    return (
      <Center>
        <Text>Loading adoption history...</Text>
      </Center>
    )
  }

  return (
    <Stack spacing={4}>
      {adoptions.map((adoption) => (
        <Box
          key={adoption._id}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
        >
          <Flex justify="space-between" align="center">
            <Stack>
              <Heading size="md">{adoption.petName}</Heading>
              <Text color="gray.500">
                {adoption.species} • {adoption.breed}
              </Text>
              <Text fontSize="sm">
                Adoption Date: {new Date(adoption.adoptionDate).toLocaleDateString()}
              </Text>
            </Stack>
            <Badge
              colorScheme={adoption.status === 'Completed' ? 'green' : 'yellow'}
            >
              {adoption.status}
            </Badge>
          </Flex>
        </Box>
      ))}
    </Stack>
  )
}

function ActivityHistory() {
  const [activities, setActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await communityAPI.getAllPosts()
        // Filter posts by current user
        const userPosts = response.data.filter(post => post.author._id === localStorage.getItem('userId'))
        setActivities(userPosts.map(post => ({
          type: 'Post',
          title: post.title,
          date: post.createdAt,
          engagement: `${post.likes} likes • ${post.comments} comments`,
        })))
      } catch (error) {
        toast({
          title: 'Error fetching activities',
          description: 'Could not load activity history',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [toast])

  if (isLoading) {
    return (
      <Center>
        <Text>Loading activity history...</Text>
      </Center>
    )
  }

  return (
    <Stack spacing={4}>
      {activities.map((activity, index) => (
        <Box
          key={index}
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
        >
          <Stack>
            <Flex justify="space-between">
              <Badge colorScheme="blue">{activity.type}</Badge>
              <Text fontSize="sm" color="gray.500">
                {new Date(activity.date).toLocaleDateString()}
              </Text>
            </Flex>
            <Heading size="sm">{activity.title}</Heading>
            <Text fontSize="sm" color="gray.500">
              {activity.engagement}
            </Text>
          </Stack>
        </Box>
      ))}
    </Stack>
  )
}

function UserProfile() {
  return (
    <Container maxW="4xl" py={12}>
      <Tabs>
        <TabList>
          <Tab>Profile</Tab>
          <Tab>Adoptions</Tab>
          <Tab>Activity</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ProfileInformation />
          </TabPanel>
          <TabPanel>
            <AdoptionHistory />
          </TabPanel>
          <TabPanel>
            <ActivityHistory />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default UserProfile