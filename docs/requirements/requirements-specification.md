# Requirements Specification — DVD Shelf Database

## 1. Introduction

### 1.1 Purpose

The DVD Shelf Database is a lightweight, static web application that transforms a physical DVD shelf photograph into a searchable, categorized dataset. It allows users to browse, search, and filter their personal DVD collection without requiring a backend server or database.

### 1.2 Scope

The application covers:

- Display of a personal DVD collection extracted from a shelf image
- Text-based search and filter capabilities (genre, year)
- Individual detail views for each DVD record
- Static deployment (e.g. GitHub Pages) with no server-side dependencies

### 1.3 Definitions & Abbreviations

| Term             | Definition                                                  |
|------------------|-------------------------------------------------------------|
| DVD record       | A single entry in `data/dvds.json` representing one DVD     |
| Shelf position   | A label describing the physical location of a DVD on the shelf |
| Filter           | A UI control that narrows the displayed DVD list            |
| Static hosting   | Serving files directly without server-side processing       |

---

## 2. Overall Description

### 2.1 Product Perspective

The application is a self-contained, client-side web application. It reads a static JSON file at startup and renders all UI in the browser. There is no authentication, no persistent user state, and no backend API.

### 2.2 User Classes

| User Class       | Description                                                 |
|------------------|-------------------------------------------------------------|
| Collection owner | The person who owns the DVDs and maintains the dataset      |
| Visitor          | Anyone browsing the hosted site to explore the collection   |

### 2.3 Operating Environment

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Served via any static file server (GitHub Pages, `python3 -m http.server`, etc.)
- No internet connection required after initial page load

### 2.4 Constraints

- Dataset is static JSON; changes require manual file edits
- No user accounts or access control
- No server-side logic or database

---

## 3. Functional Requirements

### FR-01: Load DVD Dataset

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | On page load, the application fetches `data/dvds.json` and stores all records in memory. |
| Input       | HTTP GET request to `data/dvds.json`                         |
| Output      | In-memory array of DVD records available for rendering and filtering |

### FR-02: Display DVD List

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | Render all DVD records as a responsive grid of cards showing title, genre, year, shelf position, and a link to the detail view. |
| Input       | Array of (filtered) DVD records                              |
| Output      | DOM elements in the `#dvd-list` container                    |

### FR-03: Search by Title

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | A text input allows the user to type a partial title. The list filters in real time (on each keystroke) using case-insensitive substring matching. |
| Input       | User-typed search string                                     |
| Output      | Filtered DVD list matching the query                         |

### FR-04: Filter by Genre

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | A dropdown populated with all unique genre values from the dataset. Selecting a genre shows only DVDs with an exact genre match. |
| Input       | Selected genre value                                         |
| Output      | Filtered DVD list                                            |

### FR-05: Filter by Year

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | A dropdown populated with all unique year values (sorted descending). Selecting a year shows only DVDs released in that year. |
| Input       | Selected year value                                          |
| Output      | Filtered DVD list                                            |

### FR-06: Combine Filters

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | All active filters (search text, genre, year) are combined with AND logic. A DVD must satisfy every active filter to appear. |

### FR-07: Reset Filters

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | A reset button clears all filter inputs and displays the complete, unfiltered DVD list. |

### FR-08: Display Result Count

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Should have                                                  |
| Description | A counter shows the number of currently visible titles (e.g. "42 titles shown"). |

### FR-09: View DVD Detail

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | Clicking a DVD card's detail link navigates to `detail.html?id=<dvd-id>`. The detail page fetches the dataset, locates the record by ID, and displays all fields. |

### FR-10: Navigate Back to List

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | The detail page provides a back link to return to the main list. |

### FR-11: Display Source Image

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Nice to have                                                 |
| Description | If `assets/shelf.jpg` exists, show it in a source image panel. If missing, display a fallback message. |

### FR-12: Handle Missing DVD Gracefully

| Field       | Value                                                        |
|-------------|--------------------------------------------------------------|
| Priority    | Must have                                                    |
| Description | If the detail page is loaded without an `id` parameter or with an ID that does not exist in the dataset, a user-friendly error message is displayed. |

---

## 4. Non-Functional Requirements

### NFR-01: Performance

- The application must render the full list of up to several hundred DVDs without perceptible delay.
- Filter updates must feel instantaneous (< 100 ms perceived latency).

### NFR-02: Security

- All user-supplied and data-driven strings must be HTML-escaped before DOM insertion to prevent XSS.
- URL parameters must be encoded/decoded safely.

### NFR-03: Responsiveness

- The layout must adapt to screen widths from 320 px (mobile) to wide desktop.
- The filter bar collapses to a single column below 860 px.

### NFR-04: Accessibility

- Semantic HTML elements (`header`, `main`, `section`, `footer`, `label`).
- ARIA live regions for dynamically updated content.
- Proper form labels for all inputs.

### NFR-05: Portability

- Zero runtime dependencies — vanilla HTML, CSS, JavaScript only.
- Deployable on any static hosting platform without a build step.

---

## 5. Data Requirements

### DVD Record Schema

| Field            | Type        | Required | Description                          |
|------------------|-------------|----------|--------------------------------------|
| `id`             | string      | yes      | Unique identifier (e.g. `dvd-001`)   |
| `title`          | string      | yes      | Movie or series title                |
| `genre`          | string      | yes      | Genre label (may be multi-word)      |
| `year`           | number/null | no       | Release year; `null` if unknown      |
| `shelf_position` | string      | yes      | Physical shelf location descriptor   |
