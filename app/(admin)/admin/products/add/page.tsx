"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { Save, Loader2, AlertCircle, X, Image as ImageIcon, Plus, Trash2, ChevronDown, ChevronUp, Package } from "lucide-react";
import { variantsApi, productsApi } from "@/src/lib/api";

interface ApiError { data?: Record<string, string[] | string>; status?: number; }

const catOptions = [
  { value: 1, label: "نساء" }, { value: 2, label: "رجال" },
  { value: 3, label: "أطفال" }, { value: 4, label: "إكسسوارات" },
];

const SIZE_PRESETS = ["XS","S","M","L","XL","XXL","2Y","4Y","6Y","8Y","Free"];

const COLOR_PRESETS = [
  { name:"Black",  hex:"#1a1a1a" }, { name:"White",  hex:"#f5f5f5" },
  { name:"Navy",   hex:"#1e3a6e" }, { name:"Beige",  hex:"#d4b896" },
  { name:"Pink",   hex:"#f472b6" }, { name:"Blue",   hex:"#3b82f6" },
  { name:"Gray",   hex:"#9ca3af" }, { name:"Brown",  hex:"#92400e" },
  { name:"Green",  hex:"#16a34a" }, { name:"Red",    hex:"#dc2626" },
  { name:"Purple", hex:"#7c3aed" }, { name:"Orange", hex:"#f97316" },
];

// ── Variant row ────────────────────────────────────────
interface VariantRow {
  color: string;
  color_hex: string;
  imageFile: File | null;
  imagePreview: string;
  imageUrl: string;       // for existing variants from API
  expanded: boolean;
  sizes: { size: string; quantity: number }[];
}

function newVariant(color="", hex=""): VariantRow {
  return { color, color_hex: hex, imageFile: null, imagePreview: "", imageUrl: "", expanded: true, sizes: [] };
}

const L = ({ c }: { c: string }) => (
  <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase" as const, color:"rgba(255,255,255,0.42)", marginBottom:10 }}>{c}</label>
);

export default function AdminAddProduct() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState("");
  const [form, setForm] = useState({
    name:"", price:"", category:1, description:"",
    image: null as File|null, imagePreview:"",
    images: [] as File[], imagePreviews: [] as string[],
    in_stock:true, featured:false, trending:false,
  });
  const [variants, setVariants] = useState<VariantRow[]>([newVariant()]);

  // ── image helpers ──────────────────────────────────
  const readFile = (file: File): Promise<string> =>
    new Promise(res => { const r=new FileReader(); r.onload=e=>res(e.target?.result as string); r.readAsDataURL(file); });

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setForm(p => ({ ...p, image:f, imagePreview: URL.createObjectURL(f) }));
  };
  const handleGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map(f => URL.createObjectURL(f));
    setForm(p => ({ ...p, images:[...p.images,...files], imagePreviews:[...p.imagePreviews,...urls] }));
  };

  // ── variant helpers ────────────────────────────────
  const addVariant = () => setVariants(v => [...v, newVariant()]);
  const removeVariant = (i: number) => setVariants(v => v.filter((_,j)=>j!==i));
  const updateVariant = (i: number, patch: Partial<VariantRow>) =>
    setVariants(v => v.map((row,j) => j===i ? {...row,...patch} : row));

  const handleVariantImage = async (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    updateVariant(i, { imageFile:f, imagePreview:URL.createObjectURL(f) });
  };

  const addSize = (vi: number) =>
    setVariants(v => v.map((row,j) => j===vi ? {...row, sizes:[...row.sizes, {size:"",quantity:1}]} : row));
  const removeSize = (vi: number, si: number) =>
    setVariants(v => v.map((row,j) => j===vi ? {...row, sizes:row.sizes.filter((_,k)=>k!==si)} : row));
  const updateSize = (vi: number, si: number, patch: Partial<{size:string;quantity:number}>) =>
    setVariants(v => v.map((row,j) => j===vi ? {...row, sizes:row.sizes.map((s,k)=>k===si?{...s,...patch}:s)} : row));

  const pickPresetColor = (vi: number, name: string, hex: string) =>
    updateVariant(vi, { color:name, color_hex:hex });

  // ── submit ─────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) { setError("اسم المنتج والسعر مطلوبان"); return; }
    if (!form.image) { setError("الصورة الرئيسية مطلوبة"); return; }
    const validVariants = variants.filter(v => v.color.trim());
    if (validVariants.length === 0) { setError("أضف لوناً واحداً على الأقل"); return; }
    for (const v of validVariants) {
      if (v.sizes.length === 0) { setError(`اللون "${v.color}" ليس له مقاسات`); return; }
      if (v.sizes.some(s => !s.size.trim())) { setError(`اكتب اسم المقاس لكل مقاس في اللون "${v.color}"`); return; }
    }
    setSaving(true); setError("");
    try {
      // 1. Create product with legacy empty arrays (backend handles variants separately)
      const product = await productsApi.create({
        name: form.name.trim(), price: String(parseFloat(form.price)),
        category: form.category, image: form.image!, images: form.images,
        description: form.description.trim(),
        sizes: [], colors: [], in_stock: form.in_stock,
        featured: form.featured, trending: form.trending,
      });

      // 2. Upload variant images and build variants payload
      const variantsPayload = await Promise.all(validVariants.map(async v => {
        let imageUrl = v.imageUrl;
        // If there's a file, upload it via a FormData trick using the product image endpoint
        // For now we use the preview URL or empty string — image upload per variant handled via URL
        if (v.imageFile) {
          // Upload as base64 URL (simplest approach without separate endpoint)
          imageUrl = await readFile(v.imageFile);
        }
        return {
          color: v.color.trim(),
          color_hex: v.color_hex || "#888888",
          image: imageUrl,
          sizes: v.sizes.filter(s=>s.size.trim()).map(s=>({ size:s.size.trim(), quantity:Number(s.quantity)||0 })),
        };
      }));

      // 3. Save variants
      await variantsApi.update(product.id, variantsPayload);
      router.push("/admin/products");
    } catch (err: unknown) {
      const apiError = err as ApiError;
      const msg = Object.values(apiError?.data ?? {}).flat().join(" ") || "حدث خطأ عند الإضافة";
      setError(String(msg));
    } finally { setSaving(false); }
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
        <Link href="/admin/products" style={{ fontSize:13, fontWeight:600, color:"rgba(255,255,255,0.42)", textDecoration:"none" }}
          onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="#f59e0b"}
          onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.42)"}>
          ← المنتجات
        </Link>
        <span style={{ color:"rgba(255,255,255,0.18)" }}>|</span>
        <p className="section-tag" style={{ margin:0 }}>إضافة منتج جديد</p>
      </div>
      <h2 style={{ color:"#ffffff", margin:"0 0 24px", fontSize:"clamp(1.4rem,3vw,2rem)" }}>منتج جديد</h2>

      {error && (
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.25)", borderRadius:10, marginBottom:20 }}>
          <AlertCircle size={15} style={{ color:"#f87171", flexShrink:0 }}/>
          <p style={{ fontSize:13, color:"#f87171", margin:0 }}>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="add-product-grid">
          {/* Left column */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>

            {/* Basic info */}
            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 20px" }}>المعلومات الأساسية</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                <div>
                  <L c="اسم المنتج"/>
                  <input type="text" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}
                    placeholder="اكتب اسم المنتج" className="input-field" style={{fontSize:13}}/>
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <div>
                    <L c="السعر (ج.م)"/>
                    <input type="number" required step="0.01" min="0" value={form.price}
                      onChange={e=>setForm(p=>({...p,price:e.target.value}))} placeholder="0.00" className="input-field" style={{fontSize:13}}/>
                  </div>
                  <div>
                    <L c="التصنيف"/>
                    <select value={form.category} onChange={e=>setForm(p=>({...p,category:parseInt(e.target.value)}))}
                      className="input-field" style={{fontSize:13}}>
                      {catOptions.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                {/* Main image */}
                <div>
                  <L c="الصورة الرئيسية"/>
                  <label htmlFor="main-img" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"20px", border:"2px dashed rgba(255,255,255,0.2)", borderRadius:10, cursor:"pointer", background:"rgba(255,255,255,0.05)", fontSize:13, color:"rgba(255,255,255,0.6)" }}>
                    <ImageIcon size={18}/> اختر صورة من الجهاز
                  </label>
                  <input type="file" accept="image/*" id="main-img" style={{display:"none"}} onChange={handleMainImage}/>
                  {form.imagePreview && <img src={form.imagePreview} alt="preview" style={{ width:"100%", maxHeight:140, objectFit:"contain", borderRadius:8, marginTop:8, background:"rgba(0,0,0,0.2)" }}/>}
                </div>

                {/* Gallery */}
                <div>
                  <L c="صور إضافية (معرض)"/>
                  <label htmlFor="gallery-img" style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, padding:"20px", border:"2px dashed rgba(255,255,255,0.2)", borderRadius:10, cursor:"pointer", background:"rgba(255,255,255,0.05)", fontSize:13, color:"rgba(255,255,255,0.6)" }}>
                    <ImageIcon size={18}/> أضف صوراً من الجهاز (عديدة)
                  </label>
                  <input type="file" accept="image/*" multiple id="gallery-img" style={{display:"none"}} onChange={handleGallery}/>
                  {form.imagePreviews.length>0 && (
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(72px,1fr))", gap:8, marginTop:8 }}>
                      {form.imagePreviews.map((p,i)=>(
                        <div key={i} style={{ position:"relative", aspectRatio:"1", borderRadius:8, overflow:"hidden" }}>
                          <img src={p} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }}/>
                          <button type="button" onClick={()=>setForm(prev=>({...prev,images:prev.images.filter((_,j)=>j!==i),imagePreviews:prev.imagePreviews.filter((_,j)=>j!==i)}))}
                            style={{ position:"absolute", top:3, right:3, width:18, height:18, borderRadius:"50%", background:"rgba(239,68,68,0.9)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <X size={11} style={{color:"#fff"}}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <L c="الوصف"/>
                  <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))}
                    rows={3} placeholder="وصف المنتج..." className="input-field" style={{resize:"none",fontSize:13}}/>
                </div>
              </div>
            </div>

            {/* ── Variants section ───────────────────────────── */}
            <div className="admin-card">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
                <div>
                  <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 4px" }}>المتغيرات (ألوان ومقاسات)</h3>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", margin:0 }}>كل لون له صورة خاصة وقائمة مقاسات بكمياتها</p>
                </div>
                <button type="button" onClick={addVariant}
                  style={{ display:"flex", alignItems:"center", gap:7, padding:"8px 16px", background:"rgba(245,158,11,0.12)", border:"1.5px solid rgba(245,158,11,0.3)", borderRadius:10, cursor:"pointer", fontSize:12, fontWeight:700, color:"#f59e0b" }}>
                  <Plus size={14}/> إضافة لون
                </button>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {variants.map((variant, vi) => (
                  <div key={vi} style={{ border:"1.5px solid rgba(255,255,255,0.08)", borderRadius:14, overflow:"hidden", background:"rgba(255,255,255,0.02)" }}>

                    {/* Variant header */}
                    <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", background:"rgba(255,255,255,0.04)", borderBottom: variant.expanded?"1px solid rgba(255,255,255,0.07)":"none" }}>
                      {/* Color preview circle */}
                      <div style={{ width:28, height:28, borderRadius:"50%", background:variant.color_hex||"#555", border:"2px solid rgba(255,255,255,0.2)", flexShrink:0 }}/>
                      <span style={{ flex:1, fontSize:13, fontWeight:700, color: variant.color?"#ffffff":"rgba(255,255,255,0.3)" }}>
                        {variant.color || `اللون ${vi+1}`}
                      </span>
                      <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{variant.sizes.length} مقاس</span>
                      <button type="button" onClick={()=>updateVariant(vi,{expanded:!variant.expanded})}
                        style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.4)", padding:4 }}>
                        {variant.expanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                      </button>
                      {variants.length > 1 && (
                        <button type="button" onClick={()=>removeVariant(vi)}
                          style={{ background:"none", border:"none", cursor:"pointer", color:"rgba(239,68,68,0.6)", padding:4 }}>
                          <Trash2 size={15}/>
                        </button>
                      )}
                    </div>

                    {variant.expanded && (
                      <div style={{ padding:"16px" }}>
                        {/* Color name input */}
                        <div style={{ marginBottom:14 }}>
                          <L c="اسم اللون"/>
                          <input type="text" value={variant.color}
                            onChange={e=>updateVariant(vi,{color:e.target.value})}
                            placeholder="مثال: أسود، أبيض، Navy..."
                            className="input-field" style={{fontSize:13, marginBottom:10}}/>
                          {/* Color hex */}
                          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                            <input type="color" value={variant.color_hex||"#888888"}
                              onChange={e=>updateVariant(vi,{color_hex:e.target.value})}
                              style={{ width:36, height:36, borderRadius:8, border:"none", cursor:"pointer", background:"none" }}/>
                            <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>اختر اللون أو اختر من الألوان الجاهزة:</span>
                          </div>
                          {/* Preset colors */}
                          <div style={{ display:"flex", flexWrap:"wrap", gap:7, marginTop:10 }}>
                            {COLOR_PRESETS.map(cp=>(
                              <button key={cp.name} type="button" onClick={()=>pickPresetColor(vi,cp.name,cp.hex)}
                                title={cp.name}
                                style={{ width:28, height:28, borderRadius:"50%", background:cp.hex, border: variant.color===cp.name?"3px solid #f59e0b":"2px solid rgba(255,255,255,0.2)", cursor:"pointer", transition:"all 0.2s", transform:variant.color===cp.name?"scale(1.2)":"scale(1)" }}/>
                            ))}
                          </div>
                        </div>

                        {/* Variant image */}
                        <div style={{ marginBottom:16 }}>
                          <L c="صورة هذا اللون"/>
                          <label htmlFor={`var-img-${vi}`} style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", border:"1.5px dashed rgba(255,255,255,0.15)", borderRadius:10, cursor:"pointer", background:"rgba(255,255,255,0.04)", fontSize:12, color:"rgba(255,255,255,0.5)" }}>
                            <ImageIcon size={16}/> اختر صورة لهذا اللون
                          </label>
                          <input type="file" accept="image/*" id={`var-img-${vi}`} style={{display:"none"}} onChange={e=>handleVariantImage(vi,e)}/>
                          {variant.imagePreview && (
                            <div style={{ marginTop:8, position:"relative", display:"inline-block" }}>
                              <img src={variant.imagePreview} alt="" style={{ width:80, height:80, objectFit:"cover", borderRadius:8, border:"2px solid rgba(245,158,11,0.3)" }}/>
                            </div>
                          )}
                        </div>

                        {/* Sizes */}
                        <div>
                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                            <L c="المقاسات والكميات"/>
                            <div style={{ display:"flex", gap:8 }}>
                              {/* Quick add preset sizes */}
                              {SIZE_PRESETS.map(s=>(
                                <button key={s} type="button"
                                  onClick={()=>{ if(!variant.sizes.find(x=>x.size===s)) addSize(vi); setVariants(v=>v.map((row,j)=>j===vi?{...row,sizes:[...row.sizes.filter(x=>x.size!==s),{size:s,quantity:0}]}:row)); }}
                                  style={{ padding:"4px 8px", fontSize:10, fontWeight:700, borderRadius:6, cursor:"pointer", background:variant.sizes.find(x=>x.size===s)?"#f59e0b":"rgba(255,255,255,0.06)", color:variant.sizes.find(x=>x.size===s)?"#0f172a":"rgba(255,255,255,0.4)", border:"none" }}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                            {variant.sizes.map((sz, si)=>(
                              <div key={si} style={{ display:"grid", gridTemplateColumns:"1fr 100px 32px", gap:8, alignItems:"center" }}>
                                <input type="text" value={sz.size}
                                  onChange={e=>updateSize(vi,si,{size:e.target.value})}
                                  placeholder="المقاس (مثال: S, M, L, XL...)"
                                  className="input-field" style={{fontSize:13, padding:"8px 12px"}}/>
                                <input type="number" min="0" value={sz.quantity}
                                  onChange={e=>updateSize(vi,si,{quantity:parseInt(e.target.value)||0})}
                                  placeholder="الكمية"
                                  className="input-field" style={{fontSize:13, padding:"8px 12px"}}/>
                                <button type="button" onClick={()=>removeSize(vi,si)}
                                  style={{ width:32, height:32, borderRadius:8, background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.2)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#f87171" }}>
                                  <X size={13}/>
                                </button>
                              </div>
                            ))}
                            <button type="button" onClick={()=>addSize(vi)}
                              style={{ display:"flex", alignItems:"center", gap:8, padding:"9px 14px", background:"rgba(255,255,255,0.04)", border:"1.5px dashed rgba(255,255,255,0.15)", borderRadius:10, cursor:"pointer", fontSize:12, color:"rgba(255,255,255,0.45)", width:"fit-content" }}>
                              <Plus size={13}/> إضافة مقاس يدوياً
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1.1rem", fontWeight:700, margin:"0 0 20px" }}>حالة المنتج</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  { k:"in_stock",  l:"متوفر في المخزون", desc:"يظهر للشراء" },
                  { k:"featured",  l:"منتج مميز",         desc:"يظهر في القسم المميز" },
                  { k:"trending",  l:"رائج",              desc:"يظهر في قسم الرائج" },
                ].map(f=>(
                  <div key={f.k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <p style={{ fontSize:13, fontWeight:700, color:"#fff", margin:0 }}>{f.l}</p>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:"2px 0 0" }}>{f.desc}</p>
                    </div>
                    <button type="button" onClick={()=>setForm(p=>({...p,[f.k]:!p[f.k as keyof typeof p]}))}
                      style={{ width:44, height:24, borderRadius:50, border:"none", cursor:"pointer", position:"relative", transition:"background 0.3s", flexShrink:0, background: form[f.k as keyof typeof form] ? "#f59e0b" : "rgba(255,255,255,0.15)" }}>
                      <div style={{ position:"absolute", top:3, width:18, height:18, borderRadius:"50%", background:"#fff", transition:"all 0.3s", right:form[f.k as keyof typeof form]?"4px":"auto", left:form[f.k as keyof typeof form]?"auto":"4px" }}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants summary */}
            <div className="admin-card">
              <h3 style={{ color:"#ffffff", fontSize:"1rem", fontWeight:700, margin:"0 0 14px" }}>ملخص المتغيرات</h3>
              {variants.filter(v=>v.color).length === 0
                ? <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", margin:0 }}>لم تضف ألوان بعد</p>
                : variants.filter(v=>v.color).map((v,i)=>(
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
                    <div style={{ width:16, height:16, borderRadius:"50%", background:v.color_hex||"#888", border:"1px solid rgba(255,255,255,0.2)", flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:12, fontWeight:700, color:"#fff", margin:"0 0 2px" }}>{v.color}</p>
                      <p style={{ fontSize:11, color:"rgba(255,255,255,0.35)", margin:0 }}>
                        {v.sizes.length} مقاس · إجمالي {v.sizes.reduce((s,x)=>s+Number(x.quantity),0)} قطعة
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>

            <button type="submit" disabled={saving} className="btn-admin" style={{ width:"100%", justifyContent:"center", fontSize:13, padding:"14px 24px" }}>
              {saving ? <><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/> جارٍ الحفظ...</> : <><Save size={15} strokeWidth={2}/> حفظ المنتج</>}
            </button>
            <Link href="/admin/products" className="btn-admin-ghost" style={{ textAlign:"center", justifyContent:"center", display:"flex" }}>إلغاء</Link>
          </div>
        </div>
      </form>

      <style>{`
        .add-product-grid { display:grid; grid-template-columns:2fr 1fr; gap:20px; align-items:flex-start; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:900px){ .add-product-grid { grid-template-columns:1fr; } }
      `}</style>
    </div>
  );
}
