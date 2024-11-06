document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('perfil').style.display = 'none';
});

document.getElementById('menu_perfil').addEventListener('click', function() {
    gsap.to('#dashboard', { duration: 0.2, opacity: 0, onComplete: function() {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('perfil').style.display = 'block';
        gsap.fromTo('#perfil', { opacity: 0 }, { duration: 0.5, opacity: 1 });
    }});
});

document.getElementById('menu_dashboard').addEventListener('click', function() {
    gsap.to('#perfil', { duration: 0.2, opacity: 0, onComplete: function() {
        document.getElementById('perfil').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        gsap.fromTo('#dashboard', { opacity: 0 }, { duration: 0.2, opacity: 1 });
    }});
});