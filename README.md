## Reaidy Fuzzy Search Autocomplete (MERN)
<img width="1690" height="873" alt="image" src="https://github.com/user-attachments/assets/9b1a4eb5-9983-4cb3-b418-d05e7e0b8fc7" />


This is a minimal MERN demonstration of a **fuzzy search with autocomplete** experience using:

- **React** + **React Router** on the frontend
- **Node.js / Express.js** + **Mongoose** on the backend
- **MongoDB** for persistence with text/regex search
- **Fuse.js** for in-memory fuzzy matching

### Search Algorithm & Thresholds

- **Primary query**: `GET /api/search?q=...`
  - If `q` is empty after trimming, an empty list is returned.
  - MongoDB is queried first with a **case‑insensitive regex** on the `name` field:
    - `{ name: { $regex: q, $options: "i" } }`
    - Results are limited to **10** and used as the main suggestions.
- **Fuzzy fallback with Fuse.js**
  - All items are loaded into a Fuse.js index when the server boots.
  - Fuse configuration:
    - `keys`: `["name", "category", "description"]`
    - `includeScore: true`
    - `threshold: 0.4` (0 = exact, 1 = very fuzzy; `0.4` is a good balance for helpful fuzziness without noisy results).
  - If MongoDB returns fewer than **10** matches, Fuse is queried with the same `q`:
    - Up to **20** fuzzy matches are considered.
    - Any items not already in the MongoDB result set are appended until we have **10 suggestions** or we run out.
- **Item detail**
  - `GET /api/search/item/:slug` returns a single item document
  - The React app navigates to `/item/:slug` when the user selects a suggestion.

### UI & UX Notes

- The UI uses a **modern dark theme**:
  - Radial background gradients with **indigo + emerald** accent orbs.
  - A glassy card container with subtle borders and depth.
  - Rounded, pill‑shaped search input with hover/focus glow.
- Autocomplete behavior:
  - Debounced search (~180ms) as you type.
  - Dropdown suggestions with:
    - Item **name**
    - **Category pill**
    - Short **description** preview
  - Keyboard support:
    - **Arrow Up/Down** to move through suggestions
    - **Enter** to select
    - **Esc** to close the dropdown
  - Clear button and loading spinner integrated into the input.

### Running the App

1. **Install dependencies**

   ```bash
   # In /server
   cd server
   npm install

   # In /client
   cd ../client
   npm install
   ```

2. **Set up MongoDB**

   - Ensure MongoDB is running locally on `mongodb://127.0.0.1:27017`.
   - Optionally, create a `.env` file in `server`:

   ```bash
   MONGO_URI=mongodb://127.0.0.1:27017/fuzzy_search_demo
   PORT=5000
   ```

3. **Seed sample data**

   ```bash
   cd server
   npm run seed
   ```

4. **Run backend**

   ```bash
   cd server
   npm run dev
   ```

5. **Run frontend**

   ```bash
   cd client
   npm run dev
   ```

6. Open the app at `http://localhost:3000` and start typing in the search bar
   (e.g. “headphones”, “keyboard”, “candle”, “watch”, “bottle”).

