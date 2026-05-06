import { Truck, RotateCcw, Shield, Zap, Star, Headphones } from "lucide-react";

const items = [
  { Icon: Star,       title: "جودة استثنائية",  desc: "أفضل الخامات وحرفية لا مثيل لها", accent: "#f59e0b" },
  { Icon: RotateCcw,  title: "إرجاع مجاني",     desc: "إرجاع مجاني خلال 30 يومًا بلا أسئلة", accent: "#10b981" },
  { Icon: Shield,     title: "دفع آمن 100%",    desc: "بياناتك محمية بأعلى معايير الأمان", accent: "#3b82f6" },
  { Icon: Zap,        title: "توصيل سريع",       desc: "توصيل خلال 24-48 ساعة لجميع المحافظات", accent: "#8b5cf6" },
  { Icon: Truck,      title: "شحن مجاني",        desc: "على الطلبات أكثر من 1000 ج.م", accent: "#f59e0b" },
  { Icon: Headphones, title: "دعم 24/7",          desc: "فريق خدمة عملاء متاح دائماً", accent: "#ec4899" },
];

export default function Promises() {
  return (
    <>
      <section style={{ padding: "60px 0", background: "#1e293b", borderTop: "1px solid rgba(245,158,11,0.12)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {items.map(item => (
              <div key={item.title}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "28px 20px", background: "rgba(255,255,255,0.03)", border: "1.5px solid rgba(255,255,255,0.06)", borderRadius: 16, transition: "all 0.3s", cursor: "default" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = `${item.accent}44`; el.style.transform = "translateY(-4px)"; el.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.06)"; el.style.transform = ""; el.style.background = "rgba(255,255,255,0.03)"; }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.accent}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                  <item.Icon size={22} style={{ color: item.accent }} strokeWidth={1.8} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#ffffff", margin: "0 0 6px", letterSpacing: "0.04em" }}>{item.title}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.38)", margin: 0, lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
