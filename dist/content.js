"use strict";
(() => {
  // src/floatingPanel.ts
  function showFloatingWindow(encoded) {
    let panel = document.getElementById("wa-encode-panel");
    if (panel) {
      panel.querySelector(".wa-text").textContent = encoded;
      panel.style.display = "block";
      return;
    }
    panel = document.createElement("div");
    panel.id = "wa-encode-panel";
    panel.innerHTML = `
    <div class="wa-header">
      <span>Encoded Message</span>
      <button class="wa-close">\u2716</button>
    </div>

    <div class="wa-body">
      <pre class="wa-text">${encoded}</pre>
      <button class="wa-copy">Copy</button>
    </div>
  `;
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
    const header = panel.querySelector(".wa-header");
    header.style.cssText = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    margin-bottom: 8px;
  `;
    const body = panel.querySelector(".wa-body");
    body.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 10px;
  `;
    const textArea = panel.querySelector(".wa-text");
    textArea.style.cssText = `
    white-space: pre-wrap;
    background: #111;
    padding: 10px;
    border-radius: 6px;
    max-height: 160px;
    overflow-y: auto;
    font-size: 14px;
  `;
    const copyBtn = panel.querySelector(".wa-copy");
    copyBtn.style.cssText = `
    padding: 8px 12px;
    background: #4caf50;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    color: white;
    font-weight: 600;
  `;
    const close = panel.querySelector(".wa-close");
    close.style.color = "white";
    close.onclick = () => {
      panel.style.display = "none";
    };
    copyBtn.addEventListener("click", () => {
      const encoded2 = panel.querySelector(".wa-text").textContent;
      navigator.clipboard.writeText(encoded2);
      copyBtn.textContent = "Copied!";
      setTimeout(() => copyBtn.textContent = "Copy", 1500);
    });
    document.body.appendChild(panel);
  }

  // src/content.ts
  var mapping = {
    a: "x9#",
    b: "p@7",
    c: "m$4",
    d: "q!2",
    e: "z&8",
    f: "t*5",
    g: "r^1",
    h: "k%6",
    i: "u~3",
    j: "w+0",
    k: "b=9",
    l: "n>4",
    m: "s<8",
    n: "c?2",
    o: "v/7",
    p: "y|5",
    q: "j]1",
    r: "d[6",
    s: "f}3",
    t: "g{0",
    u: "h)9",
    v: "o(5",
    w: "i_2",
    x: "e-7",
    y: "l;4",
    z: "a:6",
    " ": "_0_"
  };
  var reverseMapping = {};
  Object.entries(mapping).forEach(
    ([key, value]) => reverseMapping[value] = key
  );
  function waitForElement(element) {
    return new Promise((resolve) => {
      if (document.querySelector(element)) {
        resolve();
        return;
      }
      const body = document.querySelector("body");
      const observer = new MutationObserver((mutations) => {
        const selectedElement = document.querySelector(element);
        if (selectedElement) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(body, {
        childList: true,
        subtree: true
      });
    });
  }
  function decodeText(msg) {
    if (msg.length % 3 !== 0) return "";
    let decoded = "";
    let startIndex = 0;
    let endIndex = 2;
    while (endIndex < msg.length) {
      const substr = msg.slice(startIndex, endIndex + 1);
      const decodedPart = reverseMapping[substr];
      if (!decodedPart) return "";
      decoded += decodedPart;
      startIndex += 3;
      endIndex += 3;
    }
    return decoded;
  }
  function encodeText(msg) {
    let encoded = "";
    for (const char of msg) {
      const encodedPart = mapping[char];
      if (!encodedPart) return "";
      encoded += encodedPart;
    }
    return encoded;
  }
  function InsertDecodedText(decodedText, wrapper) {
    const divEl = document.createElement("div");
    divEl.style.color = "white";
    divEl.style.fontSize = "14px";
    divEl.style.padding = "8px 12px";
    divEl.style.width = "fit-content";
    divEl.style.marginTop = "4px";
    divEl.style.borderRadius = "12px";
    divEl.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    divEl.style.fontFamily = "sans-serif";
    divEl.style.maxWidth = "80%";
    divEl.append(decodedText);
    const isSent = wrapper.classList.contains("message-out");
    if (isSent) {
      divEl.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
    } else {
      divEl.style.background = "linear-gradient(135deg, #ffb187ff, #a46f14ff)";
    }
    wrapper.appendChild(divEl);
  }
  function ListenToIncomingMessages() {
    const chatBodyEl = document.querySelector(
      'div[data-scrolltracepolicy="wa.web.conversation.messages"]'
    );
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement) {
            const spanElements = node.querySelectorAll(
              "span.selectable-text.copyable-text"
            );
            spanElements.forEach((span) => {
              const text = span.textContent;
              const decoded = decodeText(text);
              if (!decoded) return;
              const msgWrapper = span.closest(".message-in,.message-out");
              if (!msgWrapper) return;
              InsertDecodedText(decoded, msgWrapper);
            });
          }
        }
      }
    });
    observer.observe(chatBodyEl, {
      childList: true,
      subtree: true
    });
  }
  function insertEncodeBttn() {
    const inputWrapper = document.querySelector(
      "#main div.lexical-rich-text-input"
    );
    if (!inputWrapper) return;
    const btn = document.createElement("button");
    btn.id = "encode-btn";
    btn.textContent = "ENCODE\u{1F512}";
    btn.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
    btn.style.border = "none";
    btn.style.padding = "6px 12px";
    btn.style.marginInline = "10px";
    btn.style.borderRadius = "8px";
    btn.style.color = "white";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "12px";
    btn.style.fontWeight = "600";
    btn.style.letterSpacing = "1px";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    btn.style.userSelect = "none";
    btn.onmouseenter = () => {
      btn.style.background = "linear-gradient(135deg, #66bb6a, #1b5e20)";
    };
    btn.onmouseleave = () => {
      btn.style.background = "linear-gradient(135deg, #4CAF50, #2E7D32)";
    };
    btn.addEventListener("click", () => {
      const input = inputWrapper.querySelector(
        "span.selectable-text.copyable-text"
      );
      if (!input) return;
      const text = input.textContent;
      showFloatingWindow(encodeText(text));
    });
    const parent = inputWrapper.parentElement;
    if (!parent) return;
    parent.appendChild(btn);
  }
  (async function() {
    await waitForElement(
      'div[data-scrolltracepolicy="wa.web.conversation.messages"]'
    );
    ListenToIncomingMessages();
    await waitForElement("div.lexical-rich-text-input");
    insertEncodeBttn();
    const input = document.querySelector(
      "div.lexical-rich-text-input span.selectable-text.copyable-text"
    );
    if (!input) return;
    input.textContent = "hello world";
    input.dispatchEvent(new InputEvent("input", { bubbles: true }));
  })();
})();
