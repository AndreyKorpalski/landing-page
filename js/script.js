document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); 

    
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    
    if (email === 'andrey@gmail.com' && password === '123') {
        
        window.location.href = 'https://youtu.be/KXw8CRapg7k?si=XKwuDP-rjEsE-zYK&t=39';
    } else {
        
        alert('E-mail ou senha incorretos. Tente novamente.');
    }
});
