# Premium Scroll Animation Architecture Guide

This document serves as a reference for how the high-performance smooth scrolling and scroll-triggered animations were implemented in this React application. You can use this guide as a template for future projects!

## 1. The Core Technologies
To achieve "award-winning" level scrolling, we moved away from native CSS interactions and used three industry-standard tools:
* **[Lenis](https://lenis.darkroom.engineering/)** (`@studio-freight/lenis`): A lightweight, robust virtual scroll engine that hijacks the native scroll wheel to provide smooth, heavy inertia.
* **[GSAP](https://gsap.com/)** (`gsap`): The GreenSock Animation Platform, which handles complex DOM animations directly on the GPU for 60+ FPS performance.
* **[ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)**: A GSAP plugin that mathematically links animations to the scrollbar position.
* **`@gsap/react`**: GSAP's official React package that provides the `useGSAP()` hook for safe cleanup and context management.

## 2. Global Setup (App.js)
To make everything work seamlessly together, Lenis must run globally, and GSAP's internal "clock" (`ticker`) must be synchronized with Lenis's scroll events. 

Here is the exact code block used in `App.js`:

```javascript
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

// 1. Register the plugin globally
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    // 2. Initialize the smooth scroller
    const lenis = new Lenis({
      duration: 1.2, // Controls how "slow" and heavy the scroll feels
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    // 3. Crucial step: Tell ScrollTrigger to update every time Lenis scrolls
    lenis.on('scroll', ScrollTrigger.update);

    // 4. Crucial step: Sync GSAP's requestAnimationFrame with Lenis
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    
    // Prevent GSAP from trying to catch up on missed frames, preventing jank
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);
  // ...
}
```

## 3. Triggering Animations (Home.js)
Instead of using messy CSS `IntersectionObservers`, we used the `useGSAP` hook. 

### The CSS Pre-requisite
Always ensure the elements you want to animate start completely hidden in CSS. Otherwise, they will "flash" on the screen before the JavaScript runs.
```css
.gsap-reveal {
  opacity: 0;
}
```

### The Fade & Slide Up Animation
By giving every section the `.gsap-reveal` class, we can loop through them and tell GSAP to animate them from `y: 50` up to `y: 0`.
```javascript
  useGSAP(() => {
    const reveals = gsap.utils.toArray('.gsap-reveal');
    reveals.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50 }, // Starting state
        {
          opacity: 1,         // Ending state
          y: 0,
          duration: 0.8,
          ease: 'power3.out', // Smooth deceleration
          scrollTrigger: {
            trigger: el,      // What element to watch
            start: 'top 85%', // Trigger when the top of the element hits 85% down the screen
            toggleActions: 'play none none reverse', // play on enter, reverse on leave
          }
        }
      );
    });
  }, { scope: container }); // Scope ensures GSAP only selects elements within this component!
```

## 4. The Parallax Effect (Scrubbing)
To make the background emoji stickers move at a different speed than the main scroll, we use ScrollTrigger's `scrub: true` property. `Scrub` binds the animation timeline directly to the scrollbar, meaning if you scroll halfway down, the animation only plays halfway.

```javascript
    const stickers = gsap.utils.toArray('.sticker');
    stickers.forEach((sticker, i) => {
      
      // Give each sticker a slightly different random speed modifier
      const speed = 0.5 + (i % 3) * 0.3; 
      
      gsap.to(sticker, {
        y: -150 * speed,                 // Move upwards
        rotation: i % 2 === 0 ? 15 : -15, // Spin slightly while scrolling
        ease: 'none',                    // Linear easing is required for smooth scrubbing
        scrollTrigger: {
          trigger: sticker.closest('.section-container'),
          start: 'top bottom', // Start when section enters bottom of screen
          end: 'bottom top',   // End when section leaves top of screen
          scrub: true,         // Bind to scrollbar!
        }
      });
    });
```

## 5. Summary of Rules for Premium Performance
1. **Never use `scroll-snap-type` CSS** when you are using a smooth scroll engine. They will conflict.
2. **Never animate `top`, `left`, `margin`, or `padding`**. These cause "Layout Shifts" which cripple CPU performance. 
3. **Only animate `transform` (x, y, scale, rotation) and `opacity`**. These are handled exclusively by your computer's GPU.
4. **Never use `overflow: hidden` on a main wrapper div**. It breaks native scrolling optimizations and can spawn double scrollbars. Use `overflow-x: hidden` on the `body` only.
