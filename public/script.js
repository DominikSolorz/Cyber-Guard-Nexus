document.addEventListener('DOMContentLoaded', () => {
    const consoleElement = document.getElementById('console');
    const inputElement = document.getElementById('input');
    const submitButton = document.getElementById('submit');

    const logToConsole = (message) => {
        consoleElement.value += `\n${message}`;
        consoleElement.scrollTop = consoleElement.scrollHeight;
    };

    submitButton.addEventListener('click', () => {
        const command = inputElement.value.trim();
        inputElement.value = '';

        if (command === '') {
            logToConsole('[SYSTEM] Please enter a command.');
            return;
        }

        logToConsole(`[USER] ${command}`);

        // Simulated responses
        setTimeout(() => {
            switch (command.toLowerCase()) {
                case 'scan':
                    logToConsole('[SYSTEM] Scanning for vulnerabilities...');
                    setTimeout(() => logToConsole('[SYSTEM] Scan complete. No vulnerabilities found.'), 2000);
                    break;
                case 'connect':
                    logToConsole('[SYSTEM] Connecting to the server...');
                    setTimeout(() => logToConsole('[SYSTEM] Connection established.'), 2000);
                    break;
                case 'hack':
                    logToConsole('[SYSTEM] Initiating hack sequence...');
                    setTimeout(() => logToConsole('[SYSTEM] Hack failed. Access denied.'), 2000);
                    break;
                default:
                    logToConsole('[SYSTEM] Command not recognized.');
                    break;
            }
        }, 1000);
    });
});