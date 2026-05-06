import { ArrowRight, Sparkles, Star, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      <section className="hero-section">
        <Image fill src="/images/site-banner.jpg" alt="بلانكو" priority style={{ objectFit: "cover", objectPosition: "center top" }} sizes="100vw" />

        {/* Overlays */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.65) 55%, rgba(15,23,42,0.2) 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 220, background: "linear-gradient(to top, rgba(245,158,11,0.16), transparent)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.08) 0%, transparent 60%)" }} />

        {/* Floating orb */}
        <div className="hero-orb animate-float" />

        {/* Content */}
        <div style={{ position: "relative", height: "100%", display: "flex", alignItems: "center" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", width: "100%" }}>
            <div className="hero-inner">

              {/* Badge */}
              <div className="hero-badge animate-slide-right delay-100">
                <Sparkles size={13} style={{ color: "#fcd34d" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "#fcd34d" }}>
                  تشكيلة ربيع وصيف 2026
                </span>
              </div>

              {/* Headline */}
              <h1 className="hero-h1 animate-fade-up delay-200 sparkle-text">
                تألّقي بأسلوبك <span style={{ fontWeight: 300, fontStyle: "italic" }}>الخاص</span>
              </h1>

              <p className="hero-sub animate-fade-up delay-300">
                تشكيلة أزياء فاخرة مختارة بعناية — قطع تجمع بين الأناقة والراحة لتناسب كل مناسبة في حياتك.
              </p>

              <div className="hero-btns animate-fade-up delay-400">
                <Link href="/shop" className="btn-gold">
                  استكشفي المجموعة <ArrowRight size={16} />
                </Link>
                <Link href="/shop?featured=true" className="btn-outline-white">
                  القطع المميزة
                </Link>
              </div>

              {/* Stats strip */}
              <div className="hero-stats animate-fade-up delay-400">
                {[
                  { v: "+50K", l: "عميلة سعيدة" },
                  { v: "500+", l: "منتج حصري" },
                  { v: "60%",  l: "خصم على العروض" },
                  { v: "4.9★", l: "تقييم العملاء" },
                ].map(s => (
                  <div key={s.l} className="hero-stat">
                    <span className="hero-stat-val">{s.v}</span>
                    <span className="hero-stat-lbl">{s.l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-ind">
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.32)", writingMode: "vertical-rl" }}>اكتشف المزيد</span>
          <div style={{ width: 1.5, height: 40, background: "linear-gradient(to bottom, rgba(245,158,11,0.6), transparent)" }} />
        </div>
      </section>

      <style>{`
        .hero-stats {
          display: flex;
          gap: 32px;
          margin-top: 44px;
          padding-top: 32px;
          border-top: 1px solid rgba(255,255,255,0.1);
          flex-wrap: wrap;
        }
        .hero-stat { display: flex; flex-direction: column; gap: 4px; }
        .hero-stat-val { font-size: clamp(1.2rem, 2.5vw, 1.6rem); font-weight: 900; color: #f59e0b; line-height: 1; }
        .hero-stat-lbl { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); letter-spacing: 0.08em; }
        @media(max-width:560px){ .hero-stats { gap: 20px; } }
      `}</style>
    </>
  );
}
