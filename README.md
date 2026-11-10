# Sushi Spin Bar

A casual sushi restaurant management game for the browser. Build sushi from ingredient queues, send the plates down a conveyor belt, and serve each customer before their patience runs out.

Plain HTML, CSS and JavaScript. No build step, no dependencies, and no image files: all the artwork is inline SVG.

## Play

Open `index.html` in a browser, or serve the folder:

```sh
python3 -m http.server 8080
```

Then visit http://localhost:8080.

## How to play

1. Read each customer's order bubble: which sushi they want and how many.
2. Tap (or drag) ingredients from the five queues at the bottom to put them on the tray.
3. When the tray matches a recipe, the **MAKE** button turns green. Press it and the chef puts the sushi on the belt.
4. Tap a plate on the belt, then tap the customer who ordered it (or drag the plate onto them).
5. Finish whole orders quickly to earn coins and tips. If a customer runs out of patience, they walk out.

Keyboard: `1`–`5` take an ingredient · `Space` make · `Backspace` clear the tray · `Esc` pause.

## Recipes

| Sushi | Ingredients |
|---|---|
| Salmon Nigiri | Rice + Salmon |
| Tuna Nigiri | Rice + Tuna |
| Shrimp Nigiri | Rice + Shrimp |
| Salmon Roll | Rice + Salmon + Nori |
| Cucumber Roll | Rice + Cucumber + Nori |
| California Roll | Rice + Avocado + Cucumber + Nori |
| Spicy Tuna Roll | Rice + Tuna + Spicy Sauce + Nori |
| Ikura Gunkan | Rice + Salmon Roe + Nori |

## Levels

| Level | Customers | Recipes | Time | Coin goal |
|---|---|---|---|---|
| 1 | 2 | 3 | 1:30 | 45 |
| 2 | 3 | 4 | 1:40 | 80 |
| 3 | 4 | 6 | 1:50 | 120 |
| 4 | 5 | 7 | 2:00 | 150 |
| 5 | 5 | 8 | 2:00 | 170 |

After level 5 the game keeps going, with less patience and higher goals each level. Coin goals, patience, order sizes and queue speed are all set in the `LEVELS` table at the top of `game.js`.

## Files

- `index.html`: page structure
- `style.css`: layout, animations and UI styling
- `art.js`: all sushi, ingredient, character and icon artwork (SVG)
- `game.js`: game logic, levels, sound and screens
