import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    serialNumber: {
      type: String,
      unique: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Item = mongoose.model("Item", itemSchema);

export default Item;