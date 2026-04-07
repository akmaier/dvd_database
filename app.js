const state = {
  allDvds: [],
  filtered: []
}

const elements = {
  list: document.getElementById("dvd-list"),
  search: document.getElementById("search-input"),
  genre: document.getElementById("genre-filter"),
  year: document.getElementById("year-filter"),
  count: document.getElementById("result-count"),
  reset: document.getElementById("reset-filters")
}

init()

function init() {
  state.allDvds = DVD_DATA

  populateFilterOptions()
  bindEvents()
  applyFilters()
}

function populateFilterOptions() {
  const genreValues = [...new Set(state.allDvds.map((dvd) => dvd.genre))].sort()
  const yearValues = [...new Set(state.allDvds.map((dvd) => dvd.year).filter(Boolean))].sort((a, b) => b - a)

  genreValues.forEach((genre) => {
    const option = document.createElement("option")
    option.value = genre
    option.textContent = genre
    elements.genre.appendChild(option)
  })

  yearValues.forEach((year) => {
    const option = document.createElement("option")
    option.value = String(year)
    option.textContent = String(year)
    elements.year.appendChild(option)
  })
}

function bindEvents() {
  elements.search.addEventListener("input", applyFilters)
  elements.genre.addEventListener("change", applyFilters)
  elements.year.addEventListener("change", applyFilters)
  elements.reset.addEventListener("click", () => {
    elements.search.value = ""
    elements.genre.value = ""
    elements.year.value = ""
    applyFilters()
  })
}

function applyFilters() {
  const query = elements.search.value.trim().toLowerCase()
  const selectedGenre = elements.genre.value
  const selectedYear = elements.year.value

  state.filtered = state.allDvds.filter((dvd) => {
    const queryMatch = dvd.title.toLowerCase().includes(query)
    const genreMatch = selectedGenre ? dvd.genre === selectedGenre : true
    const yearMatch = selectedYear ? String(dvd.year) === selectedYear : true
    return queryMatch && genreMatch && yearMatch
  })

  renderDvds(state.filtered)
}

function renderDvds(dvds) {
  elements.list.innerHTML = ""
  elements.count.textContent = `${dvds.length} title${dvds.length === 1 ? "" : "s"} shown`

  if (dvds.length === 0) {
    const li = document.createElement("li")
    li.className = "dvd-card"
    li.textContent = "No results found for the current filters."
    elements.list.appendChild(li)
    return
  }

  dvds.forEach((dvd) => {
    const li = document.createElement("li")
    li.className = "dvd-card"

    li.innerHTML = `
      <h3>${escapeHtml(dvd.title)}</h3>
      <p><strong>Genre:</strong> ${escapeHtml(dvd.genre)}</p>
      <p><strong>Year:</strong> ${dvd.year ?? "Unknown"}</p>
      <p><strong>Shelf position:</strong> ${escapeHtml(dvd.shelf_position)}</p>
      <a href="detail.html?id=${encodeURIComponent(dvd.id)}">Open details</a>
    `

    elements.list.appendChild(li)
  })
}

function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}
