import Pet from '../models/petModel.js';

export const createPet = async (req, res) => {
  try {
    console.log('Received pet data:', req.body); // Add this for debugging
    const pet = await Pet.create({
      name: req.body.name,
      species: req.body.species,
      breed: req.body.breed,
      age: req.body.age,
      gender: req.body.gender,
      size: req.body.size,
      location: req.body.location,
      description: req.body.description,
      image: req.body.image,
      contactName: req.body.contactName,
      contactPhone: req.body.contactPhone,
      contactEmail: req.body.contactEmail
    });
    res.status(201).json(pet);
  } catch (error) {
    console.error('Error creating pet:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find()
      .select('name species breed age gender size location description image contactName contactPhone contactEmail')
      .sort({ createdAt: -1 });
    console.log('Retrieved pets:', pets); // Add this for debugging
    res.json(pets);
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ message: error.message });
  }
};