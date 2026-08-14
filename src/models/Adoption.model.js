import mongoose from 'mongoose';

// Una adopción une a un usuario (owner) con la mascota (pet) que adoptó.
// Guardamos referencias (ObjectId) a los otros modelos para poder hacer populate.
const adoptionSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    pet:   { type: mongoose.Schema.Types.ObjectId, ref: 'Pet',  required: true }
  },
  { timestamps: true } // agrega createdAt / updatedAt automáticamente
);

export const AdoptionModel = mongoose.model('Adoption', adoptionSchema);
