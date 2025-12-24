window.auth = {
  login: function(user, pass) {
    // Minimalne pseudo-uwierzytelnianie offline
    return (user && pass) ? 'Zalogowano' : 'Błędne dane';
  },
  logout: function() {
    return 'Wylogowano';
  }
};
