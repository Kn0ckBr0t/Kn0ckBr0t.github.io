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