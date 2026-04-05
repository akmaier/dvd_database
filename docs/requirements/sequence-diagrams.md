# Sequence Diagrams — DVD Shelf Database

## SD-01: Initial Page Load & Rendering

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant app.js
    participant Server as Static Server

    User->>Browser: Open index.html
    Browser->>Server: GET index.html
    Server-->>Browser: HTML + CSS
    Browser->>Server: GET app.js
    Server-->>Browser: app.js

    activate app.js
    app.js->>Server: fetch("data/dvds.json")
    Server-->>app.js: JSON array (84 records)
    app.js->>app.js: populateFilterOptions()
    app.js->>app.js: bindEvents()
    app.js->>app.js: applyFilters() — no filters active
    app.js->>Browser: renderDvds(allDvds)
    deactivate app.js

    Browser-->>User: DVD grid + "84 titles shown"
```

---

## SD-02: Search & Filter Interaction

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant app.js
    participant State as state.filtered

    User->>Browser: Type "pirate" in search input
    Browser->>app.js: "input" event
    activate app.js
    app.js->>app.js: Read search, genre, year values
    app.js->>State: Filter allDvds (title contains "pirate")
    State-->>app.js: Matching subset
    app.js->>Browser: renderDvds(filtered)
    deactivate app.js
    Browser-->>User: Filtered grid + updated count

    User->>Browser: Select genre "Adventure Fantasy"
    Browser->>app.js: "change" event
    activate app.js
    app.js->>app.js: Read search, genre, year values
    app.js->>State: Filter allDvds (title + genre match)
    State-->>app.js: Narrowed subset
    app.js->>Browser: renderDvds(filtered)
    deactivate app.js
    Browser-->>User: Further filtered grid + updated count
```

---

## SD-03: View DVD Detail

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant detail.js
    participant Server as Static Server

    User->>Browser: Click "Open details" (dvd-002)
    Browser->>Server: GET detail.html?id=dvd-002
    Server-->>Browser: HTML + CSS
    Browser->>Server: GET detail.js
    Server-->>Browser: detail.js

    activate detail.js
    detail.js->>detail.js: Extract id from URL query string
    detail.js->>Server: fetch("data/dvds.json")
    Server-->>detail.js: JSON array
    detail.js->>detail.js: Find record where id === "dvd-002"
    detail.js->>Browser: renderDetail(dvd)
    deactivate detail.js

    Browser-->>User: Detail panel with all fields
```

---

## SD-04: Detail Page — Error Handling

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant detail.js
    participant Server as Static Server

    User->>Browser: Navigate to detail.html (no id param)
    Browser->>Server: GET detail.html
    Server-->>Browser: HTML + CSS

    activate detail.js
    detail.js->>detail.js: Extract id — null
    detail.js->>Browser: renderMessage("Missing DVD id in URL.")
    deactivate detail.js
    Browser-->>User: Error message displayed

    Note over User,Browser: Alternate: unknown ID

    User->>Browser: Navigate to detail.html?id=dvd-999
    activate detail.js
    detail.js->>Server: fetch("data/dvds.json")
    Server-->>detail.js: JSON array
    detail.js->>detail.js: Find record — not found
    detail.js->>Browser: renderMessage("DVD not found in dataset.")
    deactivate detail.js
    Browser-->>User: Error message displayed
```

---

## SD-05: Reset Filters

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant app.js

    User->>Browser: Click "Reset" button
    Browser->>app.js: "click" event on #reset-filters
    activate app.js
    app.js->>app.js: Clear search, genre, year values
    app.js->>app.js: applyFilters() — all filters empty
    app.js->>Browser: renderDvds(allDvds)
    deactivate app.js
    Browser-->>User: Full DVD grid restored
```
