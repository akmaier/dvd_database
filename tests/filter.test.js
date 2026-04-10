const fs = require("fs")
const path = require("path")

const dvds = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "dvds.json"), "utf-8")
)

// Reimplement the filtering algorithm from app.js to test its logic
function applyFilters(allDvds, query, selectedGenre, selectedYear) {
  return allDvds.filter((dvd) => {
    const queryMatch = dvd.title.toLowerCase().includes(query.trim().toLowerCase())
    const genreMatch = selectedGenre ? dvd.genre === selectedGenre : true
    const yearMatch = selectedYear ? String(dvd.year) === selectedYear : true
    return queryMatch && genreMatch && yearMatch
  })
}

describe("title search", () => {
  test("empty query returns all DVDs", () => {
    expect(applyFilters(dvds, "", "", "")).toHaveLength(dvds.length)
  })

  test("case-insensitive substring match", () => {
    const result = applyFilters(dvds, "big fish", "", "")
    expect(result).toHaveLength(1)
    expect(result[0].title).toBe("Big Fish")
  })

  test("partial title matches multiple results", () => {
    const result = applyFilters(dvds, "pirate", "", "")
    expect(result.length).toBeGreaterThanOrEqual(2)
    result.forEach((dvd) => {
      expect(dvd.title.toLowerCase()).toContain("pirate")
    })
  })

  test("no match returns empty array", () => {
    const result = applyFilters(dvds, "xyznonexistent", "", "")
    expect(result).toHaveLength(0)
  })

  test("whitespace-only query returns all DVDs", () => {
    expect(applyFilters(dvds, "   ", "", "")).toHaveLength(dvds.length)
  })
})

describe("genre filter", () => {
  test("exact genre match", () => {
    const result = applyFilters(dvds, "", "Horror", "")
    expect(result.length).toBeGreaterThan(0)
    result.forEach((dvd) => {
      expect(dvd.genre).toBe("Horror")
    })
  })

  test("non-existent genre returns empty", () => {
    const result = applyFilters(dvds, "", "Nonexistent Genre", "")
    expect(result).toHaveLength(0)
  })

  test("empty genre string returns all DVDs", () => {
    expect(applyFilters(dvds, "", "", "")).toHaveLength(dvds.length)
  })
})

describe("year filter", () => {
  test("exact year match", () => {
    const result = applyFilters(dvds, "", "", "2003")
    expect(result.length).toBeGreaterThan(0)
    result.forEach((dvd) => {
      expect(dvd.year).toBe(2003)
    })
  })

  test("non-existent year returns empty", () => {
    const result = applyFilters(dvds, "", "", "1800")
    expect(result).toHaveLength(0)
  })

  test("DVDs with null year are excluded by year filter", () => {
    const result = applyFilters(dvds, "", "", "2003")
    result.forEach((dvd) => {
      expect(dvd.year).not.toBeNull()
    })
  })
})

describe("combined filters (AND logic)", () => {
  test("search + genre narrows results", () => {
    const searchOnly = applyFilters(dvds, "the", "", "")
    const combined = applyFilters(dvds, "the", "Horror", "")
    expect(combined.length).toBeLessThan(searchOnly.length)
    combined.forEach((dvd) => {
      expect(dvd.title.toLowerCase()).toContain("the")
      expect(dvd.genre).toBe("Horror")
    })
  })

  test("search + genre + year", () => {
    const result = applyFilters(dvds, "pirate", "Adventure Fantasy", "2003")
    expect(result.length).toBeGreaterThanOrEqual(1)
    result.forEach((dvd) => {
      expect(dvd.title.toLowerCase()).toContain("pirate")
      expect(dvd.genre).toBe("Adventure Fantasy")
      expect(dvd.year).toBe(2003)
    })
  })

  test("conflicting filters return empty", () => {
    const result = applyFilters(dvds, "big fish", "Horror", "")
    expect(result).toHaveLength(0)
  })
})
