const express = require("express");
const Fuse = require("fuse.js");
const Item = require("../models/Item");

const router = express.Router();

let fuse = null;
let fuseReady = false;

async function buildFuseIndex() {
  const items = await Item.find().lean();
  fuse = new Fuse(items, {
    keys: ["name", "category", "description"],
    includeScore: true,
    threshold: 0.4, // fuzzy-ness: 0 = exact, 1 = very fuzzy
  });
  fuseReady = true;
}

// Build index on startup
buildFuseIndex().catch((err) => {
  console.error("Failed to build Fuse index", err);
});

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res.json([]);
  }

  try {
    // First use MongoDB regex search for fast prefix-ish matches
    const mongoMatches = await Item.find({
      name: { $regex: q, $options: "i" },
    })
      .limit(10)
      .lean();

    let results = mongoMatches;

    // If not enough results, backfill with Fuse.js fuzzy matches
    if (results.length < 10 && fuseReady && fuse) {
      const fuseResults = fuse.search(q, { limit: 20 }).map((r) => r.item);

      const existingIds = new Set(results.map((r) => String(r._id)));
      for (const item of fuseResults) {
        if (!existingIds.has(String(item._id))) {
          results.push(item);
          if (results.length >= 10) break;
        }
      }
    }

    return res.json(
      results.slice(0, 10).map((item) => ({
        id: item._id,
        name: item.name,
        category: item.category,
        description: item.description,
        slug: item.slug,
        imageUrl: item.imageUrl,
      }))
    );
  } catch (err) {
    console.error("Search error", err);
    res.status(500).json({ error: "Search failed" });
  }
});

router.get("/all", async (_req, res) => {
  try {
    const items = await Item.find().sort({ name: 1 }).lean();
    return res.json(
      items.map((item) => ({
        id: item._id,
        name: item.name,
        category: item.category,
        description: item.description,
        slug: item.slug,
        imageUrl: item.imageUrl,
      }))
    );
  } catch (err) {
    console.error("Fetch all items error", err);
    res.status(500).json({ error: "Failed to load products" });
  }
});

router.get("/item/:slug", async (req, res) => {
  try {
    const item = await Item.findOne({ slug: req.params.slug }).lean();
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({
      id: item._id,
      name: item.name,
      category: item.category,
      description: item.description,
      slug: item.slug,
      imageUrl: item.imageUrl,
    });
  } catch (err) {
    console.error("Item fetch error", err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

module.exports = router;

