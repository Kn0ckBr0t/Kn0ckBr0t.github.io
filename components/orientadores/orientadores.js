function searchOrientadores() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const orientadores = document.querySelectorAll('.orientador__item');
    let hasVisibleOrientadores = false;

    orientadores.forEach(orientador => {
        const name = orientador.querySelector('.orientador__name').textContent.toLowerCase();
        if (name.includes(input)) {
            orientador.style.display = 'flex';
            gsap.to(orientador, { duration: 0.5, opacity: 1 });
            hasVisibleOrientadores = true;
        } else {
            gsap.to(orientador, { duration: 0.5, opacity: 0, onComplete: () => {
                orientador.style.display = 'none';
            }});
        }
    });

    const noResultsMessage = document.getElementById('no-results-message');
    if (!hasVisibleOrientadores) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
    }
}

document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchOrientadores();
    }
});

const header = document.querySelector(".header");
let lastScrollTop = 0;

ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: () => {
    const scrollTop = window.scrollY;

    if (scrollTop > lastScrollTop) {
      gsap.to(header, { y: -header.offsetHeight, opacity: 0, duration: 0.5 });
    } else {
      gsap.to(header, { y: 0, opacity: 1, ease: "sine.inOut", duration: 0.5 });
    }

    lastScrollTop = scrollTop;
  },
});