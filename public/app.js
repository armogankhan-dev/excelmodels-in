document.addEventListener("DOMContentLoaded", () => {
  loadTemplates();
});

async function loadTemplates() {
  const container = document.getElementById("templates-container");

  if (!container) return;

  try {
    const response = await fetch("/api/templates");
    const data = await response.json();

    if (!data.success || !data.templates.length) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No templates available yet</h3>
          <p>New Excel templates will be added soon.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.templates.map(template => {

      const downloadUrl = template.file_url
        ? new URL(template.file_url, window.location.origin).href
        : "#";

      return `
        <div class="template-card">
          <div class="template-card-body">

            <span class="template-category">
              ${escapeHtml(template.category)}
            </span>

            <h3>${escapeHtml(template.name)}</h3>

            <p>${escapeHtml(template.description || "")}</p>

            <div class="template-card-footer">

              <span class="template-price">
                ${Number(template.price) === 0
                  ? "FREE"
                  : "₹" + template.price}
              </span>

              ${
                Number(template.is_free) === 1
                  ? `<a
                       class="download-btn"
                       href="${downloadUrl}"
                       download
                     >
                       Download
                     </a>`
                  : `<a
                       class="download-btn"
                       href="/template.html?slug=${encodeURIComponent(template.slug)}"
                     >
                       View Template
                     </a>`
              }

            </div>

          </div>
        </div>
      `;
    }).join("");

  } catch (error) {
    console.error("Unable to load templates:", error);

    container.innerHTML = `
      <div class="empty-state">
        <h3>Unable to load templates</h3>
        <p>Please try again later.</p>
      </div>
    `;
  }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value ?? "";
  return div.innerHTML;
}
