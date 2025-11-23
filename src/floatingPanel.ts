export default function showFloatingWindow(encoded: string) {
  // If already open, replace text
  let panel = document.getElementById("wa-encode-panel");
  if (panel) {
    panel.querySelector(".wa-text")!.textContent = encoded;
    panel.style.display = "block";
    return;
  }

  // Create panel
  panel = document.createElement("div");
  panel.id = "wa-encode-panel";
  panel.innerHTML = `
    <div class="wa-header">
      <span>Encoded Message</span>
      <button class="wa-close">✖</button>
    </div>

    <div class="wa-body">
      <pre class="wa-text">${encoded}</pre>
      <button class="wa-copy">Copy</button>
    </div>
  `;

  // STYLE THE PANEL
  panel.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 40px;
    width: 280px;
    background: #1e1e1e;
    color: white;
    padding: 12px;
    border-radius: 12px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.4);
    font-family: Inter, sans-serif;
    z-index: 999999999;
  `;

  // header style
  const header = panel.querySelector(".wa-header") as HTMLElement;
  header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    margin-bottom: 8px;
  `;

  // body
  const body = panel.querySelector(".wa-body") as HTMLElement;
  body.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;

  // text area
  const textArea = panel.querySelector(".wa-text") as HTMLElement;
  textArea.style.cssText = `
    white-space: pre-wrap;
    background: #111;
    padding: 10px;
    border-radius: 6px;
    max-height: 160px;
    overflow-y: auto;
    font-size: 14px;
  `;

  // copy button
  const copyBtn = panel.querySelector(".wa-copy") as HTMLElement;

  copyBtn.style.cssText = `
    padding: 8px 12px;
    background: #4caf50;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 600;
  `;

  // Close handler
  const close = panel.querySelector(".wa-close") as HTMLElement;

  close.style.color = "white";
  close.onclick = () => {
    panel.style.display = "none";
  };

  // Copy handler
  copyBtn.addEventListener("click", () => {
    const encoded = panel.querySelector(".wa-text")!.textContent;
    navigator.clipboard.writeText(encoded);
    copyBtn.textContent = "Copied!";
    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
  });

  document.body.appendChild(panel);
}
