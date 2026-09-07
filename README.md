# Heads Up Game V1

A free, mobile-first Heads Up-style guessing game built with plain HTML, CSS and JavaScript.

## Files
- `index.html` — game screens
- `style.css` — design
- `game.js` — game logic and custom word lists

## Run locally
Open `index.html` in a browser.

## GitHub Pages
1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, and `game.js`.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose `main` and `/ (root)`, then Save.
6. GitHub will provide your public website address.

## Customising words
Open `game.js` and edit the `WORDS` object.

Example:
`mycategory: ["Word 1", "Word 2", "Word 3"]`

Then add the category to the dropdown in `index.html`.

## Important
iPhone motion/orientation permissions generally need to be requested after the user taps a button, which is why V1 has an **ENABLE TILT CONTROLS** button.
