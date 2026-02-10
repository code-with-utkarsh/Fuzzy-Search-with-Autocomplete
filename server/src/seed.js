require("dotenv").config();
const mongoose = require("mongoose");
const Item = require("./models/Item");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/fuzzy_search_demo";

const sampleItems = [
  {
    name: "Midnight Blue Wireless Headphones",
    category: "Electronics",
    description:
      "Comfortable over-ear wireless headphones with noise cancellation and 30-hour battery life.",
    slug: "midnight-blue-wireless-headphones",
    imageUrl:
      "https://images.pexels.com/photos/159643/headphones-music-earphones-equipment-159643.jpeg",
  },
  {
    name: "Aurora Gradient Coffee Mug",
    category: "Home & Kitchen",
    description:
      "Ceramic coffee mug with a beautiful aurora-style gradient glaze and ergonomic handle.",
    slug: "aurora-gradient-coffee-mug",
    imageUrl:
      "https://images.pexels.com/photos/585750/pexels-photo-585750.jpeg",
  },
  {
    name: "Ocean Breeze Scented Candle",
    category: "Home Decor",
    description:
      "Soy wax candle with subtle ocean breeze notes, perfect for relaxing evenings.",
    slug: "ocean-breeze-scented-candle",
    imageUrl:
      "https://images.pexels.com/photos/2894200/pexels-photo-2894200.jpeg",
  },
  {
    name: "Skyline Minimal Desk Lamp",
    category: "Lighting",
    description:
      "Slim aluminum desk lamp with adjustable color temperature and touch controls.",
    slug: "skyline-minimal-desk-lamp",
    imageUrl:
      "https://images.pexels.com/photos/716398/pexels-photo-716398.jpeg",
  },
  {
    name: "Nebula Abstract Wall Art Print",
    category: "Art",
    description:
      "High-resolution print featuring deep-space nebula colors, perfect for modern interiors.",
    slug: "nebula-abstract-wall-art-print",
    imageUrl:
      "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg",
  },
  {
    name: "CloudSoft Cotton Throw Blanket",
    category: "Textiles",
    description:
      "Ultra-soft cotton throw blanket in muted pastel tones, ideal for sofas and beds.",
    slug: "cloudsoft-cotton-throw-blanket",
    imageUrl:
      "https://images.pexels.com/photos/3735915/pexels-photo-3735915.jpeg",
  },
  {
    name: "Sunrise Gradient Water Bottle",
    category: "Outdoors",
    description:
      "Insulated stainless steel bottle with sunrise gradient finish and leak-proof lid.",
    slug: "sunrise-gradient-water-bottle",
    imageUrl:
      "https://images.pexels.com/photos/1919305/pexels-photo-1919305.jpeg",
  },
  {
    name: "Luna Minimalist Wristwatch",
    category: "Accessories",
    description:
      "Minimalist analog watch with midnight dial, silver markers, and genuine leather strap.",
    slug: "luna-minimalist-wristwatch",
    imageUrl:
      "https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg",
  },
  {
    name: "Forest Trail Notebook Set",
    category: "Stationery",
    description:
      "Set of three dotted notebooks with forest-inspired covers and thick, bleed-resistant paper.",
    slug: "forest-trail-notebook-set",
    imageUrl:
      "https://images.pexels.com/photos/951240/pexels-photo-951240.jpeg",
  },
  {
    name: "PixelWave Mechanical Keyboard",
    category: "Electronics",
    description:
      "Compact mechanical keyboard with hot-swappable switches and customizable RGB underglow.",
    slug: "pixelwave-mechanical-keyboard",
    imageUrl:
      "https://images.pexels.com/photos/2047905/pexels-photo-2047905.jpeg",
  },
  {
    name: "Velvet Night Reading Chair",
    category: "Furniture",
    description:
      "Low-profile lounge chair with deep navy upholstery and soft lumbar support, ideal for reading corners.",
    slug: "velvet-night-reading-chair",
    imageUrl:
      "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
  },
  {
    name: "Glacier Glass Side Table",
    category: "Furniture",
    description:
      "Minimal glass side table with frosted edge detail and matte steel frame.",
    slug: "glacier-glass-side-table",
    imageUrl:
      "https://images.pexels.com/photos/279719/pexels-photo-279719.jpeg",
  },
  {
    name: "SolarFlare Desk Organizer",
    category: "Office",
    description:
      "Modular desk organizer with compartments for pens, notes, and devices in a warm gradient finish.",
    slug: "solarflare-desk-organizer",
    imageUrl:
      "https://images.pexels.com/photos/3746311/pexels-photo-3746311.jpeg",
  },
  {
    name: "Citrus Grove Diffuser Set",
    category: "Home Fragrance",
    description:
      "Essential oil diffuser set with bright citrus notes and frosted glass vessel.",
    slug: "citrus-grove-diffuser-set",
    imageUrl:
      "https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg",
  },
  {
    name: "Aurora Skyline Wall Clock",
    category: "Home Decor",
    description:
      "Silent sweeping wall clock with gradient dial inspired by northern lights.",
    slug: "aurora-skyline-wall-clock",
    imageUrl:
      "https://images.pexels.com/photos/701836/pexels-photo-701836.jpeg",
  },
  {
    name: "Nimbus Portable Bluetooth Speaker",
    category: "Electronics",
    description:
      "Compact speaker with 360° sound, IPX5 water resistance, and soft-touch exterior.",
    slug: "nimbus-portable-bluetooth-speaker",
    imageUrl:
      "https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg",
  },
  {
    name: "DawnLine Yoga Mat",
    category: "Fitness",
    description:
      "Non-slip yoga mat with sunrise gradient and cushioned support for daily flows.",
    slug: "dawnline-yoga-mat",
    imageUrl:
      "https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg",
  },
  {
    name: "Evergreen Stoneware Plant Pot",
    category: "Garden",
    description:
      "Matte stoneware pot with subtle speckle finish, perfect for indoor greenery.",
    slug: "evergreen-stoneware-plant-pot",
    imageUrl:
      "https://images.pexels.com/photos/6207817/pexels-photo-6207817.jpeg",
  },
  {
    name: "Cascade Double-Wall Glasses",
    category: "Home & Kitchen",
    description:
      "Set of double-wall glasses that keep drinks hot or cold while preventing condensation rings.",
    slug: "cascade-double-wall-glasses",
    imageUrl:
      "https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg",
  },
  {
    name: "Stratus Travel Backpack",
    category: "Travel",
    description:
      "Streamlined travel backpack with padded laptop sleeve, hidden pocket, and water‑repellent fabric.",
    slug: "stratus-travel-backpack",
    imageUrl:
      "https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg",
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    await Item.deleteMany({});
    console.log("Cleared existing items");

    await Item.insertMany(sampleItems);
    console.log(`Inserted ${sampleItems.length} items`);
  } catch (err) {
    console.error("Seed error", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();

