// Twój JavaScript
console.log('🚀 Strona załadowana!');

// Dodaj interaktywność
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM gotowy');
    
    // Przykład: animacja kart przy kliknięciu
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.style.transform = 'scale(1.02)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        });
    });
});

// Dodaj tutaj swój kod
