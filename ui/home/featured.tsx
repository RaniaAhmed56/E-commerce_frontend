"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, ArrowLeft, Heart, ShoppingCart, Eye, Zap } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/src/context/WishlistContext";
import { useCart } from "@/src/context/CartContext";
import { normalizeImageUrl } from "@/src/utils/image";

function ProductSlide({ product }: { product: any }) {
  const router  = useRouter();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const inWish  = isInWishlist(product.id);
  const price   = typeof product.price === "string" ? parseFloat(product.price) : (product.price ?? 0);
  const imgSrc  = normalizeImageUrl(product.image);

  const tap = (e: React.MouseEvent, fn: () => void) => { e.stopPropagation(); fn(); };

  return (
    <div className="fs-card" onClick={() => router.push(`/product/${product.id}`)}>
      {/* Image */}
      <div className="fs-img-wrap">
        {imgSrc
          ? <img src={imgSrc} alt={product.name} className="fs-img" />
          : <div className="fs-img-placeholder"><ShoppingCart size={32} style={{ color:"#cbd5e1" }} /></div>
        }
        {/* Badges */}
        <div className="fs-badges">
          {product.featured && product.inStock && <span className="fs-badge fs-badge--feat">Featured</span>}
          {product.trending && product.inStock && <span className="fs-badge fs-badge--trend">Trending</span>}
          {!product.inStock && <span className="fs-badge fs-badge--out">Sold Out</span>}
        </div>
        {/* Hover actions */}
        <div className="fs-actions">
          <button onClick={e=>tap(e,()=>inWish?removeFromWishlist(product.id):addToWishlist({id:product.id,name:product.name,price,image:product.image}))}
            className={`fs-action-btn${inWish?" active":""}`} title="Wishlist">
            <Heart size={16} strokeWidth={2} fill={inWish?"currentColor":"none"} />
          </button>
          <button onClick={e=>tap(e,()=>router.push(`/product/${product.id}`))}
            className="fs-action-btn" title="Quick View">
            <Eye size={16} strokeWidth={2} />
          </button>
          {product.inStock && (
            <button onClick={e=>tap(e,()=>addToCart(product.id,product.name,price,product.image,"",""))}
              className="fs-action-btn" title="Add to Cart">
              <ShoppingCart size={16} strokeWidth={2} />
            </button>
          )}
        </div>
        {/* Quick add */}
        {product.inStock && (
          <button className="fs-quick-add"
            onClick={e=>tap(e,()=>addToCart(product.id,product.name,price,product.image,"",""))}>
            <Zap size={13} fill="currentColor" /> Quick Add
          </button>
        )}
      </div>
      {/* Info */}
      <div className="fs-info">
        <p className="fs-cat">{product.category_name || "Fashion"}</p>
        <h3 className="fs-name">{product.name}</h3>
        <p className="fs-price">EGP {price.toLocaleString("en-US")}</p>
      </div>
    </div>
  );
}

const VISIBLE = 4;

export default function Featured({ featured }: { featured: any[] }) {
  const [offset, setOffset] = useState(0);
  const [animDir, setAnimDir] = useState<"left"|"right"|null>(null);
  const [isAnim, setIsAnim] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval>|null>(null);

  const total = featured.length;
  const canNext = total > VISIBLE;

  const slide = useCallback((dir: "left"|"right") => {
    if (isAnim || total <= VISIBLE) return;
    setIsAnim(true);
    setAnimDir(dir);
    setTimeout(() => {
      setOffset(o => {
        if (dir === "left") return (o + 1) % total;
        return (o - 1 + total) % total;
      });
      setAnimDir(null);
      setIsAnim(false);
    }, 420);
  }, [isAnim, total]);

  useEffect(() => {
    if (!canNext) return;
    autoRef.current = setInterval(() => slide("left"), 4000);
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [slide, canNext]);

  const resetAuto = () => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => slide("left"), 4000);
  };

  const visible = [];
  for (let i = 0; i < Math.min(VISIBLE, total); i++) {
    visible.push(featured[(offset + i) % total]);
  }

  if (!featured.length) return null;

  return (
    <>
      <section style={{ background:"#ffffff", padding:"88px 0", overflow:"hidden" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", padding:"0 24px" }}>

          {/* Header */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48, flexWrap:"wrap", gap:16 }}>
            <div>
              <p className="section-tag" style={{ marginBottom:10, color:"#d97706" }}>Curated For You</p>
              <h2 style={{ color:"#0f172a", margin:"0 0 8px", fontFamily:"var(--font-cormorant,Georgia,serif)", fontWeight:800, fontSize:"clamp(1.8rem,4vw,2.8rem)" }}>
                Featured Collection
              </h2>
              <p style={{ fontSize:14, color:"#64748b", margin:0 }}>Our finest picks, selected with care</p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
              {canNext && (
                <div style={{ display:"flex", gap:8 }}>
                  <button onClick={()=>{ slide("right"); resetAuto(); }} className="feat-arrow" aria-label="Previous">
                    <ArrowRight size={17} />
                  </button>
                  <button onClick={()=>{ slide("left"); resetAuto(); }} className="feat-arrow feat-arrow--active" aria-label="Next">
                    <ArrowLeft size={17} />
                  </button>
                </div>
              )}
              <Link href="/shop"
                style={{ display:"flex", alignItems:"center", gap:7, fontSize:11, fontWeight:800, letterSpacing:"0.18em", textTransform:"uppercase", color:"#0f172a", textDecoration:"none", borderBottom:"2.5px solid #f59e0b", paddingBottom:4 }}
                onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color="#d97706";}}
                onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color="#0f172a";}}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Carousel */}
          <div className={`feat-track feat-track--${animDir ?? "idle"}`}>
            {visible.map((p, i) => p && (
              <div key={`${p.id}-${offset}-${i}`} className="feat-item">
                <ProductSlide product={p} />
              </div>
            ))}
          </div>

          {/* Dots */}
          {canNext && (
            <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:36 }}>
              {featured.map((_, i) => (
                <button key={i} onClick={()=>{ setOffset(i); resetAuto(); }}
                  style={{ width: i===offset?24:8, height:8, borderRadius:4, border:"none", cursor:"pointer", transition:"all 0.35s", background: i===offset?"#f59e0b":"#e2e8f0", padding:0 }} />
              ))}
            </div>
          )}
        </div>
      </section>

      <style>{`
        /* Arrows */
        .feat-arrow { width:42px; height:42px; border-radius:50%; border:2px solid #e2e8f0; background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#64748b; transition:all 0.22s; }
        .feat-arrow:hover, .feat-arrow--active:hover { background:#0f172a; border-color:#0f172a; color:#fff; transform:scale(1.08); }
        .feat-arrow--active { background:#0f172a; border-color:#0f172a; color:#fff; }

        /* Track */
        .feat-track { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        .feat-item { transition:transform 0.42s cubic-bezier(0.22,1,0.36,1), opacity 0.42s; }

        /* Slide animations */
        .feat-track--left  .feat-item { animation: featSlideLeft  0.42s cubic-bezier(0.22,1,0.36,1) both; }
        .feat-track--right .feat-item { animation: featSlideRight 0.42s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes featSlideLeft  { from{transform:translateX(30px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes featSlideRight { from{transform:translateX(-30px);opacity:0} to{transform:translateX(0);opacity:1} }

        /* Product slide card */
        .fs-card { border-radius:14px; overflow:hidden; cursor:pointer; transition:transform 0.3s, box-shadow 0.3s; }
        .fs-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(0,0,0,0.10); }

        .fs-img-wrap { position:relative; aspect-ratio:3/4; overflow:hidden; background:#f8f6f2; border-radius:14px; }
        .fs-img { width:100%; height:100%; object-fit:cover; transition:transform 0.7s cubic-bezier(0.22,1,0.36,1); display:block; }
        .fs-card:hover .fs-img { transform:scale(1.07); }
        .fs-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }

        .fs-badges { position:absolute; top:10px; left:10px; display:flex; flex-direction:column; gap:5px; z-index:2; }
        .fs-badge { display:inline-block; padding:4px 10px; border-radius:50px; font-size:9px; font-weight:900; letter-spacing:0.14em; text-transform:uppercase; backdrop-filter:blur(6px); }
        .fs-badge--feat  { background:rgba(15,23,42,0.88); color:#fcd34d; }
        .fs-badge--trend { background:rgba(245,158,11,0.92); color:#0f172a; }
        .fs-badge--out   { background:rgba(100,116,139,0.88); color:#fff; }

        .fs-actions { position:absolute; top:10px; right:10px; z-index:10; display:flex; flex-direction:column; gap:7px; opacity:0; transform:translateX(10px); transition:all 0.3s; }
        .fs-card:hover .fs-actions { opacity:1; transform:translateX(0); }
        .fs-action-btn { width:38px; height:38px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.96); border:1.5px solid #e2e8f0; border-radius:50%; cursor:pointer; color:#0f172a; transition:all 0.22s; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
        .fs-action-btn:hover, .fs-action-btn.active { background:#f59e0b; border-color:#f59e0b; color:#0f172a; transform:scale(1.08); }

        .fs-quick-add { position:absolute; bottom:0; left:0; right:0; display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; background:#0f172a; color:#fcd34d; font-size:11px; font-weight:900; letter-spacing:0.18em; text-transform:uppercase; border:none; cursor:pointer; transform:translateY(100%); transition:transform 0.35s cubic-bezier(0.22,1,0.36,1); }
        .fs-card:hover .fs-quick-add { transform:translateY(0); }
        .fs-quick-add:hover { background:#f59e0b; color:#0f172a; }

        .fs-info   { padding:14px 4px 10px; }
        .fs-cat    { font-size:10px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#d97706; margin:0 0 5px; }
        .fs-name   { font-size:15px; font-weight:700; color:#0f172a; margin:0 0 8px; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .fs-price  { font-size:1rem; font-weight:800; color:#0f172a; margin:0; font-family:var(--font-cormorant,Georgia,serif); }

        @media(max-width:1024px){ .feat-track{grid-template-columns:repeat(3,1fr)} }
        @media(max-width:700px)  { .feat-track{grid-template-columns:repeat(2,1fr);gap:14px} }
      `}</style>
    </>
  );
}
