"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, Eye, EyeOff, KeyRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

export function AuthPanel() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    if (!supabase) return;
    void supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  const requireClient = () => {
    if (supabase) return true;
    setMessage("AUTENTICAÇÃO AGUARDANDO AS VARIÁVEIS DO SUPABASE.");
    return false;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!requireClient() || !supabase) return;
    setLoading(true); setMessage("");
    if (mode === "reset") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/account` });
      setMessage(error ? error.message.toUpperCase() : "LINK DE RECUPERAÇÃO ENVIADO. CONFIRA SEU E-MAIL.");
    } else if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password, options: { data: { name }, emailRedirectTo: `${window.location.origin}/auth/callback` } });
      setMessage(error ? error.message.toUpperCase() : "CONTA CRIADA. CONFIRME SEU E-MAIL PARA ENTRAR.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setMessage(error ? "E-MAIL OU SENHA INVÁLIDOS." : "ACESSO LIBERADO.");
    }
    setLoading(false);
  };

  const googleLogin = async () => {
    if (!requireClient() || !supabase) return;
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/auth/callback?next=/account` } });
  };

  if (user) return (
    <div className="account-dashboard">
      <div className="account-id"><span>IDENTIDADE / AUTENTICADA</span><div className="account-avatar">{(user.user_metadata?.name?.[0] || user.email?.[0] || "D").toUpperCase()}</div><h2>SALVE,<br />{(user.user_metadata?.name || user.email?.split("@")[0] || "MEMBRO").toUpperCase()}.</h2><p>{user.email}</p></div>
      <div className="account-sections"><article><span>01 / PEDIDOS</span><strong>ZERO PEDIDOS</strong><p>Quando o primeiro pedido entrar, a timeline aparece aqui.</p></article><article><span>02 / FAVORITOS</span><strong>SEU ARQUIVO</strong><p>Peças marcadas serão sincronizadas com sua identidade.</p></article><article><span>03 / ENDEREÇOS</span><strong>BASE DE ENTREGA</strong><p>Adicione e gerencie seus endereços de forma segura.</p></article></div>
      <button className="logout-button" onClick={async () => { if (supabase) await supabase.auth.signOut(); setUser(null); }}><LogOut /> SAIR DA CONTA</button>
    </div>
  );

  return (
    <div className="auth-layout">
      <div className="auth-poster"><div className="auth-poster-copy"><span>DZ / MEMBERS ONLY</span><strong>NÃO É<br />CLIENTE.<br /><i>É PARTE.</i></strong><p>ACESSO A PEDIDOS, FAVORITOS E DROPS ANTES DO BARULHO.</p></div><div className="auth-stamp">ZERO<br />CLUB</div></div>
      <div className="auth-form-wrap">
        <div className="auth-tabs"><button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>ENTRAR</button><button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>CRIAR CONTA</button></div>
        <span className="eyebrow dark">{mode === "reset" ? "RECUPERAR / ACESSO" : "IDENTIFICAÇÃO / DZ-ID"}</span>
        <h1>{mode === "login" ? "VOLTA PRO CORRE." : mode === "signup" ? "ENTRA PRA LISTA." : "REFAÇA A CHAVE."}</h1>
        <form onSubmit={submit}>
          {mode === "signup" && <label><span>NOME / APELIDO</span><input value={name} onChange={(event) => setName(event.target.value)} required placeholder="COMO A GENTE TE CHAMA" /></label>}
          <label><span>E-MAIL</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="VOCE@EMAIL.COM" /></label>
          {mode !== "reset" && <label><span>SENHA</span><div className="password-field"><input type={showPassword ? "text" : "password"} minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="MÍNIMO 6 CARACTERES" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Mostrar senha">{showPassword ? <EyeOff /> : <Eye />}</button></div></label>}
          {mode === "login" && <button type="button" className="forgot-button" onClick={() => setMode("reset")}>ESQUECI A SENHA</button>}
          <button className="auth-submit" disabled={loading}>{loading ? "PROCESSANDO..." : mode === "login" ? "ENTRAR" : mode === "signup" ? "CRIAR DZ-ID" : "ENVIAR LINK"}<ArrowRight /></button>
        </form>
        {message && <p className="auth-message">{message}</p>}
        {mode !== "reset" && <><div className="auth-divider"><span>OU</span></div><button className="google-button" onClick={googleLogin}><KeyRound /> CONTINUAR COM GOOGLE</button></>}
        {mode === "reset" && <button className="back-login" onClick={() => setMode("login")}>VOLTAR PARA O LOGIN</button>}
        <p className="auth-terms">AO CONTINUAR, VOCÊ ACEITA OS TERMOS E A POLÍTICA DE PRIVACIDADE DROPZERO.</p>
      </div>
    </div>
  );
}
