window.router = {
  go(route) {
    const main = document.getElementById('main-content');
    if (route === 'offline') main.innerHTML = '<h2>Offline</h2><p>Aplikacja działa offline.</p>';
    else main.innerHTML = '<p>Witamy w module CANON aplikacji offline Cyber Guard Nexus.</p>';
  }
};
