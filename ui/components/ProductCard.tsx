"use client";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart, Eye, Zap } from "lucide-react";
import { Product } from "@/src/data/products";
import { useWishlist } from "@/src/context/WishlistContext";
import { useCart } from "@/src/context/CartContext";
import { normalizeImageUrl } from "@/src/utils/image";

const colorHex: Record<string,string> = {
  White:"#f8f8f8",Black:"#111111",Gray:"#808080",Beige:"#f5f0e0",
  Red:"#e53e3e",Pink:"#ed64a6",Coral:"#ff7f50",Crimson:"#dc143c",
  Blue:"#3182ce",Navy:"#1a3a5c",Indigo:"#5a67d8",Cyan:"#00bcd4",
  Green:"#38a169",Mint:"#7ed8b0",Olive:"#6b7c3f",
  Yellow:"#ecc94b",Gold:"#d4a017",Orange:"#ed8936",Brown:"#8b5e3c",
  Purple:"#805ad5",Lavender:"#b794f4",Cream:"#fef9e7",Khaki:"#c8b560",
};

function toArr(v: string|string[]|null|undefined): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  try { const p = JSON.parse(v); return Array.isArray(p) ? p : [v]; }
  catch { return v.split(",").map(s=>s.trim()).filter(Boolean); }
}

export function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const router  = useRouter();
  const inWish  = isInWishlist(product.id);
  const price   = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const imgSrc  = normalizeImageUrl(product.image);
  const colors  = toArr(product.colors);
  const sizes   = toArr(product.sizes);

  const go  = () => router.push(`/product/${product.id}`);
  const tap = (e: React.MouseEvent, fn: ()=>void) => { e.preventDefault(); e.stopPropagation(); fn(); };

  return (
    <>
      <div className="pc-card" onClick={go}>

        {/* ── Image ──────────────────────────────── */}
        <div className="pc-img-wrap">
          {imgSrc
            ? <img src={imgSrc} alt={product.name} className="pc-img" />
            : <div className="pc-img-placeholder"><ShoppingCart size={28} style={{ color:"#cbd5e1" }} /></div>
          }

          {/* Badges */}
          <div className="pc-badges">
            {!product.inStock && <span className="pc-badge pc-badge--out">Out of Stock</span>}
            {product.featured && product.inStock && <span className="pc-badge pc-badge--feat">Featured</span>}
            {product.trending && product.inStock && <span className="pc-badge pc-badge--new">Trending</span>}
          </div>

          {/* Actions — slide in from right on hover */}
          <div className="pc-actions">
            <button onClick={e=>tap(e,()=>inWish?removeFromWishlist(product.id):addToWishlist({id:product.id,name:product.name,price,image:product.image}))}
              className={`pc-action-btn${inWish?" active":""}`} title="Wishlist">
              <Heart size={15} strokeWidth={2} fill={inWish?"currentColor":"none"} />
            </button>
            {product.inStock && (
              <button onClick={e=>tap(e,()=>addToCart(product.id,product.name,price,product.image,sizes[0]||"",colors[0]||""))}
                className="pc-action-btn" title="Add to Cart">
                <ShoppingCart size={15} strokeWidth={2} />
              </button>
            )}
            <button onClick={e=>tap(e,go)} className="pc-action-btn" title="Quick View">
              <Eye size={15} strokeWidth={2} />
            </button>
          </div>

          {/* Quick add — slides up from bottom */}
          {product.inStock && (
            <button onClick={e=>tap(e,()=>addToCart(product.id,product.name,price,product.image,sizes[0]||"",colors[0]||""))}
              className="pc-quick-add">
              <Zap size={14} fill="currentColor" /> Quick Add
            </button>
          )}
        </div>

        {/* ── Info ───────────────────────────────── */}
        <div className="pc-info">
          <p className="pc-cat">{product.category_name || "Fashion"}</p>
          <h3 className="pc-name">{product.name}</h3>
          <div className="pc-row">
            <p className="pc-price">EGP {price.toLocaleString("en-US")}</p>
            {product.rating > 0 && (
              <div className="pc-rating">
                <span className="pc-stars">★</span>
                <span className="pc-reviews">{product.rating}</span>
              </div>
            )}
          </div>
          {colors.length > 0 && (
            <div className="pc-swatches">
              {colors.slice(0,5).map(c=>(
                <div key={c} title={c} className="pc-swatch" style={{ background:colorHex[c]??"#c9a96e" }} />
              ))}
              {colors.length > 5 && <span className="pc-more">+{colors.length-5}</span>}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .pc-card { border-radius:14px; overflow:hidden; cursor:pointer; transition:box-shadow 0.3s, transform 0.3s; }
        .pc-card:hover { box-shadow:0 16px 40px rgba(0,0,0,0.10); transform:translateY(-3px); }

        .pc-img-wrap { position:relative; aspect-ratio:3/4; overflow:hidden; background:#f8f6f2; border-radius:14px; }
        .pc-img { width:100%; height:100%; object-fit:cover; transition:transform 0.7s cubic-bezier(0.22,1,0.36,1); display:block; }
        .pc-card:hover .pc-img { transform:scale(1.07); }
        .pc-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }

        /* Badges */
        .pc-badges { position:absolute; top:10px; left:10px; z-index:10; display:flex; flex-direction:column; gap:5px; }
        .pc-badge { display:inline-flex; align-items:center; padding:4px 10px; border-radius:50px; font-size:9px; font-weight:900; letter-spacing:0.14em; text-transform:uppercase; }
        .pc-badge--out  { background:rgba(100,116,139,0.9); color:#fff; backdrop-filter:blur(6px); }
        .pc-badge--feat { background:rgba(15,23,42,0.88); color:#fcd34d; backdrop-filter:blur(6px); }
        .pc-badge--new  { background:rgba(245,158,11,0.92); color:#0f172a; backdrop-filter:blur(6px); }

        /* Action buttons */
        .pc-actions { position:absolute; top:10px; right:10px; z-index:10; display:flex; flex-direction:column; gap:7px; opacity:0; transform:translateX(10px); transition:all 0.3s cubic-bezier(0.22,1,0.36,1); }
        .pc-card:hover .pc-actions { opacity:1; transform:translateX(0); }
        .pc-action-btn { width:38px; height:38px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.95); border:1.5px solid #e2e8f0; border-radius:50%; cursor:pointer; color:#0f172a; transition:all 0.22s; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
        .pc-action-btn:hover, .pc-action-btn.active { background:#f59e0b; border-color:#f59e0b; color:#0f172a; transform:scale(1.08); }

        /* Quick add */
        .pc-quick-add { position:absolute; bottom:0; left:0; right:0; display:flex; align-items:center; justify-content:center; gap:8px; padding:14px; background:#0f172a; color:#fcd34d; font-size:11px; font-weight:900; letter-spacing:0.18em; text-transform:uppercase; border:none; cursor:pointer; transform:translateY(100%); transition:transform 0.35s cubic-bezier(0.22,1,0.36,1); }
        .pc-card:hover .pc-quick-add { transform:translateY(0); }
        .pc-quick-add:hover { background:#f59e0b; color:#0f172a; }

        /* Info */
        .pc-info  { padding:14px 4px 10px; }
        .pc-cat   { font-size:10px; font-weight:800; letter-spacing:0.22em; text-transform:uppercase; color:#d97706; margin:0 0 5px; }
        .pc-name  { font-size:15px; font-weight:700; color:#0f172a; margin:0; line-height:1.3; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
        .pc-row   { display:flex; align-items:center; justify-content:space-between; margin-top:10px; }
        .pc-price { font-size:1rem; font-weight:800; color:#0f172a; margin:0; font-family:var(--font-cormorant,Georgia,serif); }
        .pc-rating{ display:flex; align-items:center; gap:4px; }
        .pc-stars { color:#f59e0b; font-size:13px; font-weight:800; }
        .pc-reviews { color:#94a3b8; font-size:12px; }

        .pc-swatches { display:flex; gap:6px; margin-top:10px; align-items:center; }
        .pc-swatch { width:16px; height:16px; border-radius:50%; border:2px solid #e2e8f0; box-shadow:0 0 0 1px rgba(0,0,0,0.06); transition:transform 0.2s; cursor:pointer; }
        .pc-swatch:hover { transform:scale(1.3); }
        .pc-more { font-size:10px; color:#94a3b8; font-weight:700; }

        @media(max-width:480px){
          .pc-name{font-size:13px} .pc-price{font-size:0.9rem}
          .pc-action-btn{width:32px;height:32px} .pc-quick-add{font-size:10px;padding:11px}
        }
      `}</style>
    </>
  );
}
