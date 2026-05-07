"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import { Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm]       = useState({ email:"", password:"" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const isAdmin = await login(form.email, form.password);
      router.push(isAdmin ? "/admin" : "/");
    } catch (err: any) {
      setError(err?.data?.detail || err?.data?.non_field_errors?.[0] || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      {/* Image side */}
      <div className="auth-img-side">
        <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=90"
          alt="BLANKO Fashion" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center" }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(10,14,28,0.92) 0%,rgba(10,14,28,0.40) 100%)" }} />
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse at 30% 70%, rgba(245,158,11,0.12), transparent 60%)" }} />
        <div style={{ position:"absolute", bottom:56, left:48, right:48 }}>
          <p className="section-tag" style={{ marginBottom:14 }}>Welcome Back</p>
          <h2 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"3.2rem", fontWeight:800, color:"#ffffff", lineHeight:1.0, margin:"0 0 16px" }}>
            Your Style,<br /><span style={{ fontStyle:"italic", color:"#f59e0b" }}>Your Story.</span>
          </h2>
          <p style={{ fontSize:14, color:"rgba(255,255,255,0.48)", lineHeight:1.75 }}>
            Sign in and enjoy an exceptional shopping experience with BLANKO.
          </p>
        </div>
        {/* Floating badge */}
        <div style={{ position:"absolute", top:40, right:40, background:"rgba(245,158,11,0.15)", border:"1px solid rgba(245,158,11,0.3)", borderRadius:50, padding:"10px 20px", backdropFilter:"blur(8px)" }}>
          <span style={{ fontSize:12, fontWeight:700, color:"#fcd34d", letterSpacing:"0.16em" }}>BLANKO FASHION HOUSE</span>
        </div>
      </div>

      {/* Form side */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:"60px 36px", background:"#0f172a", minHeight:"100vh" }}>
        <div style={{ width:"100%", maxWidth:420 }}>
          {/* Logo */}
          <div style={{ marginBottom:40, textAlign:"center" }}>
            <Link href="/" style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"2rem", fontWeight:800, color:"#ffffff", textDecoration:"none", letterSpacing:"0.25em" }}>
              BLANKO
            </Link>
            <p style={{ fontSize:11, letterSpacing:"0.3em", color:"rgba(255,255,255,0.3)", marginTop:4, textTransform:"uppercase" }}>Fashion House</p>
          </div>

          <div style={{ marginBottom:36 }}>
            <h1 style={{ fontFamily:"var(--font-cormorant,Georgia,serif)", fontSize:"2.6rem", fontWeight:800, color:"#ffffff", margin:"0 0 10px", lineHeight:1 }}>Sign In</h1>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.45)", margin:0 }}>
              Don't have an account?{" "}
              <Link href="/register" style={{ color:"#f59e0b", fontWeight:700, textDecoration:"none" }}>Create one now</Link>
            </p>
          </div>

          {error && (
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 16px", background:"rgba(239,68,68,0.10)", border:"1px solid rgba(239,68,68,0.22)", borderRadius:10, marginBottom:20 }}>
              <AlertCircle size={15} style={{ color:"#f87171", flexShrink:0 }} />
              <p style={{ fontSize:13, color:"#f87171", margin:0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:18 }}>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:10 }}>Email Address</label>
              <div style={{ position:"relative" }}>
                <Mail size={15} style={{ position:"absolute", right:15, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.25)" }} />
                <input type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))}
                  placeholder="your@email.com" className="input-field" style={{ paddingRight:42 }} />
              </div>
            </div>
            <div>
              <label style={{ display:"block", fontSize:11, fontWeight:800, letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginBottom:10 }}>Password</label>
              <div style={{ position:"relative" }}>
                <Lock size={15} style={{ position:"absolute", right:15, top:"50%", transform:"translateY(-50%)", color:"rgba(255,255,255,0.25)" }} />
                <input type={showPwd?"text":"password"} required value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))}
                  placeholder="••••••••" className="input-field" style={{ paddingRight:42, paddingLeft:42 }} />
                <button type="button" onClick={()=>setShowPwd(v=>!v)}
                  style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,0.35)", padding:0 }}>
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-gold" style={{ width:"100%", justifyContent:"center", fontSize:14, padding:"15px 24px", marginTop:4 }}>
              {loading ? "Signing in..." : <><span>Sign In</span><ArrowRight size={16}/></>}
            </button>
          </form>

          <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", textAlign:"center", marginTop:28, lineHeight:1.7 }}>
            By signing in you agree to our{" "}
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
