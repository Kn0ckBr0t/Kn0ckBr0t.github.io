gsap.registerPlugin(ScrollTrigger);
gsap.from(".home__title", { duration: 2.5, opacity: 0, x: '-5%', ease: "expo.out" });

gsap.to(".home__sobrenos--WORKWAY", {
  scale: 1.5,
  ease: "expo.out",
  scrollTrigger: {
    trigger: '.home__sobrenos--WORKWAY',
    scrub: 1,
  }
});

gsap.from(".home__planostitulo--txt", {
  x: "-5%",
  opacity: 0,
  ease: "expo.out",
  duration: 1.5,
  scrollTrigger: '.home__planostitulo--txt',
});