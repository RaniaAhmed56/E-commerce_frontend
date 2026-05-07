import { ArrowRight, Tag, Zap, Clock, Gift } from "lucide-react";
import Link from "next/link";

const promos = [
  {
    tag:"Limited Offer", TagIcon:Tag,
    title:"Spring\nSale",
    pct:"50%", sub:"On selected styles · Limited time only",
    img:"https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85",
    href:"/shop", accent:"#f59e0b",
  },
  {
    tag:"Flash Sale", TagIcon:Zap,
    title:"Summer\nEdit",
    pct:"40%", sub:"Light fabrics, endless elegance",
    img:"https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=85",
    href:"/shop?sort=price_low", accent:"#3b82f6",
  },
  {
    tag:"End of Season", TagIcon:Clock,
    title:"Last\nChance",
    pct:"60%", sub:"Final markdowns on bestsellers",
    img:"https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85",
    href:"/shop?featured=true", accent:"#10b981",
  },
];

export default function PromoSplit() {
  return (
    <>
      {/* ── Main hero promo ─────────────────────── */}
      <section className="promo-section">
        <div className="promo-text-side">
          <div style={{ position:"absolute", inset:0, opacity:0.05, backgroundImage:"radial-gradient(circle, #f59e0b 1.5px, transparent 0)", backgroundSize:"28px 28px" }} />
          <div style={{ position:"relative" }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:20 }}>
              <Tag size={14} style={{ color:"#fcd34d" }} />
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:"#fcd34d" }}>Limited Offer</span>
            </div>
            <h2 className="promo-h2">Spring<br />Discounts</h2>
            <div style={{ display:"flex", alignItems:"flex-end", gap:10, marginBottom:10 }}>
              <span className="promo-pct">50%</span>
              <span style={{ fontSize:18, color:"rgba(255,255,255,0.38)", fontWeight:400, marginBottom:6 }}>OFF</span>
            </div>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,255,255,0.28)", marginBottom:36 }}>
              On selected collections · Limited time only
            </p>
            <Link href="/shop" className="btn-gold" style={{ display:"inline-flex", fontSize:13 }}>
              Shop Offers Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="promo-img-side">
          <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=85" alt="Spring Sale"
            style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.85s ease" }}
            className="promo-img" />
          <div style={{ position:"absolute", top:28, right:28 }}>
            <div className="promo-badge">
              <span className="promo-badge-pct">50%</span>
              <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase" }}>OFF</span>
            </div>
          </div>
          <div className="promo-tag">
            <p style={{ fontSize:12, fontWeight:800, letterSpacing:"0.2em", textTransform:"uppercase", color:"#0f172a", margin:0 }}>Shop Now →</p>
          </div>
        </div>
      </section>

      {/* ── 3 promo cards ───────────────────────── */}
      <section style={{ background:"#0a0e1c", padding:"80px 0" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ textAlign:"center", marginBottom:52 }}>
            <p className="section-tag" style={{ justifyContent:"center", marginBottom:12 }}>Exclusive Deals</p>
            <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.4rem)", fontWeight:800, color:"#fff", margin:0, fontFamily:"var(--font-cormorant,Georgia,serif)" }}>Don't Miss These Offers</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
            {promos.map((p,i) => (
              <Link key={i} href={p.href} style={{ textDecoration:"none", display:"block", borderRadius:20, overflow:"hidden", position:"relative", minHeight:340, background:"#1e293b", boxShadow:"0 8px 32px rgba(0,0,0,0.35)", transition:"transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.transform="translateY(-6px)"; el.style.boxShadow="0 20px 48px rgba(0,0,0,0.5)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.transform="translateY(0)"; el.style.boxShadow="0 8px 32px rgba(0,0,0,0.35)"; }}>
                <img src={p.img} alt={p.title} style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", opacity:0.5 }} />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,14,28,0.97) 0%, rgba(10,14,28,0.45) 55%, transparent 100%)" }} />
                <div style={{ position:"relative", height:"100%", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"24px 22px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:12 }}>
                    <p.TagIcon size={13} style={{ color:p.accent }} />
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.26em", textTransform:"uppercase", color:p.accent }}>{p.tag}</span>
                  </div>
                  <h3 style={{ fontSize:"1.6rem", fontWeight:800, color:"#fff", margin:"0 0 8px", lineHeight:1.1, whiteSpace:"pre-line", fontFamily:"var(--font-cormorant,Georgia,serif)" }}>{p.title}</h3>
                  <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:"0 0 16px", letterSpacing:"0.06em" }}>{p.sub}</p>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                    <div style={{ background:p.accent, borderRadius:24, padding:"6px 16px", display:"inline-flex", alignItems:"baseline", gap:4 }}>
                      <span style={{ fontSize:"1.4rem", fontWeight:900, color:"#0f172a", lineHeight:1 }}>{p.pct}</span>
                      <span style={{ fontSize:10, fontWeight:800, color:"#0f172a", letterSpacing:"0.1em" }}>OFF</span>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, fontWeight:700, color:"rgba(255,255,255,0.6)" }}>
                      Shop Now <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coupon strip ────────────────────────── */}
      <section style={{ background:"linear-gradient(135deg,#1e293b,#0f172a)", borderTop:"1px solid rgba(255,255,255,0.06)", padding:"48px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:20 }}>
            <div style={{ width:56, height:56, borderRadius:"50%", background:"rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <Gift size={24} style={{ color:"#f59e0b" }} />
            </div>
            <div>
              <p style={{ fontSize:18, fontWeight:800, color:"#fff", margin:"0 0 4px" }}>Got a Coupon Code?</p>
              <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", margin:0 }}>Sign in and check your exclusive discount coupons in your profile</p>
            </div>
          </div>
          <Link href="/profile" className="btn-gold" style={{ display:"inline-flex", fontSize:13, flexShrink:0 }}>
            View Coupons <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ── Flash sale banner ───────────────────── */}
      <section style={{ background:"linear-gradient(90deg,#d97706,#f59e0b,#fcd34d)", padding:"18px 24px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
          <Zap size={17} style={{ color:"#0f172a" }} />
          <p style={{ fontSize:13, fontWeight:800, color:"#0f172a", margin:0, letterSpacing:"0.12em", textTransform:"uppercase" }}>
            Flash Sale · Up to 60% Off · Today Only
          </p>
          <Link href="/shop" style={{ fontSize:12, fontWeight:800, color:"#0f172a", textDecoration:"none", background:"rgba(0,0,0,0.14)", padding:"6px 14px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:6 }}>
            Shop Now <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <style>{`
        .promo-section { display:grid; grid-template-columns:1fr 1fr; min-height:520px; }
        .promo-text-side { position:relative; overflow:hidden; display:flex; flex-direction:column; justify-content:center; padding:64px 72px; background:linear-gradient(135deg,#0a0e1c,#1e293b); }
        .promo-h2 { font-family:var(--font-cormorant,Georgia,serif); font-size:clamp(2.4rem,4.5vw,5rem); font-weight:800; color:#fff; line-height:1; margin-bottom:14px; }
        .promo-pct { font-family:var(--font-cormorant,Georgia,serif); font-size:clamp(3rem,5.5vw,6rem); font-weight:900; color:#f59e0b; line-height:1; }
        .promo-img-side { position:relative; min-height:360px; overflow:hidden; }
        .promo-badge { width:90px; height:90px; border-radius:50%; background:linear-gradient(135deg,#fcd34d,#f59e0b,#d97706); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#0f172a; box-shadow:0 8px 32px rgba(245,158,11,0.5); }
        .promo-badge-pct { font-family:var(--font-cormorant,Georgia,serif); font-size:1.6rem; font-weight:900; line-height:1; }
        .promo-tag { position:absolute; bottom:28px; left:28px; background:rgba(255,255,255,0.95); backdrop-filter:blur(8px); padding:11px 18px; border-radius:6px; opacity:0; transform:translateY(8px); transition:all 0.35s; }
        .promo-img-side:hover .promo-tag { opacity:1; transform:translateY(0); }
        .promo-img-side:hover .promo-img { transform:scale(1.05); }
        @media(max-width:820px){ .promo-section{grid-template-columns:1fr} .promo-text-side{padding:52px 36px;order:2} .promo-img-side{min-height:300px;order:1} }
      `}</style>
    </>
  );
}
