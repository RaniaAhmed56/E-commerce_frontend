"use client";
import Link from "next/link";
import { useParams} from "next/navigation";
import { useState, useEffect } from "react";
import { Save, Loader2, AlertCircle, Package, Plus, Trash2, X, Image as ImageIcon, ChevronDown, ChevronUp } from "lucide-react";
import { productsApi, variantsApi, type Product, type ProductVariant } from "@/src/lib/api";

interface ApiError { data?: Record<string, string[] | string>; status?: number; }

const catOptions = [
  { value:1, label:"Women" }, { value:2, label:"Men" },
  { value:3, label:"Kids" }, { value:4, label:"Accessories" },
];
const SIZE_PRESETS = ["XS","S","M","L","XL","XXL","2Y","4Y","6Y","8Y","Free"];
const COLOR_PRESETS = [
  { name:"Black",hex:"#1a1a1a"},{name:"White",hex:"#f5f5f5"},{name:"Navy",hex:"#1e3a6e"},
  {name:"Beige",hex:"#d4b896"},{name:"Pink",hex:"#f472b6"},{name:"Blue",hex:"#3b82f6"},
  {name:"Gray",hex:"#9ca3af"},{name:"Brown",hex:"#92400e"},{name:"Green",hex:"#16a34a"},
  {name:"Red",hex:"#dc2626"},{name:"Purple",hex:"#7c3aed"},{name:"Orange",hex:"#f97316"},
];

interface VariantRow {
  color:string; color_hex:string;
  imageFile:File|null; imagePreview:string; imageUrl:string;
  expanded:boolean;
  sizes:{size:string;quantity:number}[];
}
function newVariant(v?: ProductVariant): VariantRow {
  return {
    color: v?.color||"", color_hex: v?.color_hex||"",
    imageFile:null, imagePreview:"", imageUrl: v?.image||"",
    expanded:true,
    sizes: v?.sizes?.map(s=>({size:s.size, quantity:s.quantity})) || [],
  };
}
const L = ({c}:{c:string}) => (
  <label style={{display:"block",fontSize:11,fontWeight:800,letterSpacing:"0.24em",textTransform:"uppercase" as const,color:"rgba(255,255,255,0.42)",marginBottom:10}}>{c}</label>
);

export default function AdminEditProduct() {
  const { id } = useParams<{id:string}>();
  
  const [product, setProduct] = useState<Product|null>(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [saved,   setSaved]   = useState(false);
  const [form, setForm] = useState({
    name:"", price:"", category:1, imagePreview:"",
    description:"", in_stock:true, featured:false, trending:false,
  });
  const [variants, setVariants] = useState<VariantRow[]>([newVariant()]);

  useEffect(() => {
    Promise.all([
      productsApi.get(Number(id)),
      variantsApi.getByProduct(Number(id)).catch(()=>[]),
    ]).then(([p, vrs]) => {
      setProduct(p);
      setForm({
        name:p.name, price:String(parseFloat(String(p.price))),
        category: typeof p.category==="number"?p.category:1,
        imagePreview: p.image||"",
        description:p.description,
        in_stock:p.in_stock, featured:p.featured, trending:p.trending,
      });
      if ((vrs as ProductVariant[]).length > 0) {
        setVariants((vrs as ProductVariant[]).map(v=>newVariant(v)));
      }
    }).catch(()=>setError("Failed to تحميل الProduct"))
      .finally(()=>setLoading(false));
  }, [id]);

  // variant helpers
  const addVariant = () => setVariants(v=>[...v,newVariant()]);
  const removeVariant = (i:number) => setVariants(v=>v.filter((_,j)=>j!==i));
  const updateVariant = (i:number, patch:Partial<VariantRow>) =>
    setVariants(v=>v.map((r,j)=>j===i?{...r,...patch}:r));
  const addSize = (vi:number) =>
    setVariants(v=>v.map((r,j)=>j===vi?{...r,sizes:[...r.sizes,{size:"",quantity:0}]}:r));
  const removeSize = (vi:number,si:number) =>
    setVariants(v=>v.map((r,j)=>j===vi?{...r,sizes:r.sizes.filter((_,k)=>k!==si)}:r));
  const updateSize = (vi:number,si:number,patch:Partial<{size:string;quantity:number}>) =>
    setVariants(v=>v.map((r,j)=>j===vi?{...r,sizes:r.sizes.map((s,k)=>k===si?{...s,...patch}:s)}:r));

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    if (!form.name||!form.price){setError("اسم الProduct والPrice required");return;}
    const validV = variants.filter(v=>v.color.trim());
    if (validV.length===0){setError("أضف لوناً واحداً على minimum");return;}
    for (const v of validV) {
      if (v.sizes.length===0){setError(`Color "${v.color}" ليس له EGPقاسات`);return;}
      if (v.sizes.some(s=>!s.size.trim())){setError(`اكتب اسم Size لكل EGPقاس في "${v.color}"`);return;}
    }
    setSaving(true); setError("");
    try {
      await productsApi.update(Number(id),{
        name:form.name.trim(), price:String(parseFloat(form.price)),
        category:form.category, description:form.description.trim(),
        in_stock:form.in_stock, featured:form.featured, trending:form.trending,
        sizes:[], colors:[],
      });
      const readFile = (f:File):Promise<string> =>
        new Promise(res=>{const r=new FileReader();r.onload=e=>res(e.target?.result as string);r.readAsDataURL(f);});
      const payload = await Promise.all(validV.map(async v=>({
        color:v.color.trim(), color_hex:v.color_hex||"#888888",
        image: v.imageFile ? await readFile(v.imageFile) : v.imageUrl,
        sizes:v.sizes.filter(s=>s.size.trim()).map(s=>({size:s.size.trim(),quantity:Number(s.quantity)||0})),
      })));
      await variantsApi.update(Number(id), payload);
      setSaved(true); setTimeout(()=>setSaved(false),2500);
    } catch(err:unknown){
      const apiError = err as ApiError;
      const msg = Object.values(apiError?.data??{}).flat().join(" ")||"حدث Error عند الSave";
      setError(String(msg));
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:"40vh"}}>
      <Loader2 size={28} style={{color:"rgba(245,158,11,0.6)",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
  if (!product) return (
    <div style={{textAlign:"center",padding:"60px 24px"}}>
      <Package size={48} style={{color:"rgba(255,255,255,0.1)",margin:"0 auto 16px"}}/>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:14}}>الProduct غير EGPوجود</p>
      <Link href="/admin/products" className="btn-admin" style={{display:"inline-flex",marginTop:16}}>← العودة</Link>
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
        <Link href="/admin/products" style={{fontSize:13,fontWeight:600,color:"rgba(255,255,255,0.42)",textDecoration:"none"}}
          onMouseEnter={e=>(e.currentTarget as HTMLAnchorElement).style.color="#f59e0b"}
          onMouseLeave={e=>(e.currentTarget as HTMLAnchorElement).style.color="rgba(255,255,255,0.42)"}>
          ← الProductات
        </Link>
        <span style={{color:"rgba(255,255,255,0.18)"}}>|</span>
        <p className="section-tag" style={{margin:0}}>Edit الProduct</p>
      </div>
      <h2 style={{color:"#ffffff",margin:"0 0 24px",fontSize:"clamp(1.4rem,3vw,2rem)"}}>{product.name}</h2>

      {error && (
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.25)",borderRadius:10,marginBottom:20}}>
          <AlertCircle size={15} style={{color:"#f87171",flexShrink:0}}/>
          <p style={{fontSize:13,color:"#f87171",margin:0}}>{error}</p>
        </div>
      )}
      {saved && (
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 16px",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:10,marginBottom:20}}>
          <p style={{fontSize:13,color:"#34d399",margin:0}}>✅ Done Save الEditات بنجاح</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="add-product-grid">
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            {/* Basic info */}
            <div className="admin-card">
              <h3 style={{color:"#ffffff",fontSize:"1.1rem",fontWeight:700,margin:"0 0 20px"}}>المعلومات الأساسية</h3>
              <div style={{display:"flex",flexDirection:"column",gap:18}}>
                <div>
                  <L c="اسم الProduct"/>
                  <input type="text" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="input-field" style={{fontSize:13}}/>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                  <div>
                    <L c="الPrice (EGP)"/>
                    <input type="number" required step="0.01" min="0" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} className="input-field" style={{fontSize:13}}/>
                  </div>
                  <div>
                    <L c="Category"/>
                    <select value={form.category} onChange={e=>setForm(p=>({...p,category:parseInt(e.target.value)}))} className="input-field" style={{fontSize:13}}>
                      {catOptions.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>
                {form.imagePreview && (
                  <div>
                    <L c="Image Current"/>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.imagePreview} alt="" style={{width:"100%",maxHeight:140,objectFit:"contain",borderRadius:8,background:"rgba(0,0,0,0.2)"}}/>
                  </div>
                )}
                <div>
                  <L c="Description"/>
                  <textarea value={form.description} onChange={e=>setForm(p=>({...p,description:e.target.value}))} rows={3} className="input-field" style={{resize:"none",fontSize:13}}/>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="admin-card">
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                <div>
                  <h3 style={{color:"#ffffff",fontSize:"1.1rem",fontWeight:700,margin:"0 0 4px"}}>المتغيرات (ألوان وSizeات)</h3>
                  <p style={{fontSize:12,color:"rgba(255,255,255,0.35)",margin:0}}>كل لون له Imagesة special وقائمة EGPقاسات بكمياتها</p>
                </div>
                <button type="button" onClick={addVariant} style={{display:"flex",alignItems:"center",gap:7,padding:"8px 16px",background:"rgba(245,158,11,0.12)",border:"1.5px solid rgba(245,158,11,0.3)",borderRadius:10,cursor:"pointer",fontSize:12,fontWeight:700,color:"#f59e0b"}}>
                  <Plus size={14}/> Add لون
                </button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {variants.map((variant,vi)=>(
                  <div key={vi} style={{border:"1.5px solid rgba(255,255,255,0.08)",borderRadius:14,overflow:"hidden",background:"rgba(255,255,255,0.02)"}}>
                    <div style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"rgba(255,255,255,0.04)",borderBottom:variant.expanded?"1px solid rgba(255,255,255,0.07)":"none"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:variant.color_hex||"#555",border:"2px solid rgba(255,255,255,0.2)",flexShrink:0}}/>
                      <span style={{flex:1,fontSize:13,fontWeight:700,color:variant.color?"#ffffff":"rgba(255,255,255,0.3)"}}>{variant.color||`Color ${vi+1}`}</span>
                      <span style={{fontSize:11,color:"rgba(255,255,255,0.3)"}}>{variant.sizes.length} EGPقاس</span>
                      <button type="button" onClick={()=>updateVariant(vi,{expanded:!variant.expanded})} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(255,255,255,0.4)",padding:4}}>
                        {variant.expanded?<ChevronUp size={16}/>:<ChevronDown size={16}/>}
                      </button>
                      {variants.length>1 && (
                        <button type="button" onClick={()=>removeVariant(vi)} style={{background:"none",border:"none",cursor:"pointer",color:"rgba(239,68,68,0.6)",padding:4}}>
                          <Trash2 size={15}/>
                        </button>
                      )}
                    </div>
                    {variant.expanded && (
                      <div style={{padding:"16px"}}>
                        <div style={{marginBottom:14}}>
                          <L c="اسم Color"/>
                          <input type="text" value={variant.color} onChange={e=>updateVariant(vi,{color:e.target.value})} placeholder="مثال: أسود، أبيض، Navy..." className="input-field" style={{fontSize:13,marginBottom:10}}/>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <input type="color" value={variant.color_hex||"#888888"} onChange={e=>updateVariant(vi,{color_hex:e.target.value})} style={{width:36,height:36,borderRadius:8,border:"none",cursor:"pointer"}}/>
                            <span style={{fontSize:12,color:"rgba(255,255,255,0.4)"}}>أو اختر EGPن الألوان الجاهزة:</span>
                          </div>
                          <div style={{display:"flex",flexWrap:"wrap",gap:7,marginTop:10}}>
                            {COLOR_PRESETS.map(cp=>(
                              <button key={cp.name} type="button" onClick={()=>updateVariant(vi,{color:cp.name,color_hex:cp.hex})} title={cp.name}
                                style={{width:28,height:28,borderRadius:"50%",background:cp.hex,border:variant.color===cp.name?"3px solid #f59e0b":"2px solid rgba(255,255,255,0.2)",cursor:"pointer",transform:variant.color===cp.name?"scale(1.2)":"scale(1)",transition:"all 0.2s"}}/>
                            ))}
                          </div>
                        </div>
                        <div style={{marginBottom:16}}>
                          <L c="Imagesة This Color"/>
                          {(variant.imagePreview||variant.imageUrl) && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={variant.imagePreview||variant.imageUrl} alt="" style={{width:80,height:80,objectFit:"cover",borderRadius:8,border:"2px solid rgba(245,158,11,0.3)",marginBottom:8,display:"block"}}/>
                          )}
                          <label htmlFor={`var-img-${vi}`} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",border:"1.5px dashed rgba(255,255,255,0.15)",borderRadius:10,cursor:"pointer",background:"rgba(255,255,255,0.04)",fontSize:12,color:"rgba(255,255,255,0.5)"}}>
                            <ImageIcon size={16}/> {variant.imagePreview||variant.imageUrl?"Change Image":"اختر Imagesة لThis Color"}
                          </label>
                          <input type="file" accept="image/*" id={`var-img-${vi}`} style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)updateVariant(vi,{imageFile:f,imagePreview:URL.createObjectURL(f)});}}/>
                        </div>
                        <div>
                          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                            <L c="Sizeات والكميات"/>
                            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                              {SIZE_PRESETS.map(s=>(
                                <button key={s} type="button"
                                  onClick={()=>setVariants(v=>v.map((row,j)=>j===vi?{...row,sizes:row.sizes.find(x=>x.size===s)?row.sizes:[ ...row.sizes,{size:s,quantity:0}]}:row))}
                                  style={{padding:"3px 8px",fontSize:10,fontWeight:700,borderRadius:6,cursor:"pointer",background:variant.sizes.find(x=>x.size===s)?"#f59e0b":"rgba(255,255,255,0.06)",color:variant.sizes.find(x=>x.size===s)?"#0f172a":"rgba(255,255,255,0.4)",border:"none"}}>
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",gap:8}}>
                            {variant.sizes.map((sz,si)=>(
                              <div key={si} style={{display:"grid",gridTemplateColumns:"1fr 100px 32px",gap:8,alignItems:"center"}}>
                                <input type="text" value={sz.size} onChange={e=>updateSize(vi,si,{size:e.target.value})} placeholder="Size" className="input-field" style={{fontSize:13,padding:"8px 12px"}}/>
                                <input type="number" min="0" value={sz.quantity} onChange={e=>updateSize(vi,si,{quantity:parseInt(e.target.value)||0})} placeholder="Quantity" className="input-field" style={{fontSize:13,padding:"8px 12px"}}/>
                                <button type="button" onClick={()=>removeSize(vi,si)} style={{width:32,height:32,borderRadius:8,background:"rgba(239,68,68,0.1)",border:"1px solid rgba(239,68,68,0.2)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#f87171"}}>
                                  <X size={13}/>
                                </button>
                              </div>
                            ))}
                            <button type="button" onClick={()=>addSize(vi)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 14px",background:"rgba(255,255,255,0.04)",border:"1.5px dashed rgba(255,255,255,0.15)",borderRadius:10,cursor:"pointer",fontSize:12,color:"rgba(255,255,255,0.45)",width:"fit-content"}}>
                              <Plus size={13}/> Add EGPقاس
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
          <div style={{display:"flex",flexDirection:"column",gap:18}}>
            <div className="admin-card">
              <h3 style={{color:"#ffffff",fontSize:"1.1rem",fontWeight:700,margin:"0 0 20px"}}>حالة الProduct</h3>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {[{k:"in_stock",l:"In Stock",desc:"يظهر للشراء"},{k:"featured",l:"Featured",desc:"يظهر في الFeatured"},{k:"trending",l:"Trending",desc:"يظهر في الTrending"}].map(f=>(
                  <div key={f.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <p style={{fontSize:13,fontWeight:700,color:"#fff",margin:0}}>{f.l}</p>
                      <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:"2px 0 0"}}>{f.desc}</p>
                    </div>
                    <button type="button" onClick={()=>setForm(p=>({...p,[f.k]:!p[f.k as keyof typeof p]}))}
                      style={{width:44,height:24,borderRadius:50,border:"none",cursor:"pointer",position:"relative",transition:"background 0.3s",flexShrink:0,background:form[f.k as keyof typeof form]?"#f59e0b":"rgba(255,255,255,0.15)"}}>
                      <div style={{position:"absolute",top:3,width:18,height:18,borderRadius:"50%",background:"#fff",transition:"all 0.3s",right:form[f.k as keyof typeof form]?"4px":"auto",left:form[f.k as keyof typeof form]?"auto":"4px"}}/>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-card">
              <h3 style={{color:"#ffffff",fontSize:"1rem",fontWeight:700,margin:"0 0 14px"}}>ملخص الألوان</h3>
              {variants.filter(v=>v.color).map((v,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                  <div style={{width:16,height:16,borderRadius:"50%",background:v.color_hex||"#888",border:"1px solid rgba(255,255,255,0.2)",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    <p style={{fontSize:12,fontWeight:700,color:"#fff",margin:"0 0 2px"}}>{v.color}</p>
                    <p style={{fontSize:11,color:"rgba(255,255,255,0.35)",margin:0}}>{v.sizes.length} EGPقاس · {v.sizes.reduce((s,x)=>s+Number(x.quantity),0)} قطعة</p>
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" disabled={saving} className="btn-admin" style={{width:"100%",justifyContent:"center",fontSize:13,padding:"14px 24px"}}>
              {saving?<><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/> Saving...</>:<><Save size={15}/> Save الEditات</>}
            </button>
            <Link href="/admin/products" className="btn-admin-ghost" style={{textAlign:"center",justifyContent:"center",display:"flex"}}>Cancel</Link>
          </div>
        </div>
      </form>
      <style>{`.add-product-grid{display:grid;grid-template-columns:2fr 1fr;gap:20px;align-items:flex-start}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@media(max-width:900px){.add-product-grid{grid-template-columns:1fr}}`}</style>
    </div>
  );
}
