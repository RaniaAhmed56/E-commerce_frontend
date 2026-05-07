"use client";
import Link from "next/link";
import {
  Heart, Zap, Award, Target, Eye, Sparkles,
  ArrowRight, Star, Package, MessageCircle, Check,
  ShieldCheck, TrendingUp, Globe, Users,
} from "lucide-react";

const stats = [
  { value: "50K+",  label: "Happy Customers" },
  { value: "500+",  label: "Exclusive Pieces" },
  { value: "4.9★",  label: "Average Rating" },
  { value: "2022",  label: "Year Founded" },
];

const values = [
  { Icon: Target, title: "Our Mission",  color: "#f59e0b",
    desc: "To deliver premium fashion that seamlessly unites elegance and everyday comfort — with a shopping experience that consistently exceeds expectations." },
  { Icon: Eye,    title: "Our Vision",   color: "#60a5fa",
    desc: "To become the leading destination for luxury fashion in the region, where every customer feels genuinely seen, valued, and styled." },
  { Icon: Heart,  title: "Our Values",   color: "#34d399",
    desc: "Quality before quantity. Deep respect for our clients. Constant innovation. And a sincere responsibility toward our community and the environment." },
];

const pillars = [
  { Icon: ShieldCheck, title: "Guaranteed Quality",   desc: "Every piece passes rigorous quality control before it reaches your hands — no compromises." },
  { Icon: Zap,         title: "Fast Delivery",         desc: "Orders delivered in 24–48 hours across Egypt, with real-time tracking at every step." },
  { Icon: Heart,       title: "Exceptional Service",   desc: "Our dedicated team is available 7 days a week, ready to assist with warmth and expertise." },
  { Icon: TrendingUp,  title: "Global Trend Curation", desc: "We monitor worldwide fashion movements and handpick only what truly suits our clientele." },
  { Icon: Globe,       title: "Inclusive Range",        desc: "From women to men, kids to accessories — a curated world of style for every member of the family." },
  { Icon: Award,       title: "Award-Winning Design",   desc: "Our in-house team collaborates with top designers to bring original, wearable art to life." },
];

const milestones = [
  { year: "2022", title: "BLANKO Founded",        desc: "Launched with a curated collection of 50 luxury pieces in Cairo." },
  { year: "2023", title: "10,000 Happy Clients",   desc: "Reached our first milestone and expanded to all Egyptian governorates." },
  { year: "2024", title: "Digital Expansion",      desc: "Launched our e-commerce platform, bringing BLANKO to customers nationwide." },
  { year: "2025", title: "50K+ Community",          desc: "Grew to over 50,000 loyal customers and introduced the exclusive membership programme." },
  { year: "2026", title: "Luxury Redefined",        desc: "New collections, international sourcing, and a renewed commitment to sustainable fashion." },
];

const team = [
  { name: "Nour Al-Hoda", role: "Creative Director",    init: "N", color: "#f59e0b",
    desc: "10+ years in haute couture. Leads all creative vision and collection direction." },
  { name: "Ahmed Samir",  role: "Operations Director",  init: "A", color: "#60a5fa",
    desc: "Logistics & supply chain expert ensuring every order arrives flawlessly." },
  { name: "Dina Mostafa", role: "Customer Experience",  init: "D", color: "#34d399",
    desc: "Passionate about people. Shapes every touchpoint of the BLANKO experience." },
];

export default function AboutPage() {
  return (
    <div style={{ background:"#ffffff", color:"#0f172a", minHeight:"100vh" }}>

      {/* ── Hero ─────────────────────────────────────── */}
      <section style={{ position:"relative", minHeight:"70vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden" }}>
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1800&q=90"
          alt="BLANKO Fashion House"
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 25%" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg, rgba(10,14,28,0.93) 0%, rgba(10,14,28,0.65) 55%, rgba(10,14,28,0.28) 100%)" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:220, background:"linear-gradient(to top, rgba(255,255,255,1), transparent)" }} />

        <div style={{ position:"relative", maxWidth:900, margin:"0 auto", padding:"100px 24px 80px", textAlign:"center" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:9, padding:"8px 20px", background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:50, marginBottom:28, backdropFilter:"blur(8px)" }}>
            <Sparkles size={13} style={{ color:"#fcd34d" }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:"#fcd34d" }}>
              Est. 2022 — A Story of Elegance
            </span>
          </div>
          <h1 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(3rem,7vw,6rem)", fontWeight:800, color:"#ffffff", lineHeight:0.95, margin:"0 0 24px" }}>
            Our Story
          </h1>
          <p style={{ fontSize:"clamp(15px,2vw,19px)", color:"rgba(255,255,255,0.62)", lineHeight:1.8, maxWidth:580, margin:"0 auto 48px" }}>
            More than a fashion brand — BLANKO is a movement. We believe that what you wear tells the world who you are before you say a word.
          </p>
          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, maxWidth:700, margin:"0 auto" }}>
            {stats.map(s => (
              <div key={s.label} style={{ textAlign:"center", padding:"16px 12px", background:"rgba(255,255,255,0.07)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:14, backdropFilter:"blur(8px)" }}>
                <p style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:900, color:"#f59e0b", margin:"0 0 4px", lineHeight:1 }}>{s.value}</p>
                <p style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.45)", margin:0, letterSpacing:"0.12em", textTransform:"uppercase" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Brand Story ──────────────────────────────── */}
      <section style={{ padding:"96px 24px", background:"#ffffff", maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:64, alignItems:"center" }}>
          <div>
            <p style={{ fontSize:11, fontWeight:800, letterSpacing:"0.3em", textTransform:"uppercase", color:"#d97706", marginBottom:14 }}>Who We Are</p>
            <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:800, color:"#0f172a", margin:"0 0 24px", lineHeight:1.05 }}>
              Fashion is not just clothing —<br /><span style={{ fontStyle:"italic", color:"#f59e0b" }}>it's identity.</span>
            </h2>
            <p style={{ fontSize:15, color:"#475569", lineHeight:1.85, marginBottom:18 }}>
              BLANKO was born from a simple belief: every person deserves to dress with intention. We started in Cairo in 2022 with a small, meticulously curated collection — and a big vision to redefine accessible luxury in Egypt.
            </p>
            <p style={{ fontSize:15, color:"#475569", lineHeight:1.85, marginBottom:28 }}>
              Today, we serve over 50,000 customers nationwide, offering premium fashion that balances international trends with the unique spirit of our culture. Each piece in our collection is handpicked for quality, fit, and lasting style.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:32 }}>
              {["Handpicked from international suppliers","Strict quality control on every item","Free 30-day returns, no questions asked","Fast delivery across all of Egypt"].map(p=>(
                <div key={p} style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:22, height:22, borderRadius:"50%", background:"rgba(245,158,11,0.12)", border:"1.5px solid rgba(245,158,11,0.35)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <Check size={12} style={{ color:"#f59e0b" }} strokeWidth={3} />
                  </div>
                  <span style={{ fontSize:14, color:"#374151", fontWeight:500 }}>{p}</span>
                </div>
              ))}
            </div>
            <Link href="/shop" style={{ display:"inline-flex", alignItems:"center", gap:10, padding:"14px 28px", background:"#0f172a", color:"#fff", borderRadius:12, textDecoration:"none", fontSize:13, fontWeight:800, letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.25s" }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="#f59e0b";el.style.color="#0f172a";}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="#0f172a";el.style.color="#fff";}}>
              Shop the Collection <ArrowRight size={16} />
            </Link>
          </div>
          <div style={{ position:"relative" }}>
            <div style={{ aspectRatio:"4/5", borderRadius:20, overflow:"hidden" }}>
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=90"
                alt="BLANKO Collection" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            {/* Floating card */}
            <div style={{ position:"absolute", bottom:-20, left:-24, background:"#ffffff", borderRadius:16, padding:"20px 24px", boxShadow:"0 20px 60px rgba(0,0,0,0.12)", border:"1px solid #f1f5f9" }}>
              <div style={{ display:"flex", gap:4, marginBottom:8 }}>
                {[1,2,3,4,5].map(s=><Star key={s} size={13} style={{ color:"#f59e0b", fill:"#f59e0b" }}/>)}
              </div>
              <p style={{ fontSize:13, color:"#374151", margin:"0 0 8px", fontStyle:"italic", maxWidth:200 }}>"The best fashion experience I've had in Egypt."</p>
              <p style={{ fontSize:11, fontWeight:700, color:"#94a3b8", margin:0, letterSpacing:"0.1em" }}>— VERIFIED CUSTOMER</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────── */}
      <section style={{ background:"#0f172a", padding:"88px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <p style={{ fontSize:11, fontWeight:800, letterSpacing:"0.3em", textTransform:"uppercase", color:"#f59e0b", marginBottom:14 }}>What Drives Us</p>
            <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"#fff", margin:0 }}>Mission, Vision & Values</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {values.map(v=>(
              <div key={v.title} style={{ background:"rgba(255,255,255,0.04)", border:`1.5px solid ${v.color}22`, borderRadius:18, padding:"32px 28px", transition:"all 0.3s" }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=v.color+"55";el.style.background="rgba(255,255,255,0.07)";el.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=v.color+"22";el.style.background="rgba(255,255,255,0.04)";el.style.transform="";}}>
                <div style={{ width:52, height:52, borderRadius:14, background:`${v.color}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
                  <v.Icon size={24} style={{ color:v.color }} strokeWidth={1.8}/>
                </div>
                <h3 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"1.4rem", fontWeight:800, color:"#fff", margin:"0 0 12px" }}>{v.title}</h3>
                <p style={{ fontSize:14, color:"rgba(255,255,255,0.50)", lineHeight:1.8, margin:0 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why BLANKO ───────────────────────────────── */}
      <section style={{ background:"#f8fafc", padding:"88px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <p style={{ fontSize:11, fontWeight:800, letterSpacing:"0.3em", textTransform:"uppercase", color:"#d97706", marginBottom:14 }}>Why Choose Us</p>
            <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"#0f172a", margin:"0 0 12px" }}>The BLANKO Difference</h2>
            <p style={{ fontSize:15, color:"#64748b", margin:0, maxWidth:500, marginInline:"auto" }}>Six reasons thousands choose BLANKO, again and again</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {pillars.map((p,i)=>(
              <div key={p.title} style={{ background:"#fff", border:"1.5px solid #f1f5f9", borderRadius:16, padding:"28px 24px", transition:"all 0.3s" }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="#f59e0b44";el.style.transform="translateY(-4px)";el.style.boxShadow="0 16px 40px rgba(0,0,0,0.07)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="#f1f5f9";el.style.transform="";el.style.boxShadow="";}}>
                <div style={{ width:46, height:46, borderRadius:12, background:"rgba(245,158,11,0.10)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:16 }}>
                  <p.Icon size={20} style={{ color:"#f59e0b" }} strokeWidth={1.8}/>
                </div>
                <h3 style={{ fontSize:"1rem", fontWeight:800, color:"#0f172a", margin:"0 0 8px" }}>{p.title}</h3>
                <p style={{ fontSize:13, color:"#64748b", lineHeight:1.75, margin:0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────── */}
      <section style={{ background:"#ffffff", padding:"88px 24px" }}>
        <div style={{ maxWidth:780, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <p style={{ fontSize:11, fontWeight:800, letterSpacing:"0.3em", textTransform:"uppercase", color:"#d97706", marginBottom:14 }}>Our Journey</p>
            <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"#0f172a", margin:0 }}>Milestones</h2>
          </div>
          <div style={{ position:"relative", paddingLeft:40 }}>
            <div style={{ position:"absolute", left:12, top:6, bottom:6, width:2, background:"linear-gradient(to bottom, #f59e0b, rgba(245,158,11,0.1))" }} />
            {milestones.map((m,i)=>(
              <div key={m.year} style={{ position:"relative", marginBottom: i<milestones.length-1?40:0 }}>
                <div style={{ position:"absolute", left:-32, top:4, width:14, height:14, borderRadius:"50%", background: i===milestones.length-1?"#f59e0b":"#fff", border:`3px solid #f59e0b`, boxShadow: i===milestones.length-1?"0 0 0 4px rgba(245,158,11,0.2)":"none" }} />
                <div style={{ background:"#f8fafc", border:"1.5px solid #f1f5f9", borderRadius:14, padding:"22px 24px", transition:"all 0.25s" }}
                  onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="#f59e0b44";el.style.background="#fffbeb";}}
                  onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="#f1f5f9";el.style.background="#f8fafc";}}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:900, letterSpacing:"0.18em", color:"#f59e0b", background:"rgba(245,158,11,0.12)", padding:"3px 10px", borderRadius:20 }}>{m.year}</span>
                    <h3 style={{ fontSize:"1rem", fontWeight:800, color:"#0f172a", margin:0 }}>{m.title}</h3>
                  </div>
                  <p style={{ fontSize:13, color:"#64748b", margin:0, lineHeight:1.7 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────── */}
      <section style={{ background:"#0f172a", padding:"88px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:56 }}>
            <p style={{ fontSize:11, fontWeight:800, letterSpacing:"0.3em", textTransform:"uppercase", color:"#f59e0b", marginBottom:14 }}>The People Behind BLANKO</p>
            <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(2rem,4vw,3rem)", fontWeight:800, color:"#fff", margin:0 }}>Meet the Team</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24 }}>
            {team.map(t=>(
              <div key={t.name} style={{ background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.07)", borderRadius:18, padding:"32px 24px", textAlign:"center", transition:"all 0.3s" }}
                onMouseEnter={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor=t.color+"44";el.style.transform="translateY(-4px)";}}
                onMouseLeave={e=>{const el=e.currentTarget as HTMLElement;el.style.borderColor="rgba(255,255,255,0.07)";el.style.transform="";}}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:`linear-gradient(135deg, ${t.color}, ${t.color}88)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:800, color:"#0f172a", margin:"0 auto 18px", boxShadow:`0 8px 24px ${t.color}44` }}>
                  {t.init}
                </div>
                <h3 style={{ fontSize:"1.1rem", fontWeight:800, color:"#fff", margin:"0 0 5px" }}>{t.name}</h3>
                <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:t.color, margin:"0 0 14px" }}>{t.role}</p>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.45)", lineHeight:1.75, margin:0 }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{ background:"linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", padding:"80px 24px", textAlign:"center", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle, rgba(245,158,11,0.08), transparent 65%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", maxWidth:600, margin:"0 auto" }}>
          <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(2rem,4vw,3.2rem)", fontWeight:800, color:"#fff", margin:"0 0 16px", lineHeight:1.05 }}>
            Ready to Define Your Style?
          </h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.48)", margin:"0 0 36px", lineHeight:1.8 }}>
            Join over 50,000 fashion-forward individuals who trust BLANKO for their wardrobe essentials.
          </p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/shop" style={{ display:"inline-flex", alignItems:"center", gap:9, padding:"15px 30px", background:"#f59e0b", color:"#0f172a", borderRadius:12, textDecoration:"none", fontSize:13, fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase", transition:"all 0.25s", boxShadow:"0 8px 24px rgba(245,158,11,0.35)" }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="#fcd34d";el.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.background="#f59e0b";el.style.transform="";}}>
              Shop Now <ArrowRight size={16}/>
            </Link>
            <Link href="/contact-us" style={{ display:"inline-flex", alignItems:"center", gap:9, padding:"15px 30px", background:"transparent", color:"rgba(255,255,255,0.75)", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:12, textDecoration:"none", fontSize:13, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", transition:"all 0.25s" }}
              onMouseEnter={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.borderColor="rgba(255,255,255,0.5)";el.style.color="#fff";}}
              onMouseLeave={e=>{const el=e.currentTarget as HTMLAnchorElement;el.style.borderColor="rgba(255,255,255,0.2)";el.style.color="rgba(255,255,255,0.75)";}}>
              <MessageCircle size={16}/> Contact Us
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @media(max-width:900px){
          div[style*="grid-template-columns: 1fr 1fr"] { display:flex !important; flex-direction:column !important; gap:36px !important; }
          div[style*="grid-template-columns: repeat(3,1fr)"] { grid-template-columns:1fr !important; }
        }
        @media(max-width:600px){
          div[style*="grid-template-columns: repeat(4,1fr)"] { grid-template-columns:repeat(2,1fr) !important; }
        }
      `}</style>
    </div>
  );
}
