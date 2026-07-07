import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  specie:    { type: String, required: true },
  birthDate: { type: Date },
  adopted:   { type: Boolean, default: false },
  owner:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  image:     { type: String }
});

export const PetModel = mongoose.model('Pet', petSchema);
