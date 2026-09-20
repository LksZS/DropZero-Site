import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { SiteFooter } from "@/components/site-footer";
import { categoryData, drops, products } from "@/lib/catalog";
import { ArrowDown, ArrowRight, ArrowUpRight, Asterisk, Crosshair, MoveRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main>
      <div className="signal-bar" aria-label="Avisos da loja">
        <div className="signal-track">
          <span>NOVO DROP / AFTER DARK</span><i>◆</i><span>FRETE GRÁTIS ACIMA DE R$ 300</span><i>◆</i><span>EDIÇÃO LIMITADA / SEM RESTOCK</span><i>◆</i><span>NOVO DROP / AFTER DARK</span><i>◆</i><span>FRETE GRÁTIS ACIMA DE R$ 300</span><i>◆</i><span>EDIÇÃO LIMITADA / SEM RESTOCK</span>
        </div>
      </div>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-concrete" />
        <div className="hero-photo-frame">
          <img src="https://images.pexels.com/photos/35855468/pexels-photo-35855468.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1600" alt="Modelo DropZero em escadaria urbana coberta por graffiti" />
          <div className="photo-halftone" />
          <span className="photo-credit">CAMPAIGN 003 / SP-021</span>
        </div>
        <div className="hero-copy">
          <span className="hero-kicker">NEW DROP / 003</span>
          <h1 id="hero-title"><span>DROP</span><span>ZERO</span></h1>
          <div className="hero-drop-name"><i>“</i>AFTER DARK<i>”</i></div>
        </div>
        <div className="hero-side-copy">INDEPENDENT STREETWEAR / SÃO PAULO / EST. MMXXIV</div>
        <div className="hero-tape tape-one">LIMITED ISSUE / 006 PIECES</div>
        <div className="hero-sticker sticker-round"><span>DZ</span><small>AUTHENTIC<br />STREET GOODS</small></div>
        <div className="hero-sticker sticker-note">SEM<br />PERMISSÃO</div>
        <div className="hero-cross"><Crosshair /><span>23°33&apos;01.4&quot;S<br />46°38&apos;02.5&quot;W</span></div>
        <Link href="/shop" className="hero-cta"><span>VER O DROP</span><ArrowUpRight /></Link>
        <div className="scroll-mark"><span>SCROLL PRA BAIXO</span><ArrowDown /></div>
      </section>

      <section className="statement-band" aria-label="Manifesto curto">
        <div className="statement-track"><span>NÃO É SÓ ROUPA</span><Asterisk /><span>É CÓDIGO DE RUA</span><Asterisk /><span>NÃO É SÓ ROUPA</span><Asterisk /><span>É CÓDIGO DE RUA</span></div>
      </section>

      <section className="new-arrivals" id="shop">
        <div className="section-head ink-head">
          <div><span className="section-number">01 / SHOP</span><p>ARQUIVO ATUALIZADO<br />21.02.26 — 22:17</p></div>
          <Reveal><h2>CHEGOU<br /><em>AGORA.</em></h2></Reveal>
          <div className="section-note"><span>PEÇAS SELECIONADAS</span><p>Produção curta. Construção pesada. Quando acaba, vira arquivo.</p><Link href="/shop">VER TUDO <ArrowUpRight /></Link></div>
        </div>
        <div className="product-wall">
          <div className="wall-tag">DZ / CURATED 004</div>
          {products.slice(0, 4).map((product, index) => <Reveal key={product.id} delay={index * 70}><ProductCard product={product} index={index} /></Reveal>)}
        </div>
        <div className="wall-footer"><span>[ DROPZERO® INDEPENDENT GOODS ]</span><span>04 / 08 ITEMS ON DISPLAY</span><span>NO RESTOCK GUARANTEED</span></div>
      </section>

      <section className="categories-section" id="categorias">
        <div className="category-title-row">
          <span>02 / CATEGORIAS</span>
          <h2>ESCOLHA<br />SEU LADO</h2>
          <p>INDEX / TODAS AS PEÇAS<br />ORGANIZADAS POR TIPO</p>
        </div>
        <div className="category-index">
          {categoryData.map((category, index) => (
            <Link href={category.slug === "drops" ? "/#drops" : `/shop?categoria=${category.slug}`} className="category-line" key={category.slug}>
              <span className="category-num">0{index + 1}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">[{category.count}]</span>
              <span className="category-preview"><img src={category.image} alt="" /></span>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
        <div className="category-scribble">sem gênero / sem regra</div>
      </section>

      <section className="campaign-break">
        <div className="campaign-image"><img src="https://images.pexels.com/photos/10130522/pexels-photo-10130522.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1800" alt="Campanha DropZero com skatistas em pista urbana" /></div>
        <div className="campaign-black-block"><span>STREET STUDY / 025</span><strong>O ASFALTO<br />NÃO PERDOA.</strong><p>NÓS TAMBÉM NÃO.</p></div>
        <div className="campaign-label"><span>SHOT ON LOCATION</span><span>SP / BR 021</span></div>
        <div className="campaign-stamp">DROP<br />ZERO</div>
      </section>

      <section className="drops-section" id="drops">
        <div className="drops-heading">
          <div><span>03 / ARCHIVE</span><p>COLEÇÕES NUMERADAS<br />DESDE MMXXIV</p></div>
          <Reveal><h2>DROP<br /><span>FILES</span></h2></Reveal>
          <div className="drops-intro">Cada coleção registra uma fase da rua. Poucas peças, uma campanha, nenhum retorno.</div>
        </div>
        <div className="drops-grid">
          {drops.map((drop, index) => (
            <article className={`drop-poster poster-${index + 1}`} key={drop.code}>
              <img src={drop.image} alt={`Campanha ${drop.name}`} />
              <div className="drop-poster-noise" />
              <span className="drop-date">{drop.date}</span>
              <div className="drop-poster-copy"><small>DROP</small><strong>{drop.code}</strong><h3>{drop.name}</h3></div>
              <div className="drop-poster-foot"><span>{drop.pieces}</span><span>LIMITED RELEASE</span><MoveRight /></div>
            </article>
          ))}
        </div>
        <Link href="/shop" className="archive-link">ACESSAR ARQUIVO COMPLETO <ArrowRight /></Link>
      </section>

      <section className="manifesto-section" id="manifesto">
        <div className="manifesto-mark">DZ<br />MANIFEST</div>
        <span className="manifesto-index">04 / SOBRE NÓS</span>
        <Reveal><h2>A RUA NÃO<br />PEDE <span>LICENÇA.</span></h2></Reveal>
        <div className="manifesto-copy">
          <p>A DROPZERO NÃO NASCEU EM SALA DE REUNIÃO. NASCEU DO BARULHO DO SHAPE, DO MURO REPINTADO E DA ROUPA QUE CARREGA HISTÓRIA.</p>
          <p>FAZEMOS PEÇAS PARA QUEM OCUPA ESPAÇO SEM PEDIR DESCULPA. SEM TEMPORADA. SEM MANUAL. SEM PERMISSÃO.</p>
          <Link href="/shop">VESTIR A IDEIA <ArrowUpRight /></Link>
        </div>
        <div className="manifesto-sign">feito fora da linha</div>
        <div className="manifesto-code">DZ–MMXXVI<br />ISSUE / 003<br />SÃO PAULO</div>
      </section>

      <SiteFooter />
    </main>
  );
}
