import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Lost', 'Found']
  },
  petName: {
    type: String,
    required: false
  },
  species: {  // Changed from petType to species
    type: String,
    required: true
  },
  breed: {
    type: String,
    required: false
  },
  color: {
    type: String,
    required: true
  },
  size: {
    type: String,
    required: true,
    enum: ['Small', 'Medium', 'Large']
  },
  location: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Open', 'Resolved'],
    default: 'Open'
  },
  // Adding contact information fields
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String,
    required: true
  }
}, { timestamps: true });

const LostFound = mongoose.model('LostFounds', lostFoundSchema); // Changed model name to 'LostFounds'
export default LostFound;