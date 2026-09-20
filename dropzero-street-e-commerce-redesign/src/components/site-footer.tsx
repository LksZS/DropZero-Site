import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-noise" />
      <div className="footer-newsletter">
        <span className="eyebrow">TRANSMISSÃO PRIVADA / DZ-MAIL</span>
        <h2>ENTRE NA<br />LISTA.</h2>
        <p>Drops limitados. Endereços secretos. Sem spam corporativo.</p>
        <form><input type="email" placeholder="SEU E-MAIL AQUI" aria-label="Seu e-mail" required /><button type="submit" aria-label="Assinar newsletter"><ArrowUpRight /></button></form>
      </div>
      <div className="footer-wordmark" aria-hidden="true">DROPZERO</div>
      <div className="footer-grid">
        <div><span>MAPA / 01</span><Link href="/shop">SHOP</Link><Link href="/#drops">DROPS</Link><Link href="/#manifesto">MANIFESTO</Link></div>
        <div><span>SUPORTE / 02</span><Link href="/account">MINHA CONTA</Link><a href="mailto:salve@dropzero.com.br">CONTATO</a><Link href="/checkout">ENTREGAS</Link></div>
        <div><span>REDE / 03</span><a href="#">INSTAGRAM</a><a href="#">TIKTOK</a><a href="#">PINTEREST</a></div>
        <div className="footer-address"><span>BASE / SP</span><p>SÃO PAULO, BRASIL<br />23°33&apos;01.4&quot;S<br />46°38&apos;02.5&quot;W</p></div>
      </div>
      <div className="footer-legal"><span>© 2026 DROPZERO</span><span>CNPJ 00.000.000/0001-00</span><Link href="#">PRIVACIDADE</Link><span>FEITO FORA DA LINHA</span></div>
    </footer>
  );
}
