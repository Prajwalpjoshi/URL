const express = require("express");
const router = express.Router();
const ShortURL = require("../models/urlSchema");

// Get all URLs
router.get("/", async (req, res) => {
  const shorturls = await ShortURL.find();
  res.render("index", { shorturls });
});

// Create a short URL or custom URL
router.post("/shortUrls", async (req, res) => {
  const url = req.body.full;
  const customShort = req.body.custom;

  let newShortURL;
  if (customShort && customShort.trim() !== "") {
    // Check if the custom short URL already exists
    const existingUrl = await ShortURL.findOne({ short: customShort });
    if (existingUrl) {
      return res.send(
        "Custom short URL already in use. Please try another one."
      );
    }

    newShortURL = new ShortURL({
      full: url,
      short: customShort,
    });
  } else {
    // If no custom short URL, use default generator
    newShortURL = new ShortURL({
      full: url,
    });
  }

  await newShortURL.save();
  console.log("Short URL Created", newShortURL);

  // Use app.locals.baseUrl to create a shareable link
  const shareableLink = `${req.app.locals.baseUrl}/${newShortURL.short}`;
  res.render("index", { shorturls: await ShortURL.find(), shareableLink });
});

// Redirect to the full URL
router.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortURL.findOne({ short: req.params.shortUrl });

  if (!shortUrl) {
    return res.sendStatus(404); // If no short URL is found
  }

  shortUrl.clicks++; // Increment the click count
  await shortUrl.save();

  res.redirect(shortUrl.full); // Redirect to the full URL
});

// Delete a URL
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await ShortURL.deleteOne({ _id: id });
    console.log("Deleted URL");
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
