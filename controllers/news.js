const mongoose = require("mongoose");
const News = mongoose.model("News");

let news = {};

news.addNews = (req, res) => {
  try {
    const {
      photo,
      title,
      description,
      audio,
      category,
      isImportant,
      isTrending,
      mainArticleLink,
      mainArticlePublisher,
    } = req.body;

    if (!photo || !title || !description || !audio || !category) {
      return res.status(401).json({
        error: true,
        message: "Fill all the feilds",
      });
    }

    News.findOne({ title: title }, { _id: 1 })
      .then((details) => {
        if (details) {
          return res.status(401).json({
            error: true,
            message: "This News already added",
          });
        }

        const news = new News({
          photo: photo,
          title: title,
          description: description,
          audio: audio,
          category: category,
          uniqueId: Date.now(),
          isImportant: isImportant,
          isTrending: isTrending,
          mainArticleLink: mainArticleLink,
          mainArticlePublisher: mainArticlePublisher,
          postedBy: req.superAdmin._id,
        });

        news
          .save()
          .then((data) => {
            return res.status(200).json({
              error: false,
              message: "News Added",
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

news.deleteNews = (req, res) => {
  try {
    const { id } = req.body;
    News.findByIdAndUpdate(
      { _id: id },
      { $set: { isActive: false } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        return res.status(200).json({
          error: false,
          message: "News Delete",
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

news.fetchNewsForAdmin = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    News.find({})
      .populate("category postedBy")
      .skip(skip)
      .limit(limit)
      .then((data) => {
        return res.status(200).json({
          error: false,
          message: "News Fetched",
          data: data.reverse(),
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

news.fetchNewsForUser = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    News.find({isActive: true})
      .populate("category postedBy")
      .skip(skip)
      .limit(limit)
      .then((data) => {
        return res.status(200).json({
          error: false,
          message: "News Fetched",
          data: data.reverse(),
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

module.exports = news;
