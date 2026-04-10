const fs = require("fs")
const path = require("path")

const dvdsJson = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "data", "dvds.json"), "utf-8")
)

// Also load dvds.js to verify it matches dvds.json
const dvdsJsContent = fs.readFileSync(
  path.join(__dirname, "..", "data", "dvds.js"),
  "utf-8"
)
// Execute dvds.js in a sandbox to extract DVD_DATA
// Replace const with var so it lands on the sandbox object
const vm = require("vm")
const sandbox = {}
vm.runInNewContext(dvdsJsContent.replace(/^const /, "var "), sandbox)
const dvdsFromJs = sandbox.DVD_DATA

describe("DVD dataset integrity", () => {
  test("contains 84 records", () => {
    expect(dvdsJson).toHaveLength(84)
  })

  test("every record has required fields", () => {
    dvdsJson.forEach((dvd, i) => {
      expect(dvd).toHaveProperty("id")
      expect(dvd).toHaveProperty("title")
      expect(dvd).toHaveProperty("genre")
      expect(dvd).toHaveProperty("shelf_position")
      expect(dvd).toHaveProperty("year")
    })
  })

  test("all IDs are unique", () => {
    const ids = dvdsJson.map((d) => d.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  test("all IDs match dvd-NNN pattern", () => {
    dvdsJson.forEach((dvd) => {
      expect(dvd.id).toMatch(/^dvd-\d{3}$/)
    })
  })

  test("titles are non-empty strings", () => {
    dvdsJson.forEach((dvd) => {
      expect(typeof dvd.title).toBe("string")
      expect(dvd.title.trim().length).toBeGreaterThan(0)
    })
  })

  test("genres are non-empty strings", () => {
    dvdsJson.forEach((dvd) => {
      expect(typeof dvd.genre).toBe("string")
      expect(dvd.genre.trim().length).toBeGreaterThan(0)
    })
  })

  test("years are null or plausible (1900-2030)", () => {
    dvdsJson.forEach((dvd) => {
      if (dvd.year !== null) {
        expect(typeof dvd.year).toBe("number")
        expect(dvd.year).toBeGreaterThanOrEqual(1900)
        expect(dvd.year).toBeLessThanOrEqual(2030)
      }
    })
  })

  test("shelf_position values are non-empty strings", () => {
    dvdsJson.forEach((dvd) => {
      expect(typeof dvd.shelf_position).toBe("string")
      expect(dvd.shelf_position.trim().length).toBeGreaterThan(0)
    })
  })

  test("dvds.json and dvds.js contain identical data", () => {
    expect(dvdsFromJs).toEqual(dvdsJson)
  })
})
