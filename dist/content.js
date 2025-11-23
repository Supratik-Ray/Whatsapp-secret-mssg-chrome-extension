"use strict";
(() => {
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
  (async function() {
    await waitForElement(
      'div[data-scrolltracepolicy="wa.web.conversation.messages"]'
    );
    ListenToIncomingMessages();
  })();
})();
