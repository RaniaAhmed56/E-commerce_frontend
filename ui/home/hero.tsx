"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    img:     "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=90",
    tag:     "Spring / Summer 2026",
    title:   ["Dress with", "Intention."],
    italic:  1,
    sub:     "Curated luxury fashion — timeless pieces crafted for modern living.",
    cta:     "Shop the Collection",
    ctaLink: "/shop",
    accent:  "#f59e0b",
    pos:     "center 20%",
  },
  {
    img:     "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&q=90",
    tag:     "Exclusive Arrivals",
    title:   ["New Season,", "New You."],
    italic:  1,
    sub:     "Discover over 500 exclusive pieces from our latest collection.",
    cta:     "Explore New Arrivals",
    ctaLink: "/shop?sort=newest",
    accent:  "#60a5fa",
    pos:     "center top",
  },
  {
    img:     "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1800&q=90",
    tag:     "Season Sale — Up to 60% Off",
    title:   ["Final Hours,", "Best Prices."],
    italic:  1,
    sub:     "Last chance to grab your favourites at incredible prices.",
    cta:     "Shop the Sale",
    ctaLink: "/shop?featured=true",
    accent:  "#34d399",
    pos:     "center 40%",
  },
];

const STATS = [
  { v: "+50K", l: "Happy Customers" },
  { v: "500+", l: "Exclusive Pieces" },
  { v: "60%",  l: "Season Offers" },
  { v: "4.9★", l: "Avg. Rating" },
];

export default function Hero() {
  const [idx, setIdx]       = useState(0);
  const [prev, setPrev]     = useState<number | null>(null);
  const [dir, setDir]       = useState<"next"|"prev">("next");
  const [animating, setAnim] = useState(false);

  const go = useCallback((to: number, direction: "next"|"prev") => {
    if (animating) return;
    setAnim(true);
    setDir(direction);
    setPrev(idx);
    setIdx(to);
    setTimeout(() => { setPrev(null); setAnim(false); }, 700);
  }, [animating, idx]);

  const next = () => go((idx + 1) % slides.length, "next");
  const goTo = (i: number) => i !== idx && go(i, i > idx ? "next" : "prev");

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [idx, animating]);

  const s = slides[idx];
  const p = prev !== null ? slides[prev] : null;

  return (
    <>
      <section className="hero-section" style={{ position:"relative", overflow:"hidden" }}>

        {/* ── Slides ───────────────────────────────── */}
        {p && (
          <div key={`prev-${prev}`} className={`hero-slide hero-slide--exit-${dir}`}
            style={{ backgroundImage:`url(${p.img})`, backgroundPosition:p.pos }}>
            <div className="hero-overlay" />
          </div>
        )}
        <div key={`curr-${idx}`} className={`hero-slide hero-slide--enter-${dir}${animating?"":""}`}
          style={{ backgroundImage:`url(${s.img})`, backgroundPosition:s.pos }}>
          <div className="hero-overlay" />
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 20% 55%, ${s.accent}14 0%, transparent 55%)` }} />
        </div>

        {/* ── Content ──────────────────────────────── */}
        <div style={{ position:"relative", height:"100%", display:"flex", alignItems:"center", zIndex:2 }}>
          <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 32px", width:"100%" }}>
            <div className="hero-inner">

              {/* Badge */}
              <div key={`badge-${idx}`} className="hero-badge hero-content-in" style={{ animationDelay:"0.05s" }}>
                <Sparkles size={13} style={{ color:"#fcd34d" }} />
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:"#fcd34d" }}>{s.tag}</span>
              </div>

              {/* Headline */}
              <h1 key={`h1-${idx}`} className="hero-content-in" style={{ animationDelay:"0.15s", fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(3.2rem,7.5vw,7rem)", fontWeight:800, lineHeight:0.95, color:"#fff", margin:"0 0 26px", letterSpacing:"-0.02em" }}>
                {s.title.map((line, li) => (
                  <span key={li} style={{ display:"block", fontStyle: li === s.italic ? "italic" : "normal", color: li === s.italic ? s.accent : "#ffffff" }}>
                    {line}
                  </span>
                ))}
              </h1>

              <p key={`sub-${idx}`} className="hero-content-in" style={{ animationDelay:"0.25s", fontSize:"clamp(14px,1.7vw,18px)", color:"rgba(255,255,255,0.58)", lineHeight:1.8, maxWidth:460, margin:"0 0 40px" }}>
                {s.sub}
              </p>

              <div key={`btns-${idx}`} className="hero-btns hero-content-in" style={{ animationDelay:"0.35s" }}>
                <Link href={s.ctaLink} className="btn-gold" style={{ fontSize:13 }}>
                  {s.cta} <ArrowRight size={16} />
                </Link>
                <Link href="/shop" className="btn-outline-white" style={{ fontSize:13 }}>
                  Browse All
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats hero-content-in" style={{ animationDelay:"0.45s" }}>
                {STATS.map(st => (
                  <div key={st.l} className="hero-stat">
                    <span className="hero-stat-val">{st.v}</span>
                    <span className="hero-stat-lbl">{st.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Nav arrows ───────────────────────────── */}
        <button onClick={() => go((idx - 1 + slides.length) % slides.length, "prev")}
          className="hero-arrow hero-arrow--left" aria-label="Previous slide">
          <ArrowLeft size={20} />
        </button>
        <button onClick={next} className="hero-arrow hero-arrow--right" aria-label="Next slide">
          <ArrowRight size={20} />
        </button>

        {/* ── Dots ─────────────────────────────────── */}
        <div className="hero-dots">
          {slides.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className={`hero-dot${i === idx ? " active" : ""}`}
              style={{ "--dot-color": slides[i].accent } as any} aria-label={`Slide ${i+1}`} />
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-ind">
          <span style={{ fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", writingMode:"vertical-rl" }}>Scroll</span>
          <div style={{ width:1.5, height:44, background:"linear-gradient(to bottom, rgba(245,158,11,0.5), transparent)" }} />
        </div>
      </section>

      <style>{`
        /* ── Slide base ─────────────────────────── */
        .hero-slide {
          position: absolute; inset: 0;
          background-size: cover;
          will-change: transform, opacity;
        }
        .hero-overlay {
          position:absolute; inset:0;
          background: linear-gradient(110deg, rgba(8,12,24,0.96) 0%, rgba(8,12,24,0.70) 50%, rgba(8,12,24,0.18) 100%);
        }

        /* ── Enter animations ───────────────────── */
        .hero-slide--enter-next {
          animation: slideEnterRight 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .hero-slide--enter-prev {
          animation: slideEnterLeft 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        /* ── Exit animations ────────────────────── */
        .hero-slide--exit-next {
          animation: slideExitLeft 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .hero-slide--exit-prev {
          animation: slideExitRight 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes slideEnterRight { from{transform:translateX(6%) scale(1.02);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
        @keyframes slideEnterLeft  { from{transform:translateX(-6%) scale(1.02);opacity:0} to{transform:translateX(0) scale(1);opacity:1} }
        @keyframes slideExitLeft   { from{transform:translateX(0);opacity:1} to{transform:translateX(-5%);opacity:0} }
        @keyframes slideExitRight  { from{transform:translateX(0);opacity:1} to{transform:translateX(5%);opacity:0} }

        /* ── Content fade-in ────────────────────── */
        .hero-content-in {
          animation: contentIn 0.65s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes contentIn { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }

        /* ── Stats ──────────────────────────────── */
        .hero-stats { display:flex; gap:36px; margin-top:48px; padding-top:30px; border-top:1px solid rgba(255,255,255,0.09); flex-wrap:wrap; }
        .hero-stat  { display:flex; flex-direction:column; gap:4px; }
        .hero-stat-val { font-size:clamp(1.2rem,2.5vw,1.6rem); font-weight:900; color:#f59e0b; line-height:1; font-family:var(--font-cormorant,Georgia,serif); }
        .hero-stat-lbl { font-size:10px; font-weight:700; color:rgba(255,255,255,0.36); letter-spacing:0.14em; text-transform:uppercase; }

        /* ── Arrows ─────────────────────────────── */
        .hero-arrow {
          position:absolute; top:50%; transform:translateY(-50%); z-index:10;
          width:52px; height:52px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.18);
          background:rgba(10,14,28,0.55); backdrop-filter:blur(10px);
          display:flex; align-items:center; justify-content:center;
          color:#fff; cursor:pointer; transition:all 0.25s;
        }
        .hero-arrow:hover { background:rgba(245,158,11,0.85); border-color:#f59e0b; transform:translateY(-50%) scale(1.08); }
        .hero-arrow--left  { left:28px; }
        .hero-arrow--right { right:28px; }

        /* ── Dots ───────────────────────────────── */
        .hero-dots { position:absolute; bottom:36px; left:50%; transform:translateX(-50%); display:flex; gap:10px; z-index:10; }
        .hero-dot {
          width:8px; height:8px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.4);
          background:transparent; cursor:pointer; transition:all 0.35s; padding:0;
        }
        .hero-dot.active { width:28px; border-radius:4px; background:var(--dot-color,#f59e0b); border-color:var(--dot-color,#f59e0b); }

        @media(max-width:600px){
          .hero-stats{gap:18px}
          .hero-arrow{width:40px;height:40px}
          .hero-arrow--left{left:14px}
          .hero-arrow--right{right:14px}
        }
      `}</style>
    </>
  );
}
