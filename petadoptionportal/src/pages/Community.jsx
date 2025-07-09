import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
  Avatar,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Center,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  HStack,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaHeart, FaRegHeart, FaPaw, FaComment, FaShare } from 'react-icons/fa'
import { communityAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'


// Mock data for community posts
const mockPosts = [
  {
    id: 1,
    author: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
    },
    title: 'My First Day with Max',
    content: 'Just brought home my new Golden Retriever, Max! He\'s already making himself at home and bringing so much joy to our family.',
    type: 'Adoption Story',
    likes: 24,
    comments: 8,
    shares: 3,
    timestamp: '2 hours ago',
  },
  {
    id: 2,
    author: {
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=256&q=80',
    },
    title: 'Tips for New Pet Parents',
    content: 'Here are some essential tips for new pet parents: 1. Create a routine 2. Pet-proof your home 3. Find a good vet 4. Stock up on supplies',
    type: 'Tips & Advice',
    likes: 45,
    comments: 12,
    shares: 15,
    timestamp: '5 hours ago',
  },
]

function CreatePostModal({ isOpen, onClose }) {
  const [postData, setPostData] = useState({
    title: '',
    type: '',
    content: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await communityAPI.createPost(postData)
      toast({
        title: 'Post created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error creating post',
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a Post</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={postData.title}
                onChange={(e) =>
                  setPostData({ ...postData, title: e.target.value })
                }
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Type</FormLabel>
              <Select
                placeholder="Select post type"
                value={postData.type}
                onChange={(e) =>
                  setPostData({ ...postData, type: e.target.value })
                }
              >
                <option value="Adoption Story">Adoption Story</option>
                <option value="Tips & Advice">Tips & Advice</option>
                <option value="Question">Question</option>
                <option value="Event">Event</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Content</FormLabel>
              <Textarea
                value={postData.content}
                onChange={(e) =>
                  setPostData({ ...postData, content: e.target.value })
                }
                size="sm"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button 
            colorScheme="blue" 
            mr={3} 
            onClick={handleSubmit}
            isLoading={isSubmitting}
          >
            Post
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function PostCard({ post }) {
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [pawReactions, setPawReactions] = useState([]);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const handleLike = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to like posts',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Temporary like functionality for demonstration
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    
    toast({
      title: isLiked ? 'Post unliked' : 'Post liked!',
      status: 'success',
      duration: 1000,
      isClosable: true,
    });
  };

  const handlePawReaction = (reactionType) => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to react to posts',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setPawReactions(prev => [...prev, { type: reactionType, timestamp: new Date() }]);
    toast({
      title: `${reactionType} reaction added!`,
      status: 'success',
      duration: 1000,
      isClosable: true,
    });
  };

  return (
    <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg" mb={4}>
      <Stack spacing={4}>
        <Flex justify="space-between" align="center">
          <Heading size="md">{post.title}</Heading>
          <Text color="gray.500">{post.type}</Text>
        </Flex>
        <Text>{post.content}</Text>
        <Flex justify="space-between" align="center">
          <Text color="gray.500">
            By {post.author?.firstName || 'Anonymous'} {post.author?.lastName || ''}
          </Text>
          <Text color="gray.500">
            {new Date(post.createdAt).toLocaleDateString()}
          </Text>
        </Flex>
        <Flex gap={4} align="center">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              icon={isLiked ? <FaHeart color="red" /> : <FaRegHeart />}
              onClick={handleLike}
              variant="ghost"
              aria-label="Like post"
            />
            <Text fontSize="sm" as="span" ml={2}>
              {likes}
            </Text>
          </motion.div>
          
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaPaw />}
              variant="ghost"
              aria-label="Add reaction"
              isDisabled={!isAuthenticated}
            />
            <MenuList>
              <MenuItem onClick={() => handlePawReaction('Helpful')}>
                🐾 Helpful Tip
              </MenuItem>
              <MenuItem onClick={() => handlePawReaction('Cute')}>
                🐱 Super Cute
              </MenuItem>
              <MenuItem onClick={() => handlePawReaction('Support')}>
                🐕 Support
              </MenuItem>
            </MenuList>
          </Menu>

          {pawReactions.length > 0 && (
            <HStack spacing={2}>
              {pawReactions.slice(-3).map((reaction, idx) => (
                <Badge
                  key={idx}
                  colorScheme={
                    reaction.type === 'Helpful' ? 'green' :
                    reaction.type === 'Cute' ? 'pink' : 'blue'
                  }
                >
                  {reaction.type === 'Helpful' ? '🐾' :
                   reaction.type === 'Cute' ? '🐱' : '🐕'}
                </Badge>
              ))}
            </HStack>
          )}
        </Flex>
      </Stack>
    </Box>
  );
}

function Community() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = (action) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a post',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      navigate('/signin');
      return false;
    }
    return true;
  };

  const handleCreatePost = () => {
    if (checkAuth()) {
      onOpen();
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await communityAPI.getAllPosts();
        setPosts(response.data);
      } catch (error) {
        toast({
          title: 'Error fetching posts',
          description: 'Could not load community posts',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  if (isLoading) {
    return (
      <Center>
        <Text>Loading posts...</Text>
      </Center>
    );
  }

  return (
    <Container maxW="container.lg" py={8}>
      <Stack spacing={8}>
        <Flex justify="space-between" align="center">
          <Heading>Community</Heading>
          <Button colorScheme="blue" onClick={handleCreatePost}>
            Create Post
          </Button>
        </Flex>
        <CreatePostModal isOpen={isOpen} onClose={onClose} />
        {posts.length === 0 ? (
          <Text textAlign="center">No posts yet. Be the first to share!</Text>
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </Stack>
    </Container>
  );
}

export default Community