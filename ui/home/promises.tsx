import { Truck, RotateCcw, Shield, Zap, Star, Headphones } from "lucide-react";

const items = [
  { Icon:Star,        title:"Premium Quality",   desc:"Finest fabrics, exceptional craftsmanship on every piece", accent:"#f59e0b" },
  { Icon:RotateCcw,   title:"Free Returns",       desc:"30-day free returns, no questions asked",                 accent:"#10b981" },
  { Icon:Shield,      title:"Secure Payment",     desc:"Your data is protected with the highest security standards", accent:"#3b82f6" },
  { Icon:Zap,         title:"Fast Delivery",      desc:"Delivered in 24–48 hours across all regions",             accent:"#8b5cf6" },
  { Icon:Truck,       title:"Free Shipping",      desc:"Free shipping on orders above EGP 1,000",                 accent:"#f59e0b" },
  { Icon:Headphones,  title:"24/7 Support",        desc:"Our team is always available to help you",               accent:"#ec4899" },
];

export default function Promises() {
  return (
    <section style={{ padding:"64px 0", background:"#1e293b", borderTop:"1px solid rgba(245,158,11,0.10)" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20 }}>
          {items.map(item => (
            <div key={item.title}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", padding:"28px 20px", background:"rgba(255,255,255,0.03)", border:"1.5px solid rgba(255,255,255,0.06)", borderRadius:16, transition:"all 0.3s", cursor:"default" }}
              onMouseEnter={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor=`${item.accent}44`; el.style.transform="translateY(-4px)"; el.style.background="rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { const el=e.currentTarget as HTMLElement; el.style.borderColor="rgba(255,255,255,0.06)"; el.style.transform=""; el.style.background="rgba(255,255,255,0.03)"; }}>
              <div style={{ width:52, height:52, borderRadius:14, background:`${item.accent}18`, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14 }}>
                <item.Icon size={22} style={{ color:item.accent }} strokeWidth={1.8} />
              </div>
              <p style={{ fontSize:13, fontWeight:800, color:"#ffffff", margin:"0 0 6px", letterSpacing:"0.04em" }}>{item.title}</p>
              <p style={{ fontSize:12, color:"rgba(255,255,255,0.38)", margin:0, lineHeight:1.55 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
