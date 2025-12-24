import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
});

const inventorySchema = new mongoose.Schema(
  {
    items: [inventoryItemSchema],
    total: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Inventory = mongoose.model("InventoryReport", inventorySchema);
export default Inventory;
