gsap.from(".home__title", { duration: 2.5, opacity: 0, x: '-5%', ease: "expo.out" });
gsap.registerPlugin(ScrollSmoother);
ScrollSmoother.create({
    smooth: 1,
    effects: true,
    smoothTouch: 0.1,
  });