document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Lenis for Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    gestureOrientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  // Sync GSAP ScrollTrigger with Lenis
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time)=>{
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // 2. Custom Cursor Logic
  const cursor = document.getElementById("cursor-ring");
  const cursorDot = document.getElementById("cursor-dot");

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let dotX = 0;
  let dotY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  const renderCursor = () => {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    
    dotX += (mouseX - dotX) * 0.5;
    dotY += (mouseY - dotY) * 0.5;

    gsap.set(cursor, { x: cursorX, y: cursorY });
    gsap.set(cursorDot, { x: dotX, y: dotY });

    requestAnimationFrame(renderCursor);
  };
  
  requestAnimationFrame(renderCursor);

  const onHover = () => {
    gsap.to(cursor, { scale: 1.5, duration: 0.3, backgroundColor: "rgba(255, 255, 255, 0.1)" });
  };

  const onLeave = () => {
    gsap.to(cursor, { scale: 1, duration: 0.3, backgroundColor: "transparent" });
  };

  const hoverElements = document.querySelectorAll("a, button, .hover-target");
  hoverElements.forEach((el) => {
    el.addEventListener("mouseenter", onHover);
    el.addEventListener("mouseleave", onLeave);
  });

  // 3. Page Animations (Identical to Next.js)
  const tl = gsap.timeline();
  
  // Animate Hero Image
  tl.to(".hero-image-animate", {
    scale: 1,
    duration: 2.5,
    ease: "power3.out",
  }, 0);

  // Split text reveal for Title
  const titleLines = document.querySelectorAll(".hero-title-line");
  tl.fromTo(titleLines, 
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out" },
    0.5
  );

  // Fade up for subtitle and buttons
  tl.fromTo(".hero-fade-up",
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
    1.2
  );

  // 4. Services Section Reveal
  const serviceCards = document.querySelectorAll(".serviceCard");
  serviceCards.forEach((card, i) => {
    gsap.fromTo(card, 
      { y: 100, opacity: 0 },
      { 
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 85%",
        }
      }
    );
  });

  // 5. Gallery Parallax & Reveal
  const galleryItems = document.querySelectorAll(".galleryItem");
  galleryItems.forEach((item) => {
    const image = item.querySelector(".galleryImage");
    
    // Reveal
    gsap.fromTo(item,
      { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
      { 
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", 
        duration: 1.5, ease: "power4.inOut",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        }
      }
    );

    // Parallax inner image
    if (image) {
      gsap.to(image, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        }
      });
    }
  });

});
