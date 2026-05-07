"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Heart, ShoppingCart, Eye, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/src/context/WishlistContext";
import { useCart } from "@/src/context/CartContext";
import { normalizeImageUrl } from "@/src/utils/image";

function TrendCard({ product }: { product: any }) {
  const router  = useRouter();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWish  = isInWishlist(product.id);
  const price   = typeof product.price === "string" ? parseFloat(product.price) : (product.price ?? 0);
  const imgSrc  = normalizeImageUrl(product.image);
  const tap = (e: React.MouseEvent, fn: () => void) => { e.stopPropagation(); fn(); };

  return (
    <div className="tc-card" onClick={() => router.push(`/product/${product.id}`)}>
      <div className="tc-img-wrap">
        {imgSrc
          ? <img src={imgSrc} alt={product.name} className="tc-img" />
          : <div className="tc-placeholder"><ShoppingCart size={28} style={{ color:"#475569" }} /></div>
        }
        {/* Trending badge */}
        <div style={{ position:"absolute", top:10, left:10, z:2 }}>
          <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 10px", background:"rgba(245,158,11,0.92)", borderRadius:50, fontSize:9, fontWeight:900, letterSpacing:"0.14em", textTransform:"uppercase", color:"#0f172a", backdropFilter:"blur(6px)" }}>
            <TrendingUp size={10} strokeWidth={3} /> Trending
          </span>
        </div>
        {/* Actions */}
        <div className="tc-actions">
          <button onClick={e=>tap(e,()=>inWish?removeFromWishlist(product.id):addToWishlist({id:product.id,name:product.name,price,image:product.image}))}
            className={`tc-action-btn${inWish?" active":""}`}>
            <Heart size={15} strokeWidth={2} fill={inWish?"currentColor":"none"} />
          </button>
          <button onClick={e=>tap(e,()=>router.push(`/product/${product.id}`))} className="tc-action-btn">
            <Eye size={15} strokeWidth={2} />
          </button>
        </div>
        {product.inStock && (
          <button className="tc-quick" onClick={e=>tap(e,()=>addToCart(product.id,product.name,price,product.image,"",""))}>
            <Zap size={13} fill="currentColor" /> Quick Add
          </button>
        )}
      </div>
      <div className="tc-info">
        <p className="tc-cat">{product.category_name || "Fashion"}</p>
        <h3 className="tc-name">{product.name}</h3>
        <p className="tc-price">EGP {price.toLocaleString("en-US")}</p>
      </div>
    </div>
  );
}

const VIS = 4;

export default function Trending({ trending }: { trending: any[] }) {
  const [offset, setOffset] = useState(0);
  const [animDir, setAnimDir] = useState<"left"|"right"|null>(null);
  const [isAnim, setIsAnim] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const total = trending.length;

  const slide = useCallback((dir: "left"|"right") => {
    if (isAnim || total <= VIS) return;
    setIsAnim(true); setAnimDir(dir);
    setTimeout(() => {
      setOffset(o => dir==="left" ? (o+1)%total : (o-1+total)%total);
      setAnimDir(null); setIsAnim(false);
    }, 420);
  }, [isAnim, total]);

  useEffect(() => {
    if (total <= VIS) return;
    autoRef.current = setInterval(()=>slide("left"), 4500);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [slide, total]);

  const reset = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(()=>slide("left"), 4500);
  };

  const visible = [];
  for (let i=0; i<Math.min(VIS,total); i++) visible.push(trending[(offset+i)%total]);

  if (!trending.length) return null;

  return (
    <>
      <section style={{ background:"#0f172a", padding:"88px 0", overflow:"hidden" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48, flexWrap:"wrap", gap:16 }}>
            <div>
              <p className="section-tag" style={{ marginBottom:10 }}>What's Hot</p>
              <h2 style={{ color:"#fff", margin:"0 0 8px", fontFamily:"var(--font-cormorant,Georgia,serif)", fontWeight:800, fontSize:"clamp(1.8rem,4vw,2.8rem)" }}>Trending Now</h2>
              <p style={{ fontSize:14, color:"rgba(255,255,255,0.38)", margin:0 }}>The looks everyone is talking about</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              {total > VIS && (
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>{slide("right");reset();}} className="tr-arrow" aria-label="Prev"><ArrowRight size={17}/></button>
                  <button onClick={()=>{slide("left");reset();}} className="tr-arrow tr-arrow--a" aria-label="Next"><ArrowLeft size={17}/></button>
                </div>
              )}
              <Link href="/shop?sort=trending"
                style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.55)", textDecoration:"none", borderBottom:"2px solid rgba(245,158,11,0.5)", paddingBottom:4 }}
                onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color="#f59e0b";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.55)";}}>
                See All <ArrowRight size={14}/>
              </Link>
            </div>
          </div>

          <div className={`tr-track tr-track--${animDir??"idle"}`}>
            {visible.map((p,i) => p && (
              <div key={`${p.id}-${offset}-${i}`} className="tr-item">
                <TrendCard product={p} />
              </div>
            ))}
          </div>

          {total > VIS && (
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:36 }}>
              {trending.map((_,i)=>(
                <button key={i} onClick={()=>{setOffset(i);reset();}}
                  style={{ width:i===offset?24:8, height:8, borderRadius:4, border:"none", cursor:"pointer", transition:"all 0.35s", background:i===offset?"#f59e0b":"rgba(255,255,255,0.15)", padding:0 }} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        .tr-arrow { width:42px; height:42px; border-radius:50%; border:1.5px solid rgba(255,255,255,0.15); background:rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; cursor:pointer; color:rgba(255,255,255,0.55); transition:all 0.22s; }
        .tr-arrow:hover, .tr-arrow--a { background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.4); color:#f59e0b; }
        .tr-arrow--a:hover { background:#f59e0b; border-color:#f59e0b; color:#0f172a; }

        .tr-track { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        .tr-track--left  .tr-item { animation:trLeft  0.42s cubic-bezier(0.22,1,0.36,1) both; }
        .tr-track--right .tr-item { animation:trRight 0.42s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes trLeft  { from{transform:translateX(30px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes trRight { from{transform:translateX(-30px);opacity:0} to{transform:translateX(0);opacity:1} }

        .tc-card { border-radius:14px; overflow:hidden; cursor:pointer; transition:transform 0.3s, box-shadow 0.3s; }
        .tc-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.4); }
        .tc-img-wrap { position:relative; aspect-ratio:3/4; overflow:hidden; background:#1e293b; border-radius:14px; }
        .tc-img { width:100%; height:100%; object-fit:cover; transition:transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .tc-card:hover .tc-img { transform:scale(1.07); }
        .tc-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
        .tc-actions { position:absolute; top:10px; right:10px; display:flex; flex-direction:column; gap:7px; opacity:0; transform:translateX(10px); transition:all 0.3s; }
        .tc-card:hover .tc-actions { opacity:1; transform:translateX(0); }
        .tc-action-btn { width:38px; height:38px; display:flex; align-items:center; justify-content:center; background:rgba(15,23,42,0.82); border:1.5px solid rgba(255,255,255,0.15); border-radius:50%; cursor:pointer; color:#fff; transition:all 0.22s; backdrop-filter:blur(6px); }
        .tc-action-btn:hover, .tc-action-btn.active { background:#f59e0b; border-color:#f59e0b; color:#0f172a; }
        .tc-quick { position:absolute; bottom:0; left:0; right:0; display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; background:rgba(15,23,42,0.92); color:#fcd34d; font-size:11px; font-weight:900; letter-spacing:0.18em; text-transform:uppercase; border:none; cursor:pointer; transform:translateY(100%); transition:transform 0.35s cubic-bezier(0.22,1,0.36,1); backdrop-filter:blur(8px); }
        .tc-card:hover .tc-quick { transform:translateY(0); }
        .tc-quick:hover { background:#f59e0b; color:#0f172a; }
        .tc-info  { padding:14px 4px 10px; }
        .tc-cat   { font-size:10px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#f59e0b; margin:0 0 5px; }
        .tc-name  { font-size:15px; font-weight:700; color:#fff; margin:0 0 8px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .tc-price { font-size:1rem; font-weight:800; color:#fcd34d; margin:0; font-family:var(--font-cormorant,Georgia,serif); }

        @media(max-width:1024px){ .tr-track{grid-template-columns:repeat(3,1fr)} }
        @media(max-width:700px)  { .tr-track{grid-template-columns:repeat(2,1fr);gap:14px} }
      `}</style>
    </>
  );
}
