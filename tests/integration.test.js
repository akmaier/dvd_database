/**
 * @jest-environment jsdom
 */
const fs = require("fs")
const path = require("path")

const indexHtml = fs.readFileSync(
  path.join(__dirname, "..", "index.html"),
  "utf-8"
)
const detailHtml = fs.readFileSync(
  path.join(__dirname, "..", "detail.html"),
  "utf-8"
)
const dvdsJs = fs.readFileSync(
  path.join(__dirname, "..", "data", "dvds.js"),
  "utf-8"
)
const appJs = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf-8")
const detailJs = fs.readFileSync(
  path.join(__dirname, "..", "detail.js"),
  "utf-8"
)

function setupIndexPage() {
  document.documentElement.innerHTML = indexHtml
  // Execute dvds.js to define DVD_DATA globally (replace const with var for global scope)
  eval(dvdsJs.replace(/^const /, "var "))
  // Execute app.js
  eval(appJs)
}

function setupDetailPage(queryString) {
  document.documentElement.innerHTML = detailHtml
  // Mock window.location.search
  delete window.location
  window.location = new URL("http://localhost/detail.html" + queryString)
  // Execute dvds.js
  eval(dvdsJs.replace(/^const /, "var "))
  // Execute detail.js
  eval(detailJs)
}

describe("index page integration", () => {
  beforeEach(() => {
    setupIndexPage()
  })

  test("renders all 84 DVD cards", () => {
    const cards = document.querySelectorAll("#dvd-list .dvd-card")
    expect(cards).toHaveLength(84)
  })

  test("shows correct result count", () => {
    const count = document.getElementById("result-count")
    expect(count.textContent).toBe("84 titles shown")
  })

  test("each card has a title, genre, year, and detail link", () => {
    const firstCard = document.querySelector("#dvd-list .dvd-card")
    expect(firstCard.querySelector("h3")).not.toBeNull()
    expect(firstCard.querySelector("a")).not.toBeNull()
    expect(firstCard.innerHTML).toContain("Genre:")
    expect(firstCard.innerHTML).toContain("Year:")
  })

  test("genre dropdown is populated with unique values", () => {
    const options = document.querySelectorAll("#genre-filter option")
    // First option is "All genres", rest are unique genre values
    expect(options.length).toBeGreaterThan(1)
    expect(options[0].value).toBe("")
    expect(options[0].textContent).toBe("All genres")
  })

  test("year dropdown is populated in descending order", () => {
    const options = Array.from(
      document.querySelectorAll("#year-filter option")
    ).slice(1) // skip "All years"
    const years = options.map((o) => Number(o.value))
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeLessThanOrEqual(years[i - 1])
    }
  })

  test("search filters the list", () => {
    const searchInput = document.getElementById("search-input")
    searchInput.value = "Big Fish"
    searchInput.dispatchEvent(new Event("input"))

    const cards = document.querySelectorAll("#dvd-list .dvd-card")
    expect(cards).toHaveLength(1)
    expect(cards[0].querySelector("h3").textContent).toBe("Big Fish")
  })

  test("genre filter narrows results", () => {
    const genreSelect = document.getElementById("genre-filter")
    genreSelect.value = "Horror"
    genreSelect.dispatchEvent(new Event("change"))

    const cards = document.querySelectorAll("#dvd-list .dvd-card")
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.length).toBeLessThan(84)
  })

  test("year filter narrows results", () => {
    const yearSelect = document.getElementById("year-filter")
    yearSelect.value = "2003"
    yearSelect.dispatchEvent(new Event("change"))

    const cards = document.querySelectorAll("#dvd-list .dvd-card")
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.length).toBeLessThan(84)
  })

  test("reset button clears all filters", () => {
    // Apply a filter first
    const searchInput = document.getElementById("search-input")
    searchInput.value = "Big Fish"
    searchInput.dispatchEvent(new Event("input"))
    expect(document.querySelectorAll("#dvd-list .dvd-card")).toHaveLength(1)

    // Reset
    document.getElementById("reset-filters").click()

    expect(searchInput.value).toBe("")
    expect(document.querySelectorAll("#dvd-list .dvd-card")).toHaveLength(84)
  })

  test("no results shows message", () => {
    const searchInput = document.getElementById("search-input")
    searchInput.value = "xyznonexistent"
    searchInput.dispatchEvent(new Event("input"))

    const cards = document.querySelectorAll("#dvd-list .dvd-card")
    expect(cards).toHaveLength(1)
    expect(cards[0].textContent).toContain("No results found")
  })

  test("result count shows singular for one result", () => {
    const searchInput = document.getElementById("search-input")
    searchInput.value = "Big Fish"
    searchInput.dispatchEvent(new Event("input"))

    const count = document.getElementById("result-count")
    expect(count.textContent).toBe("1 title shown")
  })

  test("detail link points to correct URL", () => {
    const link = document.querySelector("#dvd-list .dvd-card a")
    expect(link.getAttribute("href")).toMatch(/^detail\.html\?id=dvd-\d{3}$/)
  })
})

describe("detail page integration", () => {
  test("renders DVD detail for valid ID", () => {
    setupDetailPage("?id=dvd-001")

    const panel = document.querySelector(".detail-panel")
    expect(panel).not.toBeNull()
    expect(panel.querySelector("h2").textContent).toBe("Big Fish")
    expect(panel.innerHTML).toContain("Fantasy Drama")
    expect(panel.innerHTML).toContain("2003")
    expect(panel.innerHTML).toContain("dvd-001")
  })

  test("shows error for missing ID parameter", () => {
    setupDetailPage("")

    const panel = document.querySelector(".detail-panel")
    expect(panel.textContent).toContain("Missing DVD id in URL")
  })

  test("shows error for non-existent ID", () => {
    setupDetailPage("?id=dvd-999")

    const panel = document.querySelector(".detail-panel")
    expect(panel.textContent).toContain("DVD not found in dataset")
  })

  test("displays Unknown for DVD with null year", () => {
    setupDetailPage("?id=dvd-015") // Millennium has year: null

    const panel = document.querySelector(".detail-panel")
    expect(panel.innerHTML).toContain("Unknown")
  })
})
