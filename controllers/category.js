const mongoose = require("mongoose");
const Category = mongoose.model("Category");

let category = {};

category.addCategory = (req, res) => {
  try {
    const { name, description } = req.body;
    const categoryName = name.charAt(0).toUpperCase() + name.slice(1);
    const pattern = new RegExp("^" + categoryName);

    if (!name || !description) {
      return res.status(401).json({
        error: true,
        message: "Please fill all feilds",
      });
    }

    Category.findOne({ name: { $regex: pattern } }, { name: 0, description: 0 })
      .then((details) => {
        if (details) {
          return res.status(401).json({
            error: true,
            message: "This category already exists",
          });
        }

        const category = new Category({
          name: categoryName,
          description: description,
          postedBy: req.superAdmin._id,
        });

        category
          .save()
          .then((data) => {
            return res.status(200).json({
              error: false,
              message: "Category Added",
            });
          })
          .catch((error) => {
            return res.status(500).json({
              error: true,
              message: error.message,
            });
          });
      })
      .catch((error) => {
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

category.fetchCategory = (req, res) => {
  try {
    Category.find({}, { name: 1, _id: 1 })
      .then((details) => {
        return res.status(200).json({
          error: false,
          message: "Category Fetched",
          data: details,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

category.deleteCategory = (req, res) => {
  try {
    const { id } = req.body;
    Category.findByIdAndUpdate(
      { _id: id },
      { $set: { isActive: false } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        return res.status(200).json({
          error: false,
          message: "Category Delete",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          error: true,
          message: error.message,
        });
      });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
};

module.exports = category;
