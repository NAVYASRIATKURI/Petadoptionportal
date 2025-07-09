import Adoption from '../models/adoptionModel.js';
import Pet from '../models/petModel.js';

// @desc    Get all adoptions
// @route   GET /api/adoptions
// @access  Private
export const getAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find()
      .populate('pet', 'name species breed image')
      .populate('adopter', 'firstName lastName email')
      .populate('shelter', 'firstName lastName email');
    
    res.json(adoptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user adoptions
// @route   GET /api/adoptions/user
// @access  Private
export const getUserAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find({ adopter: req.user._id })
      .populate('pet', 'name species breed image')
      .populate('shelter', 'firstName lastName email');
    
    res.json(adoptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get shelter adoptions
// @route   GET /api/adoptions/shelter
// @access  Private
export const getShelterAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find({ shelter: req.user._id })
      .populate('pet', 'name species breed image')
      .populate('adopter', 'firstName lastName email');
    
    res.json(adoptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single adoption
// @route   GET /api/adoptions/:id
// @access  Private
export const getAdoptionById = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('pet', 'name species breed image')
      .populate('adopter', 'firstName lastName email')
      .populate('shelter', 'firstName lastName email');
    
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption not found' });
    }
    
    res.json(adoption);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create adoption request
// @route   POST /api/adoptions
// @access  Private
export const createAdoption = async (req, res) => {
  try {
    const { petId, notes } = req.body;
    
    // Check if pet exists
    const pet = await Pet.findById(petId);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }
    
    // Check if pet is available
    if (!pet.isAvailable) {
      return res.status(400).json({ message: 'Pet is not available for adoption' });
    }
    
    // Create adoption request
    const adoption = await Adoption.create({
      pet: petId,
      adopter: req.user._id,
      shelter: pet.shelter,
      notes
    });
    
    res.status(201).json(adoption);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update adoption status
// @route   PUT /api/adoptions/:id
// @access  Private
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const adoption = await Adoption.findById(req.params.id);
    
    if (!adoption) {
      return res.status(404).json({ message: 'Adoption not found' });
    }
    
    // Make sure user is the shelter
    if (adoption.shelter.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    adoption.status = status;
    
    // If adoption is completed, update pet availability
    if (status === 'Completed') {
      await Pet.findByIdAndUpdate(adoption.pet, { isAvailable: false });
    }
    
    const updatedAdoption = await adoption.save();
    
    res.json(updatedAdoption);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 