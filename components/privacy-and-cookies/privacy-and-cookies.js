document.addEventListener('DOMContentLoaded', function() {
    const ids = ['Dados', 'Cookies', 'Privacy'];
    ids.forEach(id => {
        const element = document.getElementById(id);
        const dropdown = document.getElementById(`${id}__dropdown`);
        if (element && dropdown) {
            dropdown.style.height = '0';
            dropdown.style.overflow = 'hidden';
            dropdown.style.display = 'none';
            dropdown.style.opacity = '0';
            
            element.addEventListener('click', function() {
                if (dropdown.style.display === 'none' || dropdown.style.height === '0px') {
                    dropdown.style.display = 'block';
                    gsap.to(dropdown, { duration: 0.5, height: 'auto', autoAlpha: 1 });
                } else {
                    gsap.to(dropdown, { duration: 0.5, height: 0, autoAlpha: 0, onComplete: () => {
                        dropdown.style.display = 'none';
                    }});
                }
            });
        }
    });
});
