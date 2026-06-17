import { useRef, useEffect, useState, useCallback } from 'react';

export function useCarousel({ cardSelector, gap = 24 } = {}) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getCardWidth = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const card = el.querySelector(cardSelector);
    if (!card) return 0;
    return card.offsetWidth + gap;
  }, [cardSelector, gap]);

  const scroll = useCallback((dir) => {
    const amount = getCardWidth();
    if (!amount) return;
    scrollRef.current?.scrollBy({ left: dir * amount, behavior: 'smooth' });
  }, [getCardWidth]);

  const scrollTo = useCallback((index) => {
    const amount = getCardWidth();
    if (!amount) return;
    scrollRef.current?.scrollTo({ left: index * amount, behavior: 'smooth' });
  }, [getCardWidth]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const amount = getCardWidth();
      if (!amount) return;
      const index = Math.round(el.scrollLeft / amount);
      setActiveIndex(index);
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, [getCardWidth]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const interval = setInterval(() => {
      const amount = getCardWidth();
      if (!amount) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: amount, behavior: 'smooth' });
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [getCardWidth]);

  return { scrollRef, activeIndex, scroll, scrollTo };
}
