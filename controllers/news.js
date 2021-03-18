const mongoose = require("mongoose");
const gTTS = require("gtts");
const fs = require("fs");
const News = mongoose.model("News");
const Category = mongoose.model("Category");

let news = {};

news.addNews = (req, res) => {
  try {
    const {
      photo,
      title,
      description,
      category,
      isImportant,
      isTrending,
      mainArticleLink,
      mainArticlePublisher,
    } = req.body;

    if (!photo || !title || !description || !category) {
      return res.status(401).json({
        error: true,
        message: "Fill all the feilds",
      });
    }

    let audio = null;

    News.findOne({ title: title }, { _id: 1 })
      .then((details) => {
        if (details) {
          return res.status(401).json({
            error: true,
            message: "This News already added",
          });
        }

        const gtts = new gTTS(`${title} ${description}`, "en");

        // const filePath = `../audios/${Date.now()}-output.mp3`;
        const filePath = `${Date.now()}output.mp3`;

        gtts.save(filePath, function (error, result) {
          if (error) {
            fs.unlinkSync(filePath);
            return res.status(500).json({
              error: true,
              message: "Something problem in audio conversion",
            });
          }
          fs.createWriteStream(filePath, function (error, fileData) {
            if (error) {
              fs.unlinkSync(filePath);
              return res.status(500).json({
                error: true,
                message: "Something problem in audio file access",
              });
            }
            console.log("under fs");
            const data = new FormData();
            data.append("file", fileData);
            data.append("upload_preset", "dukandari");
            data.append("cloud_name", "dkcwzsz7t");
            fetch("https://api.cloudinary.com/v1_1/dkcwzsz7t/image/upload", {
              headers: {
                "Content-Type": "audio/mpeg",
              },
              method: "post",
              body: data,
            })
              .then((res) => res.json())
              .then((data) => {
                audio = data.secure_url;
                fs.unlinkSync(filePath);
              })
              .catch((error) => {
                fs.unlinkSync(filePath);
                return res.status(500).json({
                  error: true,
                  message: error.message,
                });
              });
          });
        });

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
      .populate("category", "isActive _id name description")
      .populate("postedBy", "name email isActive _id uniqueId")
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

news.fetchAllNewsForUser = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    News.find({ isActive: true })
      .populate("category", "isActive _id name description")
      .populate("postedBy", "name email isActive _id uniqueId")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .then((data) => {
        if (data.length === 0) {
          return res.status(401).json({
            error: true,
            message: "News Not Found",
          });
        }
        return res.status(200).json({
          error: false,
          message: "News Fetched",
          data: data,
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

news.fetchStartupNewsForUser = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    Category.findOne(
      { $and: [{ isActive: true }, { name: "Startup News" }] },
      { _id: 1 }
    )
      .then((details) => {
        if (details === null) {
          return res.status(401).json({
            error: true,
            message: "Category Not Found",
          });
        }
        News.find({ $and: [{ isActive: true }, { category: details._id }] })
          .populate("category", "isActive _id name")
          .populate("postedBy", "name email isActive _id uniqueId")
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .then((data) => {
            if (data.length === 0) {
              return res.status(401).json({
                error: true,
                message: "News Not Found",
              });
            }

            return res.status(200).json({
              error: false,
              message: "News Fetched",
              data: data,
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

news.fetchBusinessNewsForUser = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    Category.findOne(
      { $and: [{ isActive: true }, { name: "Business News" }] },
      { _id: 1 }
    )
      .then((details) => {
        if (details === null) {
          return res.status(401).json({
            error: true,
            message: "Category Not Found",
          });
        }
        News.find({ $and: [{ isActive: true }, { category: details._id }] })
          .populate("category", "isActive _id name")
          .populate("postedBy", "name email isActive _id uniqueId")
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .then((data) => {
            if (data.length === 0) {
              return res.status(401).json({
                error: true,
                message: "News Not Found",
              });
            }

            return res.status(200).json({
              error: false,
              message: "News Fetched",
              data: data,
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

news.fetchFundingNewsForUser = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    Category.findOne(
      { $and: [{ isActive: true }, { name: "Funding News" }] },
      { _id: 1 }
    )
      .then((details) => {
        if (details === null) {
          return res.status(401).json({
            error: true,
            message: "Category Not Found",
          });
        }
        News.find({ $and: [{ isActive: true }, { category: details._id }] })
          .populate("category", "isActive _id name")
          .populate("postedBy", "name email isActive _id uniqueId")
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .then((data) => {
            if (data.length === 0) {
              return res.status(401).json({
                error: true,
                message: "News Not Found",
              });
            }

            return res.status(200).json({
              error: false,
              message: "News Fetched",
              data: data,
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

news.fetchAcquisitionNewsForUser = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    Category.findOne(
      { $and: [{ isActive: true }, { name: "Acquisition News" }] },
      { _id: 1 }
    )
      .then((details) => {
        if (details === null) {
          return res.status(401).json({
            error: true,
            message: "Category Not Found",
          });
        }
        News.find({ $and: [{ isActive: true }, { category: details._id }] })
          .populate("category", "isActive _id name")
          .populate("postedBy", "name email isActive _id uniqueId")
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .then((data) => {
            if (data.length === 0) {
              return res.status(401).json({
                error: true,
                message: "News Not Found",
              });
            }

            return res.status(200).json({
              error: false,
              message: "News Fetched",
              data: data,
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

news.fetchTrendingNewsForUser = (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const skip = parseInt(req.query.skip);

    News.find({ $and: [{ isActive: true }, { isTrending: true }] })
      .populate("category", "isActive _id name description")
      .populate("postedBy", "name email isActive _id uniqueId")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .then((data) => {
        if (data.length === 0) {
          return res.status(401).json({
            error: true,
            message: "News Not Found",
          });
        }
        return res.status(200).json({
          error: false,
          message: "News Fetched",
          data: data,
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

news.republishNews = (req, res) => {
  try {
    const { id } = req.body;
    News.findByIdAndUpdate(
      { _id: id },
      { $set: { isActive: true } },
      { new: true, useFindAndModify: false }
    )
      .then(() => {
        return res.status(200).json({
          error: false,
          message: "News Republished",
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

news.totalNews = (req, res) => {
  try {
    News.find({}, { _id: 1 })
      .countDocuments()
      .then((count) => {
        return res.status(200).json({
          error: false,
          message: "Total News Count Fetched",
          count: count,
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
