import { ArrowRight } from "lucide-react";
import Link from "next/link";

const cats = [
  { name:"Women",      slug:"Women",      img:"https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=700&q=85", desc:"Timeless elegance for every occasion",  count:120 },
  { name:"Men",        slug:"Men",        img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=700&q=85", desc:"Modern cuts, bold statements",          count:85  },
  { name:"Kids",       slug:"Kids",       img:"https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=700&q=85", desc:"Playful colors, lasting comfort",       count:60  },
  { name:"Accessories",slug:"Accessories",img:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=700&q=85", desc:"The finishing touch to every look",     count:95  },
];

export default function Categories() {
  return (
    <section style={{ background:"#0f172a", padding:"88px 0" }}>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <p className="section-tag" style={{ justifyContent:"center", marginBottom:14 }}>Explore</p>
          <h2 style={{ color:"#ffffff", margin:"0 0 14px", fontFamily:"var(--font-cormorant,Georgia,serif)", fontWeight:800 }}>Shop by Category</h2>
          <p style={{ fontSize:15, color:"rgba(255,255,255,0.4)", margin:0 }}>Find your style, your way</p>
        </div>
        <div className="cats-grid">
          {cats.map(cat => (
            <Link key={cat.name} href={`/shop?category=${cat.slug}`}
              style={{ position:"relative", display:"block", aspectRatio:"3/4", overflow:"hidden", textDecoration:"none", borderRadius:16 }}
              className="cat-link">
              <img src={cat.img} alt={cat.name}
                style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.75s ease" }}
                className="cat-img" />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(10,14,28,0.95) 0%, rgba(10,14,28,0.15) 55%, transparent 100%)" }} />
              {/* Hover overlay */}
              <div className="cat-overlay" style={{ position:"absolute", inset:0, background:"rgba(245,158,11,0.12)", opacity:0, transition:"opacity 0.35s" }} />
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"24px 22px" }}>
                <p style={{ fontSize:9, fontWeight:800, letterSpacing:"0.32em", textTransform:"uppercase", color:"#fcd34d", margin:"0 0 7px" }}>
                  {cat.count} pieces
                </p>
                <h3 style={{ fontSize:"1.6rem", fontWeight:800, color:"#ffffff", margin:"0 0 5px", fontFamily:"var(--font-cormorant,Georgia,serif)" }}>
                  {cat.name}
                </h3>
                <p style={{ fontSize:13, color:"rgba(255,255,255,0.50)", margin:"0 0 14px" }}>{cat.desc}</p>
                <div style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, fontWeight:700, color:"#f59e0b", letterSpacing:"0.14em", textTransform:"uppercase" }}>
                  Shop Now <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .cats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
        .cat-link:hover .cat-img { transform:scale(1.07); }
        .cat-link:hover .cat-overlay { opacity:1 !important; }
        @media(max-width:1024px){ .cats-grid{grid-template-columns:repeat(2,1fr);gap:16px} }
        @media(max-width:560px){ .cats-grid{grid-template-columns:repeat(2,1fr);gap:12px} }
      `}</style>
    </section>
  );
}
