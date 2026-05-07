"use client";
import { useState } from "react";
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin, Send, Clock, ArrowRight } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  const contacts = [
    { Icon:MessageCircle, label:"WhatsApp", value:"Chat with us", href:"https://wa.me/201234567890", color:"#25D366", bg:"rgba(37,211,102,0.10)" },
    { Icon:Phone,         label:"Phone",    value:"+20 123 456 7890", href:"tel:+201234567890",       color:"#3b82f6", bg:"rgba(59,130,246,0.10)" },
    { Icon:Mail,          label:"Email",    value:"hello@blanko.eg",  href:"mailto:hello@blanko.eg",  color:"#f59e0b", bg:"rgba(245,158,11,0.10)" },
    { Icon:MapPin,        label:"Location", value:"Cairo, Egypt",     href:"#",                        color:"#ec4899", bg:"rgba(236,72,153,0.10)" },
  ];

  const socials = [
    { Icon:Instagram, label:"Instagram", href:"https://instagram.com/blanko", color:"#e1306c" },
    { Icon:Facebook,  label:"Facebook",  href:"https://facebook.com/blanko",  color:"#1877f2" },
  ];

  return (
    <div style={{ background:"#0f172a", minHeight:"calc(100vh - 112px)" }}>

      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#1e293b 0%,#0f172a 100%)", borderBottom:"1px solid rgba(255,255,255,0.07)", padding:"80px 24px 56px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <p className="section-tag" style={{ justifyContent:"center", marginBottom:16 }}>Get in Touch</p>
          <h1 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"clamp(2.4rem,5vw,4rem)", fontWeight:800, color:"#fff", margin:"0 0 16px", lineHeight:1.05 }}>
            We'd Love to<br /><span style={{ fontStyle:"italic", color:"#f59e0b" }}>Hear From You.</span>
          </h1>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.45)", margin:0, maxWidth:500, marginInline:"auto" }}>
            Our team is available 7 days a week. Reach out and we'll respond within a few minutes.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"56px 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:32, alignItems:"flex-start" }}>

          {/* Left — Contact methods */}
          <div>
            <h2 style={{ fontSize:"1.2rem", fontWeight:800, color:"#fff", margin:"0 0 24px" }}>Contact Methods</h2>
            <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:36 }}>
              {contacts.map(c => (
                <a key={c.label} href={c.href} target={c.href.startsWith("http")?"_blank":undefined}
                  style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.07)", borderRadius:14, textDecoration:"none", transition:"all 0.25s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor=c.color+"55"; (e.currentTarget as HTMLAnchorElement).style.background=c.bg; (e.currentTarget as HTMLAnchorElement).style.transform="translateX(-4px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.04)"; (e.currentTarget as HTMLAnchorElement).style.transform=""; }}>
                  <div style={{ width:44, height:44, borderRadius:12, background:c.bg, border:`1px solid ${c.color}33`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <c.Icon size={19} style={{ color:c.color }} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.38)", margin:"0 0 3px" }}>{c.label}</p>
                    <p style={{ fontSize:14, fontWeight:700, color:"#fff", margin:0 }}>{c.value}</p>
                  </div>
                  <ArrowRight size={14} style={{ color:"rgba(255,255,255,0.22)", marginLeft:"auto" }} />
                </a>
              ))}
            </div>

            {/* Hours */}
            <div style={{ background:"rgba(245,158,11,0.06)", border:"1.5px solid rgba(245,158,11,0.18)", borderRadius:14, padding:"20px 22px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                <Clock size={16} style={{ color:"#f59e0b" }} />
                <p style={{ fontSize:13, fontWeight:800, color:"#fcd34d", margin:0, letterSpacing:"0.1em", textTransform:"uppercase" }}>Working Hours</p>
              </div>
              {[{ d:"Monday – Friday", h:"9:00 AM – 11:00 PM" }, { d:"Saturday – Sunday", h:"10:00 AM – Midnight" }].map(row => (
                <div key={row.d} style={{ display:"flex", justifyContent:"space-between", padding:"8px 0", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize:13, color:"rgba(255,255,255,0.5)" }}>{row.d}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{row.h}</span>
                </div>
              ))}
            </div>

            {/* Social */}
            <div style={{ marginTop:28 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"rgba(255,255,255,0.38)", marginBottom:14 }}>Follow Us</p>
              <div style={{ display:"flex", gap:12 }}>
                {socials.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener"
                    style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", background:"rgba(255,255,255,0.05)", border:"1.5px solid rgba(255,255,255,0.09)", borderRadius:10, textDecoration:"none", fontSize:13, fontWeight:700, color:"rgba(255,255,255,0.6)", transition:"all 0.2s" }}
                    onMouseEnter={e => { const el=e.currentTarget as HTMLAnchorElement; el.style.color=s.color; el.style.borderColor=s.color+"55"; }}
                    onMouseLeave={e => { const el=e.currentTarget as HTMLAnchorElement; el.style.color="rgba(255,255,255,0.6)"; el.style.borderColor="rgba(255,255,255,0.09)"; }}>
                    <s.Icon size={16} /> {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div style={{ background:"#1e293b", border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:20, overflow:"hidden" }}>
            <div style={{ height:3, background:"linear-gradient(90deg,#f59e0b,#fcd34d,transparent)" }} />
            <div style={{ padding:"32px 30px" }}>
              {sent ? (
                <div style={{ textAlign:"center", padding:"40px 0" }}>
                  <div style={{ width:64, height:64, borderRadius:"50%", background:"rgba(16,185,129,0.15)", border:"2px solid rgba(16,185,129,0.3)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
                    <Send size={26} style={{ color:"#34d399" }} />
                  </div>
                  <h3 style={{ fontSize:"1.4rem", fontWeight:800, color:"#fff", margin:"0 0 10px" }}>Message Sent!</h3>
                  <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:0 }}>We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize:"1.3rem", fontWeight:800, color:"#fff", margin:"0 0 26px" }}>Send a Message</h2>
                  <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                      {[{k:"name",l:"Full Name",ph:"John Doe",type:"text"},{k:"email",l:"Email",ph:"your@email.com",type:"email"}].map(f=>(
                        <div key={f.k}>
                          <label style={{ display:"block",fontSize:11,fontWeight:800,letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:9 }}>{f.l}</label>
                          <input type={f.type} required value={form[f.k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))} placeholder={f.ph} className="input-field" style={{fontSize:13}} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:11,fontWeight:800,letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:9 }}>Subject</label>
                      <input type="text" value={form.subject} onChange={e=>setForm(p=>({...p,subject:e.target.value}))} placeholder="How can we help?" className="input-field" style={{fontSize:13}} />
                    </div>
                    <div>
                      <label style={{ display:"block",fontSize:11,fontWeight:800,letterSpacing:"0.22em",textTransform:"uppercase",color:"rgba(255,255,255,0.45)",marginBottom:9 }}>Message</label>
                      <textarea rows={5} required value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} placeholder="Tell us more..." className="input-field" style={{resize:"none",fontSize:13}} />
                    </div>
                    <button type="submit" className="btn-gold" style={{ justifyContent:"center", fontSize:13 }}>
                      Send Message <Send size={15} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:860px){ div[style*="grid-template-columns: 1fr 1.4fr"] { display:flex !important; flex-direction:column !important; } }
        @media(max-width:560px){ div[style*="grid-template-columns: 1fr 1fr"] { display:flex !important; flex-direction:column !important; } }
      `}</style>
    </div>
  );
}
