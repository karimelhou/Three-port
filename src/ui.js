export class OverlayUI {
  constructor() {
    this.container = document.getElementById("overlay");
    this.card = document.createElement("div");
    this.card.className = "overlay-card";
    this.container.appendChild(this.card);
    this.hide();
  }

  show({ subtitle, title, body }) {
    this.card.innerHTML = `
      <div class="overlay-header">
        <span class="overlay-subtitle">${subtitle ?? "Portfolio Node"}</span>
        <h1>${title}</h1>
        <div class="overlay-divider"></div>
      </div>
      <div class="overlay-body">${body}</div>
    `;
    this.container.classList.add("visible");
  }

  hide() {
    this.container.classList.remove("visible");
  }
}
