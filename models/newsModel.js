const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const newsSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default: "https://images.yourstory.com/cs/2/b094ec506da611eab285b7ee8106293d/imageonline-co-logoadded14-1615436815377.jpg?fm=png&auto=format&ar=2:1&mode=crop&crop=face",
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    audio: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
    },
    uniqueId : {
        type : String,
        required : true,
        default : Date.now()
    },
    isImportant: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    mainArticleLink: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    mainArticlePublisher: {
      type: String,
      required: true,
      default: "",
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

mongoose.model("News", newsSchema);
