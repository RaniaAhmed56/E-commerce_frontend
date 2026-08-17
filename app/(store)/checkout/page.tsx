"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Check, ShoppingBag, CheckCircle, ArrowRight, Package, User } from "lucide-react";
import { useCart } from "@/src/context/CartContext";
import { useAuth } from "@/src/context/AuthContext";
import Summary from "@/ui/checkout/summary";
import Shipping from "@/ui/checkout/shipping";

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);

  // Pre-fill from user profile
  const [shipping, setShipping] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", zip: "",
  });

  // Auto-fill when user data is available — defer the state update to avoid
  // synchronous setState inside the effect (prevents cascading renders).
  useEffect(() => {
    if (!user) return;
    const id = setTimeout(() => {
      setShipping(prev => ({
        firstName: prev.firstName || user.first_name || "",
        lastName:  prev.lastName  || user.last_name  || "",
        email:     prev.email     || user.email      || "",
        phone:     prev.phone     || user.phone      || "",
        address:   prev.address   || user.address    || "",
        city:      prev.city      || user.city       || "",
        zip:       prev.zip       || "",
      }));
    }, 0);
    return () => clearTimeout(id);
  }, [user]);

  const [appliedCoupon] = useState<{ code: string; discount: number; type: "fixed" | "percentage" } | null>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("blanko_applied_coupon") : null;
      return saved ? JSON.parse(saved) : null;
    } catch {
      try { if (typeof window !== "undefined") localStorage.removeItem("blanko_applied_coupon"); } catch {}
      return null;
    }
  });
  const [shippingFee, setShippingFee] = useState(0);

  // coupon is restored via the useState initializer to avoid a synchronous
  // setState call inside an effect.

  const subtotal = getCartTotal();
  const discountAmount = appliedCoupon
    ? (appliedCoupon.type === "percentage" ? (subtotal * appliedCoupon.discount) / 100 : appliedCoupon.discount)
    : 0;
  const total = Math.max(0, subtotal + shippingFee - discountAmount);

  // ── Empty cart ────────────────────────────────
  if (cart.length === 0 && !orderPlaced) return (
    <div style={{ background: "#0f172a", minHeight: "calc(100vh - 112px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", textAlign: "center" }}>
      <ShoppingBag size={64} style={{ color: "rgba(255,255,255,0.1)", marginBottom: 24 }} strokeWidth={1} />
      <h2 style={{ color: "#fff", margin: "0 0 14px" }}>سلتك فارغة</h2>
      <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15, marginBottom: 28 }}>أضيفي EGPنتجات أولًا before theEGPتابعة للدفع</p>
      <Link href="/shop" className="btn-gold" style={{ fontSize: 13 }}>تسوقي theآن</Link>
    </div>
  );

  // ── Order success screen ──────────────────────
  if (orderPlaced) return (
    <div style={{ background: "#0f172a", minHeight: "calc(100vh - 112px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
      <div style={{ maxWidth: 540, width: "100%", textAlign: "center" }}>
        {/* Success icon */}
        <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#10b981,#059669)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 16px 48px rgba(16,185,129,0.35)" }}>
          <CheckCircle size={44} style={{ color: "#fff" }} strokeWidth={2} />
        </div>

        <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 800, color: "#fff", margin: "0 0 14px" }}>
          Order Placed Successfully! 🎉
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 8px" }}>
          EGPرحباً {shipping.firstName || "Dear"}، وصلنا طلبك and processing theEGPراجعة.
        </p>
        {orderId && (
          <p style={{ fontSize: 13, color: "#f59e0b", marginBottom: 32 }}>
            رقEGP theطلب: <strong>#{String(orderId).padStart(4, "0")}</strong>
          </p>
        )}

        {/* Order summary card */}
        <div style={{ background: "#1e293b", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "24px", marginBottom: 32, textAlign: "right" }}>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>Order Summary</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>theTotal</span>
            <span style={{ fontSize: 15, fontWeight: 800, color: "#f59e0b" }}>{total.toLocaleString("ar-EG")} ج.EGP</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Governorate</span>
            <span style={{ fontSize: 13, color: "#fff" }}>{shipping.city}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Phone</span>
            <span style={{ fontSize: 13, color: "#fff" }}>{shipping.phone}</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 24px", background: "rgba(245,158,11,0.12)", border: "1.5px solid rgba(245,158,11,0.3)", borderRadius: 12, color: "#f59e0b", textDecoration: "none", fontSize: 13, fontWeight: 700, transition: "all 0.2s" }}>
            <Package size={16} /> Track Orders
          </Link>
          <Link href="/shop" className="btn-gold" style={{ fontSize: 13 }}>
            Shop Again <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );

  // ── Normal checkout ───────────────────────────
  return (
    <div style={{ background: "#0f172a", minHeight: "calc(100vh - 112px)" }}>
      {/* Top bar */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "18px 0" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <Link href="/" style={{ fontFamily: "var(--font-cormorant,Georgia,serif)", fontSize: 22, fontWeight: 800, color: "#fff", textDecoration: "none", letterSpacing: "0.3em", textTransform: "uppercase" }}>BLANKO</Link>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {[{ n: 1, l: "Shipping Info" }, { n: 2, l: "Confirm Order" }].map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {i > 0 && <div style={{ width: 40, height: 1.5, background: step >= s.n ? "#f59e0b" : "rgba(255,255,255,0.15)", borderRadius: 1 }} />}
                <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: step >= s.n ? 1 : 0.4 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: step > s.n ? "#34d399" : step === s.n ? "#f59e0b" : "rgba(255,255,255,0.1)", fontSize: 11, fontWeight: 800, color: step >= s.n ? "#0f172a" : "rgba(255,255,255,0.4)", transition: "all 0.3s" }}>
                    {step > s.n ? <Check size={13} strokeWidth={3} /> : s.n}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: step >= s.n ? "#fff" : "rgba(255,255,255,0.35)", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{s.l}</span>
                </div>
              </div>
            ))}
          </div>
          {/* User badge */}
          {isAuthenticated && user && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20 }}>
              <User size={14} style={{ color: "#f59e0b" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#fcd34d" }}>{user.first_name || user.username}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 28, alignItems: "flex-start" }}>
          <div style={{ background: "#1e293b", border: "1.5px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: "36px 32px" }}>
            <Shipping
              shipping={shipping}
              setShipping={setShipping}
              inputCls=""
              setStep={setStep}
              setOrderPlaced={(placed) => {
                setOrderPlaced(placed);
                if (placed) clearCart();
              }}
              setShippingFee={setShippingFee}
              setOrderId={setOrderId}
            />
          </div>
          <Summary cart={cart} subtotal={subtotal} shippingFee={shippingFee} total={total} discount={discountAmount} appliedCoupon={appliedCoupon} />
        </div>
      </div>

      <style>{`
        @media(max-width:860px){
          div[style*="grid-template-columns: 1fr 380px"] { display:flex !important; flex-direction:column !important; }
        }
      `}</style>
    </div>
  );
}
