document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('dashboard').style.display = 'block';
    document.getElementById('perfil').style.display = 'none';
    document.getElementById('planos').style.display = 'none';
});

document.getElementById('menu_perfil').addEventListener('click', function() {
    gsap.to('#dashboard', { duration: 0.2, opacity: 0, onComplete: function() {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('perfil').style.display = 'block';
        document.getElementById('planos').style.display = 'none';
        gsap.fromTo('#perfil', { opacity: 0 }, { duration: 0.5, opacity: 1 });
    }});
});

document.getElementById('menu_dashboard').addEventListener('click', function() {
    gsap.to('#perfil', { duration: 0.2, opacity: 0, onComplete: function() {
        document.getElementById('perfil').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('planos').style.display = 'none';
        gsap.fromTo('#dashboard', { opacity: 0 }, { duration: 0.2, opacity: 1 });
    }});
});

document.getElementById('menu_planos').addEventListener('click', function() {
    gsap.to('#dashboard', { duration: 0.2, opacity: 0, onComplete: function() {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('perfil').style.display = 'none';
        document.getElementById('planos').style.display = 'block';
        gsap.fromTo('#planos', { opacity: 0 }, { duration: 0.5, opacity: 1 });
    }});
});

document.getElementById('planos_pay').addEventListener('click', async function(event) {
    event.preventDefault();
    
    const selectedPlan = document.getElementById('planos__selecionar--select').value;
    const planosShow = document.querySelector('.planos-show');
    const valor = selectedPlan === 'Premium' ? '15.00' : '50.00';
    const beneficio = selectedPlan === 'Premium' ? 'Premium' : 'Empresas';
    
    try {
        const code = await window._pix.Pix("53859584847", "PEDRO HENRIQUE BISPO FERREIRA", "SAO PAULO", valor, "Upgrade de plano para " + beneficio, true);
        const codecola = await window._pix.Pix("53859584847", "PEDRO HENRIQUE BISPO FERREIRA", "SAO PAULO", valor, "Upgrade de plano para " + beneficio);

        planosShow.querySelector('#valor').textContent = `Valor: R$ ${valor}`;
        planosShow.querySelector('#beneficio').textContent = `Benefício: ${beneficio}`;
        planosShow.querySelector('#pix-qrcode').innerHTML = `<img src="${code}" alt="QR Code Pix">`;
        planosShow.querySelector('#copy-pix').value = codecola;
        
        planosShow.style.display = 'block';
    } catch (error) {
        console.error('Erro ao gerar o código Pix:', error);
    }
});