window.app = {
  version: "1.0.0",
  isOffline: false,
  init() {
    document.getElementById('main-content').innerText = "Aplikacja załadowana. Tryb offline: " + this.isOffline;
  }
};
window.onload = () => app.init();
