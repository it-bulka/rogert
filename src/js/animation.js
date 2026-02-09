import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { safeRun } from "./safeRun.js";

export const anim = () => {
  gsap.registerPlugin(ScrollTrigger);

  // block anim
  safeRun(animHeroBlock);
  safeRun(animGreetingBlock);
  safeRun(animMeBlock);
  safeRun(animDoBlock);
  safeRun(animTurnBlock);
  // interaction
  safeRun(animBtnOnClick);
}

function animHeroBlock() {
  gsap.from(".hero__title span", {
    scrollTrigger: {
      trigger: ".hero",
      start: "top center",
      toggleActions: "play reset play reset"
    },
    y: -500,
    scale: 0.5,
    opacity: 0,
    ease: "bounce.out",
    duration: 3,
    stagger: {
      each: 0.5,
      repeat: 2,
      yoyo: true
    }
  });
}
function animGreetingBlock() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".greeting",
      start: "top 70%",
      toggleActions: "play reset play reset"
    }
  });

  tl.from(".greeting__title span", {
    x: -100,
    opacity: 0,
    stagger: 0.2
  })
    .from(".greeting__info-text", {
      y: 100,
      opacity: 0,
      stagger: 0.2
    }, "<")
    .add(revealBtnClip(".greeting__info-btn svg"));
}
function animMeBlock() {
  ScrollTrigger.create({
    trigger: ".me",
    start: "top top",
    pin: true,
  });

  gsap.from(".me__column span", {
    scrollTrigger: {
      trigger: ".me",
      start: "top center",
      scrub: true
    },
    y: 100,
    opacity: 0,
    stagger: 0.2
  });
}

function animDoBlock() {
  gsap.utils.toArray(".do__card-img").forEach(img => {
    gsap.fromTo(img,
      { rotation: 180, scale: 0.3 },
      { rotation: 0, scale: 1, duration: 0.6,
        scrollTrigger: {
          trigger: img,
          start: "top 80%",
          end: "top 30%",
          scrub: true
        }
      }
    );
  });
}

function animTurnBlock() {
  gsap.from(".turn__title span", {
    scrollTrigger: {
      trigger: ".turn",
      start: "top 50%",
      toggleActions: "play reverse play reverse"
    },
    x: -200,
    opacity: 0,
    stagger: 0.2
  });
}

function animBtnOnClick() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".btn");
    if (!btn) return;

    const svg = btn.querySelector<SVGPathElement>("svg");
    if (!svg) return;

    revealBtnClip(svg);
  });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".do__card-btn",
      start: "top 90%",
      toggleActions: "play reset play reset"
    }
  });

  tl.add(revealBtnClip(".do__card-btn svg"))
}

function revealBtnClip(el, options = {}) {
  return gsap.fromTo(
    el,
    { clipPath: "inset(0 100% 0 0)" },
    {
      clipPath: "inset(0 0% 0 0)",
      duration: 1.2,
      ease: "power2.out",
      ...options
    }
  );
}
