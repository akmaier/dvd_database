const detailRoot = document.getElementById("detail-root")

loadDetail()

function loadDetail() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get("id")

  if (!id) {
    renderMessage("Missing DVD id in URL.")
    return
  }

  const dvd = DVD_DATA.find((entry) => entry.id === id)

  if (!dvd) {
    renderMessage("DVD not found in dataset.")
    return
  }

  renderDetail(dvd)
}

function renderDetail(dvd) {
  detailRoot.innerHTML = `
    <article class="detail-panel">
      <h2>${escapeHtml(dvd.title)}</h2>
      <p class="detail-row"><strong>Genre:</strong> ${escapeHtml(dvd.genre)}</p>
      <p class="detail-row"><strong>Year:</strong> ${dvd.year ?? "Unknown"}</p>
      <p class="detail-row"><strong>Shelf position:</strong> ${escapeHtml(dvd.shelf_position)}</p>
      <p class="detail-row"><strong>Record id:</strong> ${escapeHtml(dvd.id)}</p>
      <p class="detail-row muted">If needed, adjust year and genre in <code>data/dvds.json</code>.</p>
    </article>
  `
}

function renderMessage(message) {
  detailRoot.innerHTML = `
    <article class="detail-panel">
      <p>${escapeHtml(message)}</p>
    </article>
  `
}

function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}
