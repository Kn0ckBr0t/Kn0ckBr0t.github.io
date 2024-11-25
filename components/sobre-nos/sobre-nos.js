var splash = document.getElementById('preloader');

window.addEventListener("load", function() {
    const letters = document.querySelectorAll("#preloader h1 span");

    gsap.to(letters, {
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

    gsap.to(letters, {
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
  
var splash = document.getElementById('preloader');

window.addEventListener("load", function() {
    const letters = document.querySelectorAll("#preloader h1 span");

    gsap.to(letters, {
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

gsap.from("#sobre-nos-titulotext", {
    duration: 2.5,
    opacity: 0,
    x: "-5%",
    ease: "expo.out",
});

new Typewriter("#equipe", {
    strings: ["equipe", "mannschaft", "équipe", "团队"],
    autoStart: true,
    loop: true,
});

document.querySelectorAll('.sobre-nos-integrantes__integrante').forEach(integrante => {
    integrante.addEventListener('mouseover', () => {
        gsap.to(integrante.querySelectorAll('.integrantebg__h1, .integrantebg__img'), {
            duration: 0.5,
            opacity: 1,
            ease: "steps(10)",
            stagger: 0.1,
            onStart: () => {
                integrante.querySelectorAll('.integrantebg__h1, .integrantebg__img').forEach(el => {
                    el.style.display = 'block';
                });
            }
        });
        gsap.to(integrante.querySelector('.integrante__img'), {
            duration: 0.5,
            filter: "contrast(1.2)",
            blendMode: "screen"
        });
    });

    integrante.addEventListener('mouseout', () => {
        gsap.to(integrante.querySelectorAll('.integrantebg__h1, .integrantebg__img'), {
            duration: 0.5,
            opacity: 0,
            ease: "steps(10)",
            stagger: 0.1,
            onComplete: () => {
                integrante.querySelectorAll('.integrantebg__h1, .integrantebg__img').forEach(el => {
                    el.style.display = 'none';
                });
            }
        });
        gsap.to(integrante.querySelector('.integrante__img'), {
            duration: 0.5,
            filter: "brightness(1) contrast(1)",
            blendMode: "normal"
        });
    });
});