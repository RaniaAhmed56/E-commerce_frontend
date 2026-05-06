import { ArrowRight, Tag, Zap, Clock, Star, Gift } from "lucide-react";
import Link from "next/link";

interface PromoCard {
  tag: string;
  TagIcon: any;
  title: string;
  pct: string;
  sub: string;
  img: string;
  href: string;
  accent: string;
}

const promos: PromoCard[] = [
  {
    tag: "عرض محدود",
    TagIcon: Tag,
    title: "خصومات\nالربيع",
    pct: "50%",
    sub: "على تشكيلة مختارة · لفترة محدودة فقط",
    img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85",
    href: "/shop",
    accent: "#f59e0b",
  },
  {
    tag: "فلاش سيل",
    TagIcon: Zap,
    title: "تشكيلة\nالصيف",
    pct: "40%",
    sub: "ملابس خفيفة وأناقة لا تنتهي",
    img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=900&q=85",
    href: "/shop?sort=price_low",
    accent: "#3b82f6",
  },
  {
    tag: "عروض نهاية الموسم",
    TagIcon: Clock,
    title: "لا تفوتي\nالفرصة",
    pct: "60%",
    sub: "آخر فرصة للحصول على أفضل الأسعار",
    img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=85",
    href: "/shop?featured=true",
    accent: "#10b981",
  },
];

export default function PromoSplit() {
  return (
    <>
      {/* ── Main wide promo ─────────────────────────────── */}
      <section className="promo-section">
        <div className="promo-text-side">
          <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(circle, #f59e0b 1.5px, transparent 0)", backgroundSize: "28px 28px" }} />
          <div style={{ position: "absolute", top: "50%", left: "40%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.18), transparent 70%)", transform: "translate(-50%, -50%)", pointerEvents: "none" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Tag size={15} style={{ color: "#fcd34d" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", color: "#fcd34d" }}>عرض محدود</span>
            </div>
            <h2 className="promo-h2">خصومات<br />الربيع</h2>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 10 }}>
              <span className="promo-pct">50%</span>
              <span style={{ fontSize: 18, color: "rgba(255,255,255,0.42)", fontWeight: 400, marginBottom: 6 }}>خصم</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 36 }}>على تشكيلة مختارة · لفترة محدودة فقط</p>
            <Link href="/shop" className="btn-gold" style={{ display: "inline-flex", fontSize: 13 }}>تسوق العروض الآن <ArrowRight size={16} /></Link>
          </div>
        </div>
        <div className="promo-img-side group" style={{ position: "relative", overflow: "hidden" }}>
          <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&q=85" alt="خصومات الربيع" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.85s ease" }} className="promo-img" />
          <div style={{ position: "absolute", top: 28, right: 28 }}>
            <div className="promo-badge animate-pulse-gold">
              <span className="promo-badge-pct">50%</span>
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>خصم</span>
            </div>
          </div>
          <div className="promo-tag">
            <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#0f172a", margin: 0 }}>تسوق الآن →</p>
          </div>
        </div>
      </section>

      {/* ── 3 small promo cards ─────────────────────────── */}
      <section style={{ background: "#0f172a", padding: "72px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p className="section-tag" style={{ justifyContent: "center", marginBottom: 12 }}>عروض حصرية</p>
            <h2 style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 800, color: "#fff", margin: 0 }}>لا تفوتي هذه العروض</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
            {promos.map((p, i) => (
              <Link key={i} href={p.href} style={{ textDecoration: "none", display: "block", borderRadius: 20, overflow: "hidden", position: "relative", minHeight: 340, background: "#1e293b", boxShadow: "0 8px 32px rgba(0,0,0,0.35)", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.5)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,0,0,0.35)"; }}>
                {/* Image */}
                <img src={p.img} alt={p.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.55, transition: "opacity 0.3s" }} />
                {/* Gradient */}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.5) 50%, transparent 100%)" }} />
                {/* Content */}
                <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "24px 22px" }}>
                  {/* Tag */}
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
                    <p.TagIcon size={13} style={{ color: p.accent }} />
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.26em", textTransform: "uppercase", color: p.accent }}>{p.tag}</span>
                  </div>
                  <h3 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", margin: "0 0 8px", lineHeight: 1.1, whiteSpace: "pre-line" }}>{p.title}</h3>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 16px", letterSpacing: "0.06em" }}>{p.sub}</p>
                  {/* Discount pill */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ background: p.accent, borderRadius: 24, padding: "6px 16px", display: "inline-flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "#0f172a", lineHeight: 1 }}>{p.pct}</span>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "#0f172a", letterSpacing: "0.1em" }}>خصم</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>
                      تسوق الآن <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Gift / loyalty strip ────────────────────────── */}
      <section style={{ background: "linear-gradient(135deg,#1e293b 0%,#0f172a 100%)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "48px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Gift size={24} style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>هل لديك كوبون خصم؟</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: 0 }}>سجلي دخولك وتحققي من كوبوناتك الحصرية في صفحة الملف الشخصي</p>
            </div>
          </div>
          <Link href="/profile" className="btn-gold" style={{ display: "inline-flex", fontSize: 13, flexShrink: 0 }}>
            عرض الكوبونات <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Flash sale banner ───────────────────────────── */}
      <section style={{ background: "linear-gradient(90deg,#d97706 0%,#f59e0b 50%,#fcd34d 100%)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
          <Zap size={18} style={{ color: "#0f172a" }} />
          <p style={{ fontSize: 14, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            فلاش سيل · خصم يصل إلى 60% · اليوم فقط
          </p>
          <Link href="/shop" style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", textDecoration: "none", background: "rgba(0,0,0,0.15)", padding: "6px 14px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 6 }}>
            تسوق الآن <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <style>{`
        .promo-section { display:grid; grid-template-columns:1fr 1fr; min-height:520px; }
        .promo-text-side { position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:center; padding:64px 72px; background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%); }
        .promo-h2 { font-family:var(--font-cormorant,Georgia,serif); font-size:clamp(2.4rem,4.5vw,5rem); font-weight:800; color:#fff; line-height:1; margin-bottom:14px; }
        .promo-pct { font-family:var(--font-cormorant,Georgia,serif); font-size:clamp(3rem,5.5vw,6rem); font-weight:900; color:#f59e0b; line-height:1; }
        .promo-img-side { position:relative; min-height:360px; overflow:hidden; }
        .promo-badge { width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg,#fcd34d 0%,#f59e0b 60%,#d97706 100%); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#0f172a; box-shadow:0 8px 32px rgba(245,158,11,0.55); }
        .promo-badge-pct { font-family:var(--font-cormorant,Georgia,serif); font-size:1.6rem; font-weight:900; line-height:1; }
        .promo-tag { position:absolute; bottom:28px; left:28px; background:rgba(255,255,255,0.95); backdrop-filter:blur(8px); padding:11px 18px; border-radius:6px; opacity:0; transform:translateY(8px); transition:all 0.35s ease; }
        .promo-img-side:hover .promo-tag { opacity:1; transform:translateY(0); }
        .promo-img-side:hover .promo-img { transform:scale(1.05); }
        @media(max-width:820px){ .promo-section{grid-template-columns:1fr} .promo-text-side{padding:52px 36px;order:2} .promo-img-side{min-height:300px;order:1} }
        @media(max-width:480px){ .promo-text-side{padding:40px 24px} .promo-img-side{min-height:240px} .promo-h2{font-size:2.2rem} .promo-pct{font-size:2.8rem} }
      `}</style>
    </>
  );
}
