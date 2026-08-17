"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Package, Heart, ShoppingCart, Check,
  Plus, Minus, ArrowRight, Star,
  Truck, RefreshCw, Lock, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { ProductCard } from "@/ui/components/ProductCard";
import { Product, productsApi, variantsApi, type ProductVariant } from "@/src/lib/api";

function toLocal(p: Product): Product {
  return { ...p, price: typeof p.price === "string" ? p.price : String(p.price), inStock: p.in_stock };
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const router = useRouter();

  const [product,         setProduct]         = useState<Product | null>(null);
  const [variants,        setVariants]        = useState<ProductVariant[]>([]);
  const [related,         setRelated]         = useState<Product[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedSize,    setSelectedSize]    = useState("");
  const [activeImg,       setActiveImg]       = useState(0);
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);

  // Product page is public — no auth redirect needed

  useEffect(() => {
    let ok = true;
    (async () => {
      try {
        const p = await productsApi.get(Number(id));
        if (!ok) return;
        setProduct(toLocal(p));
        try {
          const vrs = await variantsApi.getByProduct(Number(id));
          if (ok && vrs.length > 0) {
            setVariants(vrs);
            setSelectedVariant(vrs[0]);
          }
        } catch { /* no variants */ }
        try {
          const res = await productsApi.list({ category: p.category_name, sort: "newest" });
          const items = ((res.results ?? res) as Product[])
            .map(toLocal).filter(x => x.id !== Number(id)).slice(0, 4);
          if (ok) setRelated(items);
        } catch { /* ignore */ }
      } catch { /* not found */ } finally { if (ok) setLoading(false); }
    })();
    return () => { ok = false; };
  }, [id]);

  useEffect(() => { setSelectedSize(""); }, [selectedVariant]);

  // ── Image list ────────────────────────────────────────
  // Priority: variant images → product gallery → product main image
  const imageList = (() => {
    if (!product) return [];
    const list: { src: string; label: string; colorHex?: string; variantIdx?: number }[] = [];

    // 1. If variants exist → use variant images as thumbnails
    if (variants.length > 0) {
    // Main product image first
    const mainSrc = product.image || "";
    if (mainSrc) list.push({ src: mainSrc, label: "Main" });
      // Then each variant's image
      variants.forEach((v, vi) => {
        const imgSrc = v.image && v.image.trim() ? v.image : mainSrc;
        if (imgSrc && !list.some(x => x.src === imgSrc && x.variantIdx !== undefined)) {
          list.push({ src: imgSrc, label: v.color, colorHex: v.color_hex, variantIdx: vi });
        }
      });
    } else {
      // No variants → use gallery images + main image
      const gallery = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
      const main = product.image || "";
      if (gallery.length > 0) {
        gallery.forEach((src, i) => list.push({ src, label: i === 0 ? "Main" : `Image ${i + 1}` }));
      } else if (main) {
        list.push({ src: main, label: "Main" });
      }
    }
    return list;
  })();

  const currentImg = imageList[activeImg]?.src ?? product?.image ?? "/images/placeholder.png";
  const hasVariants = variants.length > 0;
  const priceNum = parseFloat(String(product?.price ?? "0"));
  const inWishlist = product ? isInWishlist(product.id) : false;
  const availSizes = selectedVariant?.sizes.filter(s => s.quantity > 0) ?? [];

  const handleThumbClick = (idx: number) => {
    setActiveImg(idx);
    const img = imageList[idx];
    if (img.variantIdx !== undefined) setSelectedVariant(variants[img.variantIdx]);
  };
  const handleColorClick = (v: ProductVariant, vi: number) => {
    setSelectedVariant(v);
    const imgIdx = imageList.findIndex(x => x.variantIdx === vi);
    if (imgIdx !== -1) setActiveImg(imgIdx);
  };
  const handleAddToCart = async () => {
    if (!product) return;
    if (hasVariants && (!selectedVariant || !selectedSize)) { alert("اختر Color وSize أولاً"); return; }
    await addToCart(product.id, product.name, priceNum, product.image, selectedSize, selectedVariant?.color ?? "", qty);
    setAdded(true); setTimeout(() => setAdded(false), 2200);
  };
  const handleBuyNow = async () => {
    if (!product) return;
    if (hasVariants && (!selectedVariant || !selectedSize)) { alert("اختر Color وSize أولاً"); return; }
    await addToCart(product.id, product.name, priceNum, product.image, selectedSize, selectedVariant?.color ?? "", qty);
    router.push("/checkout");
  };

  // ── Loading ───────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 42, height: 42, border: "3px solid #f59e0b", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin .9s linear infinite" }} />
        <p style={{ color: "#94a3b8", fontSize: 14 }}>Loading product...</p>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!product) return (
    <div style={{ minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <Package size={64} style={{ color: "#e2e8f0", marginBottom: 20 }} strokeWidth={1} />
      <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#0f172a", marginBottom: 14 }}>Product not found</h1>
      <Link href="/shop" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 28px", background: "#0f172a", color: "#fff", borderRadius: 12, textDecoration: "none", fontWeight: 700 }}>
        العودة للمتجر <ArrowRight size={16} />
      </Link>
    </div>
  );

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Breadcrumb */}
      <div style={{ background: "#f8fafc", borderBottom: "1px solid #f1f5f9", padding: "11px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {[{ href: "/", l: "Home" }, { href: "/shop", l: "Store" }, { href: `/shop?category=${product.category_name}`, l: product.category_name || "Products" }, { href: "#", l: product.name }]
            .map((b, i, arr) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i < arr.length - 1
                  ? <><Link href={b.href} style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = "#d97706"}
                      onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = "#94a3b8"}>{b.l}</Link>
                    <span style={{ color: "#d1d5db", fontSize: 10 }}>›</span></>
                  : <span style={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>{b.l}</span>}
              </span>
            ))}
        </div>
      </div>

      {/* Main grid */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "44px 24px" }}>
        <div className="pd-grid">

          {/* ══ LEFT: Images ══════════════════════════════════ */}
          <div>
            {/* Big image */}
            <div style={{ position: "relative", background: "#f5f3ee", borderRadius: 20, overflow: "hidden", aspectRatio: "3/4", marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={currentImg}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "opacity .3s" }}
                key={currentImg}
              />
              {/* Stock overlay */}
              {!product.inStock && (
                <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ color: "#fff", fontSize: 13, letterSpacing: "0.3em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.6)", padding: "10px 24px", fontWeight: 700 }}>Out of Stock</span>
                </div>
              )}
              {/* Active color badge */}
              {selectedVariant && (
                <div style={{ position: "absolute", top: 14, right: 14, background: "rgba(15,23,42,0.82)", backdropFilter: "blur(8px)", borderRadius: 50, padding: "6px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 11, height: 11, borderRadius: "50%", background: selectedVariant.color_hex || "#888", border: "1.5px solid rgba(255,255,255,0.7)", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{selectedVariant.color}</span>
                </div>
              )}
              {/* Arrow navigation for multiple images */}
              {imageList.length > 1 && (
                <>
                  <button onClick={() => setActiveImg(i => Math.max(0, i - 1))} disabled={activeImg === 0}
                    style={{ position: "absolute", top: "50%", right: 12, transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: activeImg === 0 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: activeImg === 0 ? 0.3 : 1, transition: "all .2s" }}>
                    <ChevronRight size={16} style={{ color: "#0f172a" }} />
                  </button>
                  <button onClick={() => setActiveImg(i => Math.min(imageList.length - 1, i + 1))} disabled={activeImg === imageList.length - 1}
                    style={{ position: "absolute", top: "50%", left: 12, transform: "translateY(-50%)", width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.9)", border: "none", cursor: activeImg === imageList.length - 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: activeImg === imageList.length - 1 ? 0.3 : 1, transition: "all .2s" }}>
                    <ChevronLeft size={16} style={{ color: "#0f172a" }} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {imageList.length > 1 && (
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 10 }}>
                  {hasVariants ? "Variant images — click to switch" : "Image gallery"}
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {imageList.map((img, i) => {
                    const isActive = i === activeImg;
                    const isVariantImg = img.variantIdx !== undefined;
                    return (
                      <button key={i} onClick={() => handleThumbClick(i)}
                        style={{ padding: 0, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                        {/* Thumb image */}
                        <div style={{ width: 72, height: 72, borderRadius: 12, overflow: "hidden", border: `2.5px solid ${isActive ? "#0f172a" : "#e5e7eb"}`, transition: "all .22s", transform: isActive ? "scale(1.06)" : "scale(1)", boxShadow: isActive ? "0 4px 16px rgba(0,0,0,0.18)" : "none" }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.src} alt={img.label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </div>
                        {/* Color name under variant thumbs */}
                        {isVariantImg && (
                          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                            {img.colorHex && <div style={{ width: 8, height: 8, borderRadius: "50%", background: img.colorHex, border: "1px solid #e5e7eb", flexShrink: 0 }} />}
                            <span style={{ fontSize: 10, fontWeight: 700, color: isActive ? "#0f172a" : "#9ca3af", transition: "color .2s" }}>{img.label}</span>
                          </div>
                        )}
                        {/* Active dot for non-variant thumbs */}
                        {!isVariantImg && isActive && (
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#0f172a" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ══ RIGHT: Info + Selectors ════════════════════════ */}
          <div className="pd-info">

            {/* Category + Rating */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
              <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", color: "#d97706", margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 20, height: 2, background: "#f59e0b", display: "inline-block", borderRadius: 2 }} />
                {product.category_name || product.category}
              </p>
              {product.rating > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} size={13} style={{ color: s <= Math.round(product.rating) ? "#f59e0b" : "#e2e8f0", fill: s <= Math.round(product.rating) ? "#f59e0b" : "none" }} />
                  ))}
                  <span style={{ fontSize: 12, color: "#9ca3af", marginRight: 4 }}>({product.reviews})</span>
                </div>
              )}
            </div>

            {/* Name */}
            <h1 style={{ fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, color: "#0f172a", lineHeight: 1.05, margin: "0 0 16px" }}>
              {product.name}
            </h1>

            {/* Price */}
            <p style={{ fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: "2.2rem", fontWeight: 800, color: "#0f172a", margin: "0 0 20px" }}>
              {priceNum.toLocaleString("ar-EG")} EGP
            </p>

            {/* Description */}
            {product.description && (
              <div style={{ borderTop: "1.5px solid #fde68a", paddingTop: 18, marginBottom: 24 }}>
                <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: 0 }}>{product.description}</p>
              </div>
            )}

            {/* ── Variants: Color circles + Size buttons ── */}
            {hasVariants && (
              <div style={{ marginBottom: 24 }}>

                {/* Color selector */}
                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: "0 0 12px" }}>
                    Color
                    {selectedVariant && (
                      <span style={{ color: "#d97706", marginRight: 10, fontWeight: 900, textTransform: "none", letterSpacing: 0 }}>
                        — {selectedVariant.color}
                      </span>
                    )}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {variants.map((v, vi) => (
                      <button key={v.color} onClick={() => handleColorClick(v, vi)} title={v.color}
                        style={{ width: 40, height: 40, borderRadius: "50%", border: `3.5px solid ${selectedVariant?.color === v.color ? "#0f172a" : "#e2e8f0"}`, cursor: "pointer", background: v.color_hex || "#ccc", transition: "all .22s", transform: selectedVariant?.color === v.color ? "scale(1.2)" : "scale(1)", boxShadow: selectedVariant?.color === v.color ? "0 4px 14px rgba(0,0,0,0.22)" : "none", outline: "none" }}
                      />
                    ))}
                  </div>
                  {/* Variant image preview beside name */}
                  {selectedVariant?.image && (
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12, padding: "10px 14px", background: "#f8fafc", borderRadius: 10, border: "1px solid #f1f5f9" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedVariant.image} alt={selectedVariant.color} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", border: "2px solid #e2e8f0" }} />
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", margin: "0 0 2px" }}>{selectedVariant.color}</p>
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{availSizes.length} sizes available — {availSizes.reduce((s, x) => s + x.quantity, 0)} items</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Size selector */}
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: "0 0 12px" }}>
                    Size
                    {selectedSize && <span style={{ color: "#d97706", marginRight: 10, fontWeight: 900, textTransform: "none", letterSpacing: 0 }}>— {selectedSize}</span>}
                  </p>
                  {availSizes.length === 0
                    ? <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 600, margin: 0 }}>This color is currently out of stock</p>
                    : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {availSizes.map(s => (
                          <button key={s.size} onClick={() => setSelectedSize(selectedSize === s.size ? "" : s.size)}
                            style={{ position: "relative", minWidth: 56, height: 56, padding: "0 14px", fontSize: 14, fontWeight: 800, border: "2px solid", borderRadius: 14, cursor: "pointer", transition: "all .2s", background: selectedSize === s.size ? "#0f172a" : "#fff", color: selectedSize === s.size ? "#fff" : "#374151", borderColor: selectedSize === s.size ? "#0f172a" : "#e2e8f0", boxShadow: selectedSize === s.size ? "0 4px 14px rgba(15,23,42,0.2)" : "none" }}>
                            {s.size}
                            <span style={{ position: "absolute", top: -7, right: -7, minWidth: 20, height: 20, borderRadius: 10, background: "#f59e0b", color: "#0f172a", fontSize: 9, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                              {s.quantity}
                            </span>
                          </button>
                        ))}
                      </div>
                    )
                  }
                </div>
              </div>
            )}

            {/* Legacy sizes (no variants) */}
            {!hasVariants && Array.isArray(product.sizes) && (product.sizes as string[]).length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.22em", textTransform: "uppercase", color: "#64748b", margin: "0 0 12px" }}>
                  Size {selectedSize && <span style={{ color: "#d97706", marginRight: 8 }}>— {selectedSize}</span>}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {(product.sizes as string[]).map(s => (
                    <button key={s} onClick={() => setSelectedSize(s === selectedSize ? "" : s)}
                      style={{ minWidth: 52, height: 52, padding: "0 12px", fontSize: 14, fontWeight: 800, border: "2px solid", borderRadius: 12, cursor: "pointer", transition: "all .2s", background: selectedSize === s ? "#0f172a" : "#fff", color: selectedSize === s ? "#fff" : "#374151", borderColor: selectedSize === s ? "#0f172a" : "#e2e8f0" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Qty + Actions ── */}
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
              {/* Qty stepper */}
              <div style={{ display: "flex", alignItems: "center", border: "2px solid #e2e8f0", borderRadius: 14, overflow: "hidden", flexShrink: 0 }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ width: 44, height: 54, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", border: "none", cursor: "pointer" }}>
                  <Minus size={14} strokeWidth={2} />
                </button>
                <span style={{ width: 46, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#0f172a" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}
                  style={{ width: 44, height: 54, display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", border: "none", cursor: "pointer" }}>
                  <Plus size={14} strokeWidth={2} />
                </button>
              </div>
              {/* Add to cart */}
                <button onClick={handleAddToCart} disabled={!product.inStock}
                style={{ flex: 1, height: 54, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 14, fontWeight: 800, borderRadius: 14, border: "none", cursor: product.inStock ? "pointer" : "not-allowed", transition: "all .25s", background: added ? "#10b981" : product.inStock ? "#0f172a" : "#e2e8f0", color: product.inStock ? "#fff" : "#9ca3af", boxShadow: added || !product.inStock ? "none" : "0 6px 20px rgba(15,23,42,0.22)" }}>
                {added ? <><Check size={17} />Added!</> : <><ShoppingCart size={17} />Add to Cart</>}
              </button>
              {/* Wishlist */}
              <button onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist({ id: product.id, name: product.name, price: priceNum, image: product.image })}
                style={{ width: 54, height: 54, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 14, border: `2px solid ${inWishlist ? "#fda4af" : "#e2e8f0"}`, cursor: "pointer", transition: "all .2s", background: inWishlist ? "#fff1f2" : "#fff" }}>
                <Heart size={18} style={{ color: inWishlist ? "#f43f5e" : "#9ca3af", fill: inWishlist ? "#f43f5e" : "none" }} strokeWidth={2} />
              </button>
            </div>

            {/* Buy now */}
            <button onClick={handleBuyNow} disabled={!product.inStock}
              style={{ width: "100%", height: 52, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 14, fontWeight: 700, borderRadius: 14, border: "2px solid #0f172a", cursor: product.inStock ? "pointer" : "not-allowed", background: "#fff", color: "#0f172a", transition: "all .25s", marginBottom: 26 }}
              onMouseEnter={e => { if (product.inStock) { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#0f172a"; b.style.color = "#fff"; }}}
              onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#fff"; b.style.color = "#0f172a"; }}>
              Buy Now <ArrowRight size={16} />
            </button>

            {/* Guarantees */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {[
                { Icon: RefreshCw, t: "Free Returns", d: "Within 30 days" },
                { Icon: Truck,     t: "Fast Delivery",  d: "24-48 hours" },
                { Icon: Lock,      t: "Secure Payment",     d: "100% secure" },
              ].map(({ Icon, t, d }) => (
                <div key={t} style={{ textAlign: "center", padding: "14px 8px", background: "#f8fafc", borderRadius: 12, border: "1px solid #f1f5f9" }}>
                  <Icon size={18} style={{ color: "#d97706", margin: "0 auto 6px", display: "block" }} strokeWidth={1.8} />
                  <p style={{ fontSize: 12, fontWeight: 800, color: "#0f172a", margin: "0 0 2px" }}>{t}</p>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0 }}>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div style={{ background: "#f8fafc", padding: "60px 0", borderTop: "1px solid #f1f5f9" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 36, flexWrap: "wrap", gap: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#d97706", margin: "0 0 8px" }}>You may also like</p>
                <h2 style={{ color: "#0f172a", margin: 0, fontSize: "clamp(1.5rem,3vw,2.2rem)", fontWeight: 800 }}>Related products</h2>
              </div>
              <Link href="/shop" style={{ fontSize: 12, fontWeight: 700, color: "#0f172a", textDecoration: "none", display: "flex", alignItems: "center", gap: 6, borderBottom: "2px solid #f59e0b", paddingBottom: 3 }}>
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="products-grid-4">
              {related.map(p => <ProductCard key={p.id} product={{ ...p, price: parseFloat(String(p.price)), inStock: p.in_stock }} />)}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .pd-grid { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:flex-start; }
        .pd-info { position:sticky; top:24px; }
        .products-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        @keyframes spin { to{transform:rotate(360deg)} }
        @media(max-width:960px){ .pd-grid{grid-template-columns:1fr;gap:36px} .pd-info{position:static} }
        @media(max-width:1100px){ .products-grid-4{grid-template-columns:repeat(3,1fr)} }
        @media(max-width:700px){ .products-grid-4{grid-template-columns:repeat(2,1fr);gap:14px} }
      `}</style>
    </div>
  );
}
