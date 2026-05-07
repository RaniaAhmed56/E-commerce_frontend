import { Star, Quote } from "lucide-react";

const reviews = [
  { name:"Sarah M.", role:"Fashion Designer", review:"Exceptional quality that speaks for itself. Every piece feels handpicked — the craftsmanship is extraordinary. I keep coming back.", init:"S" },
  { name:"James K.", role:"Creative Director", review:"Finally found my go-to fashion brand. The quality, style, and price point are all perfectly balanced. Highly recommend to everyone.", init:"J" },
  { name:"Mona A.", role:"Lifestyle Blogger", review:"BLANKO truly understands modern elegance. Premium basics for every occasion, lightning-fast shipping, and gorgeous packaging.", init:"M" },
  { name:"Lucas B.", role:"Architect", review:"The attention to detail in every garment is remarkable. Clean lines, quality fabrics, and a brand that genuinely cares about style.", init:"L" },
];

export default function Testimonials() {
  return (
    <>
      <section style={{ padding:"88px 0", background:"#f8fafc" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <p className="section-tag" style={{ justifyContent:"center", marginBottom:14, color:"#d97706" }}>Customer Stories</p>
            <h2 style={{ fontSize:"clamp(1.6rem,4vw,2.8rem)", fontWeight:800, color:"#0f172a", margin:"0 0 12px", fontFamily:"var(--font-cormorant,Georgia,serif)" }}>
              What Our Clients Say
            </h2>
            <p style={{ fontSize:15, color:"#64748b", margin:0 }}>Over 50,000 happy customers trust BLANKO</p>
          </div>

          <div className="test-grid">
            {reviews.map((r,i) => (
              <div key={i} className="test-card"
                onMouseEnter={e => { const el=e.currentTarget as HTMLDivElement; el.style.background="#0f172a"; el.style.borderColor="#0f172a"; el.style.transform="translateY(-6px)"; el.style.boxShadow="0 20px 56px rgba(15,23,42,0.16)"; el.querySelector<HTMLElement>(".test-text")!.style.color="rgba(255,255,255,0.72)"; el.querySelector<HTMLElement>(".test-name")!.style.color="#ffffff"; el.querySelector<HTMLElement>(".test-role")!.style.color="rgba(255,255,255,0.4)"; }}
                onMouseLeave={e => { const el=e.currentTarget as HTMLDivElement; el.style.background="#ffffff"; el.style.borderColor="#f1f5f9"; el.style.transform="translateY(0)"; el.style.boxShadow="0 2px 12px rgba(0,0,0,0.04)"; el.querySelector<HTMLElement>(".test-text")!.style.color="#334155"; el.querySelector<HTMLElement>(".test-name")!.style.color="#0f172a"; el.querySelector<HTMLElement>(".test-role")!.style.color="#94a3b8"; }}>
                {/* Stars */}
                <div style={{ display:"flex", gap:3, marginBottom:18 }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={13} style={{ color:"#f59e0b", fill:"#f59e0b" }} />)}
                </div>
                {/* Quote icon */}
                <Quote size={28} style={{ color:"#f59e0b", opacity:0.25, marginBottom:12, display:"block" }} />
                <p className="test-text" style={{ fontSize:14, lineHeight:1.8, color:"#334155", margin:"0 0 24px", transition:"color 0.3s" }}>
                  "{r.review}"
                </p>
                {/* Avatar */}
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:44, height:44, borderRadius:"50%", background:"linear-gradient(135deg,#f59e0b,#d97706)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, fontWeight:800, color:"#0f172a", flexShrink:0 }}>
                    {r.init}
                  </div>
                  <div>
                    <p className="test-name" style={{ fontSize:14, fontWeight:800, color:"#0f172a", margin:"0 0 2px", transition:"color 0.3s" }}>{r.name}</p>
                    <p className="test-role" style={{ fontSize:12, color:"#94a3b8", margin:0, fontWeight:500, transition:"color 0.3s" }}>{r.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <style>{`
        .test-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .test-card { background:#ffffff; border:1.5px solid #f1f5f9; border-radius:18px; padding:28px; transition:all 0.32s; box-shadow:0 2px 12px rgba(0,0,0,0.04); cursor:default; }
        @media(max-width:1100px){ .test-grid{grid-template-columns:repeat(2,1fr)} }
        @media(max-width:600px) { .test-grid{grid-template-columns:1fr} }
      `}</style>
    </>
  );
}
