const header = document.querySelector(".header");
let lastScrollTop = 0;

ScrollTrigger.create({
  start: 0,
  end: "max",
  onUpdate: (self) => {
    const scrollTop = window.scrollY;

    if (scrollTop > lastScrollTop) {
      gsap.to(header, { y: -header.offsetHeight, opacity: 0, duration: 0.5 });
    } else {
      gsap.to(header, { y: 0, opacity: 1, ease: "sine.inOut", duration: 0.5 });
    }

    lastScrollTop = scrollTop;
  },
});

var splash = document.getElementById('preloader');

window.addEventListener("load", function() {
    const letters = document.querySelectorAll("#preloader h1 span");

    gsap.from(letters, {
        duration: 1,
        opacity: 0,
        y: 50,
        stagger: 0.1,
        ease: "power2.out",
        onComplete: function() {
            gsap.to(splash, {
                duration: 2,
                opacity: 0,
                ease: "power2.out",
                onComplete: function() {
                    splash.style.display = "none";
                }
            });
        }
    });
});

gsap.registerPlugin(ScrollTrigger);
gsap.from(".home__title", {
  duration: 2.5,
  opacity: 0,
  x: "-5%",
  ease: "expo.out",
});

gsap.to(".home__sobrenos", {
  scrollTrigger: {
    trigger: ".home__sobrenos",
    pin: true,
    start: "top top",
    end: "+=500",
    scrub: 2,
  },
});

gsap.to(".home__sobrenos--WORKWAY", {
  scale: 1.5,
  ease: "expo.out",
  scrollTrigger: {
    trigger: ".home__sobrenos--WORKWAY",
    scrub: 1.5,
    start: "top center",
    end: "bottom top",
  },
});

gsap.from(".home__planostitulo--txt", {
  x: "-5%",
  opacity: 0,
  ease: "expo.out",
  duration: 1.5,
  scrollTrigger: ".home__planostitulo--txt",
});

gsap.set(".card-1", { opacity: 1 });

let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".home__planos",
    start: "top-=150 top",
    endTrigger: ".home__escolha",
    end: "+=300%",
    scrub: true,
    pin: true,
  },
});

tl.to(".card-1", { opacity: 0, x: "6%", ease: "power2.inOut", duration: 2 })
  .to(
    ".card-2",
    { opacity: 1, x: "0%", ease: "power2.inOut", duration: 1 },
    "-=0.5"
  )
  .to(".card-2", { opacity: 0, x: "-6%", ease: "power2.out", duration: 2 })
  .to(
    ".card-3",
    { opacity: 1, y: "0%", ease: "power2.inOut", duration: 1 },
    "-=0.5"
  );

new Typewriter(".home__title--color", {
  strings: ["Oportunidades", "Esperança", "Fortuna", "Alegria"],
  autoStart: true,
  loop: true,
});