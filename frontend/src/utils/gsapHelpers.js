/**
 * gsapHelpers.js
 * Shared GSAP animation utilities for admin pages.
 */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Animate a collapsible panel open/close.
 * Returns { panelRef } — attach to the outer wrapper div.
 */
export function useCollapsible(isOpen) {
  const panelRef = useRef(null);
  const firstRun = useRef(true);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (firstRun.current) {
      // FIX: also set display:none when initially closed so panel truly disappears
      gsap.set(el, {
        height: isOpen ? 'auto' : 0,
        opacity: isOpen ? 1 : 0,
        overflow: 'hidden',
        display: isOpen ? 'block' : 'none',
      });
      firstRun.current = false;
      return;
    }

    if (isOpen) {
      gsap.set(el, { display: 'block', overflow: 'hidden' });
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.55,
          ease: 'expo.out',
          onComplete: () => gsap.set(el, { overflow: 'visible' }),
        }
      );
      const inner = el.querySelector('.collapsible-inner');
      if (inner) {
        gsap.fromTo(
          inner,
          { y: 16, opacity: 0, skewY: 0.8 },
          { y: 0, opacity: 1, skewY: 0, duration: 0.75, ease: 'expo.out', delay: 0.08 }
        );
      }
    } else {
      gsap.set(el, { overflow: 'hidden' });
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'expo.in',
        onComplete: () => gsap.set(el, { display: 'none' }),
      });
    }
  }, [isOpen]);

  return { panelRef };
}

/**
 * Staggered grid entrance for card lists.
 * Returns { containerRef } — attach to the grid wrapper.
 */
export function useStaggerGrid(items, options = {}) {
  const containerRef = useRef(null);
  const { delay = 0, stagger = 0.07, y = 28 } = options;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !items?.length) return;

    const ctx = gsap.context(() => {
      const cards = el.querySelectorAll(':scope > *');
      gsap.fromTo(
        cards,
        { y, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.75,
          ease: 'expo.out',
          stagger,
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [items]);

  return { containerRef };
}

/**
 * Page header entrance (heading rise + deskew, divider scaleX).
 * Returns { headerRef } — attach to the header wrapper.
 */
export function useHeaderEntrance() {
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      const heading = el.querySelector('.page-heading');
      const divider = el.querySelector('.page-divider');

      if (heading) {
        gsap.fromTo(heading,
          { y: 40, opacity: 0, skewY: 2 },
          { y: 0, opacity: 1, skewY: 0, duration: 1.0, ease: 'expo.out' }
        );
      }
      if (divider) {
        gsap.fromTo(divider,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 1.1, ease: 'expo.out', delay: 0.15 }
        );
      }
    }, el);

    return () => ctx.revert();
  }, []);

  return { headerRef };
}