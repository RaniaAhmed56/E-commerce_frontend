"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Phone, AlertCircle, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm]       = useState({ name:"", email:"", phone:"", password:"", confirm:"" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match"); return; }
    if (form.password.length < 6)       { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      const nameParts = form.name.trim().split(" ");
      await register({
        username:   form.email,
        email:      form.email,
        first_name: nameParts[0] || "",
        last_name:  nameParts.slice(1).join(" ") || "",
        phone:      form.phone,
        password:   form.password,
        password2:  form.confirm,
      });
      router.push("/");
    } catch (err) {
      const maybe = err as { data?: Record<string, string[] | string> } | undefined;
      const vals = Object.values(maybe?.data ?? {}) as Array<string[] | string>;
      const flatVals = vals.reduce<string[]>((acc, v) => acc.concat(Array.isArray(v) ? v : [String(v)]), []);
      const msg = flatVals.join(" ") || "Registration failed. Please try again.";
      setError(msg);
    } finally { setLoading(false); }
  };

  const perks = ["Free shipping on first order","Exclusive member discounts","Early access to new collections","24/7 customer support"];

  return (
    <div className="auth-wrap">
      {/* Image side */}
      <div className="auth-img-side">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&q=90"
          alt="BLANKO" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center 30%" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(10,14,28,0.90) 0%,rgba(10,14,28,0.35) 100%)" }} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 70% 30%, rgba(245,158,11,0.10), transparent 55%)" }} />
        <div style={{ position:"absolute", bottom:56, left:48, right:48 }}>
          <p className="section-tag" style={{ marginBottom:14 }}>Join BLANKO</p>
          <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"3rem", fontWeight:800, color:"#ffffff", lineHeight:1.0, margin:"0 0 20px" }}>
            Become Part of<br /><span style={{ fontStyle:"italic", color:"#f59e0b" }}>Our World.</span>
          </h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {perks.map(p => (
              <div key={p} style={{ display:"flex", alignItems:"center", gap:10 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"rgba(245,158,11,0.2)", border:"1px solid rgba(245,158,11,0.4)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <Check size={11} style={{ color:"#f59e0b" }} strokeWidth={3} />
                </div>
                <span style={{ fontSize:13, color:"rgba(255,255,255,0.65)" }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 36px", background:"#0f172a", minHeight:"100vh" }}>
        <div style={{ width:"100%", maxWidth:440 }}>
          <div style={{ marginBottom:36, textAlign:"center" }}>
            <Link href="/" style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"2rem", fontWeight:800, color:"#ffffff", textDecoration:"none", letterSpacing:"0.25em" }}>BLANKO</Link>
            <p style={{ fontSize:11, letterSpacing:"0.3em", color:"rgba(255,255,255,0.3)", marginTop:4, textTransform:"uppercase" }}>Fashion House</p>
          </div>

          <div style={{ marginBottom:32 }}>
            <h1 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"2.4rem", fontWeight:800, color:"#ffffff", margin:"0 0 10px", lineHeight:1 }}>Create Account</h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:0 }}>
              Already have an account?{" "}
              <Link href="/login" style={{ color:"#f59e0b", fontWeight:700, textDecoration:"none" }}>Sign In</Link>
            </p>
          </div>

          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(239,68,68,0.10)", border:"1px solid rgba(239,68,68,0.22)", borderRadius:10, marginBottom:20 }}>
              <AlertCircle size={15} style={{ color:"#f87171", flexShrink:0 }} />
              <p style={{ fontSize:13, color:"#f87171", margin:0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[
              { k:"name",  l:"Full Name",      Icon:User,  type:"text",  ph:"John Doe" },
              { k:"email", l:"Email Address",  Icon:Mail,  type:"email", ph:"your@email.com" },
              { k:"phone", l:"Phone Number",   Icon:Phone, type:"tel",   ph:"+20 1XX XXX XXXX" },
            ].map(f => (
              <div key={f.k}>
                <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:10 }}>{f.l}</label>
                <div style={{ position:"relative" }}>
                  <f.Icon size={14} style={{ position:"absolute", right:15, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.25)" }} />
                  <input type={f.type} required value={form[f.k as keyof typeof form]} onChange={e=>setForm(p=>({...p,[f.k]:e.target.value}))}
                    placeholder={f.ph} className="input-field" style={{ paddingRight:42 }} />
                </div>
              </div>
            ))}
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:10 }}>Password</label>
              <div style={{ position:"relative" }}>
                <Lock size={14} style={{ position:"absolute", right:15, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.25)" }} />
                <input type={showPwd?"text":"password"} required minLength={6} value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                  placeholder="Min. 6 characters" className="input-field" style={{ paddingRight:42, paddingLeft:42 }} />
                <button type="button" onClick={()=>setShowPwd(v=>!v)}
                  style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.35)", padding:0 }}>
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:10 }}>Confirm Password</label>
              <div style={{ position:"relative" }}>
                <Lock size={14} style={{ position:"absolute", right:15, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.25)" }} />
                <input type="password" required value={form.confirm} onChange={e=>setForm(p=>({...p,confirm:e.target.value}))}
                  placeholder="Repeat your password" className="input-field" style={{ paddingRight:42 }} />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width:"100%", justifyContent:"center", fontSize:14, padding:"15px 24px", marginTop:6 }}>
              {loading ? "Creating Account..." : <><span>Create Account</span><ArrowRight size={16}/></>}
            </button>
          </form>

          <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:24, lineHeight:1.7 }}>
            By creating an account you agree to our{" "}
            <Link href="/privacy" style={{ color:"rgba(255,255,255,0.45)", textDecoration:"underline" }}>Terms & Privacy Policy</Link>
          </p>
        </div>
      </div>

      <style>{`
        .auth-wrap { display:grid; grid-template-columns:1fr 1fr; min-height:100vh; }
        .auth-img-side { position:relative; overflow:hidden; min-height:600px; }
        @media(max-width:860px){ .auth-wrap{grid-template-columns:1fr} .auth-img-side{display:none} }
      `}</style>
    </div>
  );
}
