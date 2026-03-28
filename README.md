# DVD Shelf Database Example

This folder contains a lightweight, static web app that turns a DVD shelf photo into a searchable dataset.

## Included

- `data/dvds.json`: extracted DVD metadata with fields:
  - `title`
  - `genre`
  - `year`
  - `shelf_position`
- `index.html`: searchable overview with filter bar
- `detail.html`: dedicated detail page for each DVD record
- `app.js`, `detail.js`, `styles.css`: app logic and styling
- `assets/`: image folder for shelf photos

## Source image

Place your shelf image at:

- `assets/shelf.jpg`

The index page will auto-display it when present.

## Run locally

From this folder:

```bash
cd dvd_database
python3 -m http.server 8000
```

Open:

- http://localhost:8000/index.html

## Notes on extraction quality

- The dataset was created from the visible spines in the provided photo.
- A few entries are best-effort normalizations where spine text is partially occluded or blurred.
- You can refine any record directly in `data/dvds.json`.

## Publish to GitHub

Because the parent repository can ignore this folder, copy `dvd_database/` into a dedicated repository when you want to publish it.

Minimal steps:

```bash
mkdir dvd_database_repo
cp -R dvd_database/* dvd_database_repo/
cd dvd_database_repo
git init
git add .
git commit -m "Initial DVD shelf database example"
```
