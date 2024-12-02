function searchQuerocomecar() {
    const input = document.getElementById('search-input').value.toLowerCase();
    const items = document.querySelectorAll('.querocomecar__item');

    let found = false;
    items.forEach(item => {
        const name = item.querySelector('.querocomecar__name').textContent.toLowerCase();
        if (name.includes(input)) {
            item.style.display = 'flex';
            gsap.to(item, { duration: 0.5, opacity: 1 });
            found = true;
        } else {
            gsap.to(item, { duration: 0.5, opacity: 0, onComplete: () => {
                item.style.display = 'none';
            }});
        }
    });

    const noResultsMessage = document.getElementById('no-results-message');
    if (found) {
        gsap.to(noResultsMessage, { autoAlpha: 0, duration: 0.5, onComplete: () => {
            noResultsMessage.style.display = 'none';
        }});
    } else {
        gsap.to(noResultsMessage, { autoAlpha: 1, duration: 0.5 });
        noResultsMessage.style.display = 'block';
    }
}

window.searchQuerocomecar = searchQuerocomecar;
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchQuerocomecar();
    }
});

window.searchQuerocomecar = searchQuerocomecar;
document.getElementById('search-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchQuerocomecar();
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