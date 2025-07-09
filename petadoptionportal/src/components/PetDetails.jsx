import React from 'react';
import {
  Box,
  Image,
  Text,
  VStack,
  Heading,
  Grid,
  GridItem,
  Badge,
  Divider,
} from '@chakra-ui/react';

function PetDetails({ pet }) {
  return (
    <Box p={6}>
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
    </Box>
  );
}

export default PetDetails;