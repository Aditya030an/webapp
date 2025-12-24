import mongoose from 'mongoose';

const expensesItemSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true }
  });
  
  const expensesSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    category: { type: String, required: true },
    notes: { type: String },
    expenses: [expensesItemSchema],
    total: { type: Number, required: true }
  }, {
    timestamps: true
  });
  
  const Expenses = mongoose.model('Expenses', expensesSchema);
  export default Expenses;