const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

mongoose.model("Category", categorySchema);
