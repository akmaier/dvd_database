// Reimplement escapeHtml from app.js / detail.js
function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

describe("escapeHtml", () => {
  test("escapes ampersand", () => {
    expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry")
  })

  test("escapes angle brackets", () => {
    expect(escapeHtml("<b>bold</b>")).toBe("&lt;b&gt;bold&lt;/b&gt;")
  })

  test("escapes double quotes", () => {
    expect(escapeHtml('say "hello"')).toBe("say &quot;hello&quot;")
  })

  test("escapes single quotes", () => {
    expect(escapeHtml("it's")).toBe("it&#39;s")
  })

  test("escapes all special characters together", () => {
    expect(escapeHtml(`<a href="x" onclick='alert("&")'>`)).toBe(
      "&lt;a href=&quot;x&quot; onclick=&#39;alert(&quot;&amp;&quot;)&#39;&gt;"
    )
  })

  test("returns empty string unchanged", () => {
    expect(escapeHtml("")).toBe("")
  })

  test("handles numbers by converting to string", () => {
    expect(escapeHtml(2003)).toBe("2003")
  })

  test("handles null by converting to string", () => {
    expect(escapeHtml(null)).toBe("null")
  })

  test("blocks script injection", () => {
    const malicious = '<script>alert("xss")</script>'
    const escaped = escapeHtml(malicious)
    expect(escaped).not.toContain("<script>")
    expect(escaped).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    )
  })

  test("blocks event handler injection", () => {
    const malicious = '" onmouseover="alert(1)"'
    const escaped = escapeHtml(malicious)
    expect(escaped).not.toContain('"')
  })
})
