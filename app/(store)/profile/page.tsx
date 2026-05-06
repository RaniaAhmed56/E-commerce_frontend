"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/src/context/AuthContext";
import { useWishlist } from "@/src/context/WishlistContext";
import { useRouter } from "next/navigation";
import {
  Package, Heart, Check, User, Mail, Phone, MapPin,
  Camera, ArrowRight, Loader2, AlertCircle, Tag,
  ShoppingBag, Clock, Truck, CheckCircle, XCircle, Copy, Gift, Trash2,
} from "lucide-react";
import { ordersApi, couponsApi, wishlistApi, type Order, type ActiveCoupon } from "@/src/lib/api";

// ── helpers ──────────────────────────────────────────
const STATUS_MAP: Record<string, { label: string; color: string; bg: string; Icon: any }> = {
  processing: { label: "قيد المعالجة", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", Icon: Clock },
  shipping:   { label: "في الطريق",    color: "#3b82f6", bg: "rgba(59,130,246,0.12)", Icon: Truck },
  delivered:  { label: "تم التسليم",   color: "#10b981", bg: "rgba(16,185,129,0.12)", Icon: CheckCircle },
  cancelled:  { label: "ملغي",         color: "#ef4444", bg: "rgba(239,68,68,0.12)",  Icon: XCircle },
};
function fmtDate(s: string) {
  return new Date(s).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

// ── Orders Tab ───────────────────────────────────────
function OrdersTab() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    ordersApi.myOrders()
      .then(data => {
        const list = Array.isArray(data) ? data : (data as any)?.results ?? [];
        setOrders(list);
      })
      .catch(err => {
        console.error("Orders error:", err);
        setError("تعذر تحميل الطلبات — تأكد من تشغيل السيرفر بالكود الجديد");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}><Loader2 size={26} style={{ color: "#f59e0b", animation: "spin 1s linear infinite" }} /></div>;

  if (error) return (
    <div style={{ padding: "18px 20px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <AlertCircle size={16} style={{ color: "#f87171" }} />
        <p style={{ fontSize: 14, color: "#f87171", margin: 0, fontWeight: 700 }}>{error}</p>
      </div>
      <p style={{ fontSize: 12, color: "rgba(239,68,68,0.7)", margin: 0 }}>
        خطوات الإصلاح: استبدل <code>api/views.py</code> بالملف الجديد ثم أعد تشغيل السيرفر
      </p>
    </div>
  );

  if (!orders.length) return (
    <div style={{ textAlign: "center", padding: "56px 24px" }}>
      <ShoppingBag size={48} style={{ color: "rgba(255,255,255,0.12)", margin: "0 auto 16px" }} />
      <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.45)", margin: "0 0 8px" }}>لا توجد طلبات بعد</p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", margin: "0 0 24px" }}>ابدئي التسوق واحصلي على أول طلب!</p>
      <Link href="/shop" className="btn-gold" style={{ display: "inline-flex", fontSize: 13 }}>تسوق الآن <ArrowRight size={15} /></Link>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {orders.map(order => {
        const st = STATUS_MAP[order.status] ?? STATUS_MAP.processing;
        const StatusIcon = st.Icon;
        return (
          <div key={order.id} style={{ background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 800, color: "#f59e0b" }}>#{String(order.id).padStart(4, "0")}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{fmtDate(order.created_at)}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "5px 12px", borderRadius: 20, background: st.bg }}>
                <StatusIcon size={13} style={{ color: st.color }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: st.color }}>{order.status_display || st.label}</span>
              </div>
            </div>
            {/* Items */}
            <div style={{ padding: "12px 18px" }}>
              {order.items?.slice(0, 3).map(item => (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 9 }}>
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }} />
                    : <div style={{ width: 44, height: 44, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}><ShoppingBag size={18} style={{ color: "rgba(255,255,255,0.2)" }} /></div>
                  }
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#fff", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: "3px 0 0" }}>
                      {[item.color, item.size].filter(Boolean).join(" · ")} × {item.quantity}
                    </p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#fcd34d", flexShrink: 0 }}>{Number(item.price).toLocaleString("ar-EG")} ج.م</span>
                </div>
              ))}
              {(order.items?.length ?? 0) > 3 && (
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: "4px 0 0" }}>+ {order.items.length - 3} منتجات أخرى</p>
              )}
            </div>
            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 18px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.12)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>الإجمالي</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: "#f59e0b" }}>{Number(order.total).toLocaleString("ar-EG")} ج.م</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {Number(order.discount_amount) > 0 && (
                  <span style={{ fontSize: 11, color: "#10b981", background: "rgba(16,185,129,0.1)", padding: "3px 10px", borderRadius: 20 }}>
                    خصم {Number(order.discount_amount).toLocaleString("ar-EG")} ج.م
                  </span>
                )}
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{order.payment_display || order.payment_method}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Coupons Tab ──────────────────────────────────────
function CouponsTab() {
  const [coupons, setCoupons] = useState<ActiveCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState<string | null>(null);
  const [error,   setError]   = useState("");

  useEffect(() => {
    couponsApi.active()
      .then(setCoupons)
      .catch(() => setError("تعذر تحميل الكوبونات"))
      .finally(() => setLoading(false));
  }, []);

  const copy = (code: string) => {
    navigator.clipboard.writeText(code).then(() => { setCopied(code); setTimeout(() => setCopied(null), 2000); });
  };

  if (loading) return <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}><Loader2 size={26} style={{ color: "#f59e0b", animation: "spin 1s linear infinite" }} /></div>;
  if (error)   return <div style={{ padding: "18px 20px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 12 }}><p style={{ fontSize: 14, color: "#f87171", margin: 0 }}>{error}</p></div>;
  if (!coupons.length) return (
    <div style={{ textAlign: "center", padding: "56px 24px" }}>
      <Gift size={48} style={{ color: "rgba(255,255,255,0.12)", margin: "0 auto 16px" }} />
      <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.45)", margin: "0 0 8px" }}>لا توجد كوبونات متاحة</p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", margin: 0 }}>تابعنا لمعرفة أحدث العروض</p>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 16 }}>
      {coupons.map(c => (
        <div key={c.code} style={{ background: "rgba(245,158,11,0.06)", border: "1.5px dashed rgba(245,158,11,0.3)", borderRadius: 14, padding: "18px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "radial-gradient(circle,rgba(245,158,11,0.15),transparent 70%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Tag size={16} style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>كوبون خصم</p>
              <p style={{ fontSize: 22, fontWeight: 900, color: "#f59e0b", margin: "2px 0 0", lineHeight: 1 }}>
                {c.discount_type === "percent" ? `${c.discount}%` : `${Number(c.discount).toLocaleString("ar-EG")} ج.م`}
              </p>
            </div>
          </div>
          <button onClick={() => copy(c.code)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, cursor: "pointer" }}>
            <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "0.18em", color: "#fff", fontFamily: "monospace" }}>{c.code}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: copied === c.code ? "#10b981" : "#f59e0b" }}>
              {copied === c.code ? <><Check size={13} />تم</> : <><Copy size={13} />نسخ</>}
            </span>
          </button>
          {c.expiry && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.28)", margin: "10px 0 0", textAlign: "center" }}>ينتهي {fmtDate(c.expiry)}</p>}
        </div>
      ))}
    </div>
  );
}

// ── Wishlist Tab ──────────────────────────────────────
function WishlistTab() {
  const { wishlist, removeFromWishlist } = useWishlist();

  if (!wishlist.length) return (
    <div style={{ textAlign: "center", padding: "56px 24px" }}>
      <Heart size={48} style={{ color: "rgba(255,255,255,0.12)", margin: "0 auto 16px" }} />
      <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.45)", margin: "0 0 8px" }}>قائمة المفضلة فارغة</p>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", margin: "0 0 24px" }}>أضف منتجات لقائمة المفضلة من صفحة المنتج</p>
      <Link href="/shop" className="btn-gold" style={{ display: "inline-flex", fontSize: 13 }}>تصفح المنتجات <ArrowRight size={15} /></Link>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 14 }}>
      {wishlist.map(item => (
        <div key={item.id} style={{ background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 14, overflow: "hidden", position: "relative" }}>
          <Link href={`/product/${item.id}`} style={{ textDecoration: "none", display: "block" }}>
            <div style={{ aspectRatio: "3/4", overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
              <img src={item.image || "/images/placeholder.png"} alt={item.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s" }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)"}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
              />
            </div>
            <div style={{ padding: "10px 12px 12px" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#f59e0b", margin: 0 }}>{Number(item.price).toLocaleString("ar-EG")} ج.م</p>
            </div>
          </Link>
          {/* Remove button */}
          <button onClick={() => removeFromWishlist(item.id)}
            style={{ position: "absolute", top: 8, left: 8, width: 28, height: 28, borderRadius: "50%", background: "rgba(15,23,42,0.75)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }}>
            <Trash2 size={13} style={{ color: "#f87171" }} />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Main Profile ──────────────────────────────────────
const TABS = [
  { id: "info",     label: "البيانات الشخصية", Icon: User    },
  { id: "orders",   label: "طلباتي",            Icon: Package },
  { id: "coupons",  label: "الكوبونات",          Icon: Tag     },
  { id: "wishlist", label: "المفضلة",            Icon: Heart   },
];

export default function ProfilePage() {
  const { user, isAuthenticated, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "", address: "", city: "", country: "مصر",
  });

  useEffect(() => { if (!authLoading && !isAuthenticated) router.push("/login"); }, [authLoading, isAuthenticated]);
  useEffect(() => {
    if (user) setForm({ first_name: user.first_name || "", last_name: user.last_name || "", email: user.email || "", phone: user.phone || "", address: user.address || "", city: user.city || "", country: user.country || "مصر" });
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError("");
    try { await updateUser(form); setSaved(true); setTimeout(() => setSaved(false), 2500); }
    catch { setError("حدث خطأ عند الحفظ."); }
    finally { setSaving(false); }
  };

  if (authLoading || !user) return (
    <div style={{ background: "#0f172a", minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Loader2 size={28} style={{ color: "rgba(245,158,11,0.6)", animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const initials = [form.first_name, form.last_name].filter(Boolean).map(s => s[0]).join("").toUpperCase() || user.username?.[0]?.toUpperCase() || "م";
  const fullName = [form.first_name, form.last_name].filter(Boolean).join(" ") || user.username;
  const L = ({ c }: { c: string }) => <label style={{ display: "block", fontSize: 11, fontWeight: 800, letterSpacing: "0.24em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>{c}</label>;

  return (
    <>
      <div style={{ background: "#0f172a", minHeight: "calc(100vh - 112px)", paddingBottom: 60 }}>

        {/* Header + Tabs */}
        <div style={{ background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 0" }}>
            <p className="section-tag" style={{ marginBottom: 10 }}>الحساب</p>
            <h1 style={{ color: "#fff", margin: "0", fontSize: "clamp(1.8rem,4vw,2.8rem)", fontWeight: 700 }}>ملفي الشخصي</h1>
            <div style={{ display: "flex", gap: 0, marginTop: 24, overflowX: "auto" }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", fontSize: 13, fontWeight: 700, background: "none", border: "none", cursor: "pointer", borderBottom: activeTab === t.id ? "2.5px solid #f59e0b" : "2.5px solid transparent", color: activeTab === t.id ? "#f59e0b" : "rgba(255,255,255,0.45)", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                  <t.Icon size={14} />{t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          <div className="profile-layout">

            {/* Sidebar */}
            <div style={{ background: "#1e293b", border: "1.5px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden", alignSelf: "flex-start" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg,#f59e0b,#fcd34d,#d97706)" }} />
              <div style={{ padding: "28px 22px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <div style={{ position: "relative", marginBottom: 16 }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg,#f59e0b,#d97706)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: "#0f172a", boxShadow: "0 8px 24px rgba(245,158,11,0.38)" }}>{initials}</div>
                  <div style={{ position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%", background: "#0f172a", border: "2px solid #f59e0b", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}><Camera size={12} /></div>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#fff", margin: "0 0 3px" }}>{fullName}</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 24px" }}>{form.email || user.email}</p>
                <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
                  {TABS.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 14px", background: activeTab === t.id ? "rgba(245,158,11,0.12)" : "rgba(255,255,255,0.05)", border: activeTab === t.id ? "1.5px solid rgba(245,158,11,0.3)" : "1.5px solid rgba(255,255,255,0.07)", borderRadius: 10, cursor: "pointer", width: "100%", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <t.Icon size={14} style={{ color: activeTab === t.id ? "#f59e0b" : "rgba(255,255,255,0.45)" }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: activeTab === t.id ? "#f59e0b" : "rgba(255,255,255,0.6)" }}>{t.label}</span>
                      </div>
                      <ArrowRight size={12} style={{ color: activeTab === t.id ? "#f59e0b" : "rgba(255,255,255,0.25)" }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main panel */}
            <div style={{ background: "#1e293b", border: "1.5px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden" }}>
              <div style={{ height: 3, background: "linear-gradient(90deg,#f59e0b,#fcd34d,transparent)" }} />
              <div style={{ padding: "30px 26px" }}>

                {/* Info tab */}
                {activeTab === "info" && (
                  <>
                    {error && <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, marginBottom: 22 }}><AlertCircle size={14} style={{ color: "#f87171" }} /><p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>{error}</p></div>}
                    <form onSubmit={handleSave}>
                      <h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700, margin: "0 0 24px" }}>المعلومات الشخصية</h3>
                      <div className="profile-form-grid">
                        {[
                          { k: "first_name", l: "الاسم الأول",      Icon: User,   full: false },
                          { k: "last_name",  l: "اسم العائلة",       Icon: User,   full: false },
                          { k: "email",      l: "البريد الإلكتروني", Icon: Mail,   full: false },
                          { k: "phone",      l: "رقم الهاتف",        Icon: Phone,  full: false },
                          { k: "city",       l: "المدينة",           Icon: MapPin, full: false },
                          { k: "country",    l: "البلد",             Icon: MapPin, full: false },
                          { k: "address",    l: "العنوان",           Icon: MapPin, full: true  },
                        ].map(f => (
                          <div key={f.k} style={{ gridColumn: f.full ? "span 2" : "auto" }} className={f.full ? "full-col" : ""}>
                            <L c={f.l} />
                            <div style={{ position: "relative" }}>
                              <f.Icon size={13} style={{ position: "absolute", right: 15, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.25)" }} />
                              <input type={f.k === "email" ? "email" : "text"} value={form[f.k as keyof typeof form]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} className="input-field" style={{ paddingRight: 40 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button type="submit" disabled={saving} className="btn-gold" style={{ fontSize: 13, marginTop: 24 }}>
                        {saving ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> جارٍ الحفظ...</> : saved ? <><Check size={14} /> تم الحفظ!</> : "حفظ التغييرات"}
                      </button>
                    </form>
                  </>
                )}

                {activeTab === "orders" && (
                  <><h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700, margin: "0 0 22px" }}>طلباتي</h3><OrdersTab /></>
                )}

                {activeTab === "coupons" && (
                  <>
                    <h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700, margin: "0 0 6px" }}>الكوبونات المتاحة</h3>
                    <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "0 0 22px" }}>انسخ الكود واستخدمه عند الدفع</p>
                    <CouponsTab />
                  </>
                )}

                {activeTab === "wishlist" && (
                  <>
                    <h3 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700, margin: "0 0 22px" }}>قائمتي المفضلة</h3>
                    <WishlistTab />
                  </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .profile-layout { display:grid; grid-template-columns:260px 1fr; gap:22px; align-items:flex-start; }
        .profile-form-grid { display:grid; grid-template-columns:1fr 1fr; gap:18px 20px; }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media(max-width:900px){ .profile-layout{grid-template-columns:1fr} }
        @media(max-width:560px){ .profile-form-grid{grid-template-columns:1fr} .full-col{grid-column:span 1 !important} }
      `}</style>
    </>
  );
}
