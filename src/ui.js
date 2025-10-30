export class OverlayUI {
  constructor() {
    this.container = document.getElementById("overlay");
    this.card = document.createElement("div");
    this.card.className = "overlay-card";
    this.container.appendChild(this.card);
    this.hide();
  }

  show({ title, body }) {
    this.card.innerHTML = `
      <h1>${title}</h1>
      <div>${body}</div>
    `;
    this.container.classList.add("visible");
  }

  hide() {
    this.container.classList.remove("visible");
  }
}
