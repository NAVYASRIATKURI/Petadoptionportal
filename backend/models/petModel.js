import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: String, required: true },
  gender: { type: String, required: true },
  size: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Pet', petSchema);