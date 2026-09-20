"use client";

import { products as initialProducts, formatBRL } from "@/lib/catalog";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowUpRight, Bell, Boxes, ChevronRight, CircleDollarSign, Copy, Eye, GripVertical, LayoutDashboard, MoreHorizontal, PackageSearch, Plus, ReceiptText, Search, Shirt, Tag, TriangleAlert, UploadCloud, Users, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Section = "dashboard" | "products" | "orders" | "inventory" | "coupons" | "finance";
type AdminProduct = (typeof initialProducts)[number] & { active?: boolean };

const nav: Array<{ id: Section; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: "dashboard", label: "DASHBOARD", icon: LayoutDashboard }, { id: "products", label: "PRODUTOS", icon: Shirt }, { id: "orders", label: "PEDIDOS", icon: ReceiptText }, { id: "inventory", label: "ESTOQUE", icon: Boxes }, { id: "coupons", label: "CUPONS", icon: Tag }, { id: "finance", label: "FINANCEIRO", icon: CircleDollarSign },
];

const fakeOrders = [
  { number: "DZ-2026-02AF81", customer: "MARINA S.", total: 409.9, status: "PAGO", date: "21 FEV / 22:18" },
  { number: "DZ-2026-77BC90", customer: "LUCAS R.", total: 289, status: "PREPARANDO", date: "21 FEV / 19:42" },
  { number: "DZ-2026-9DD128", customer: "ANA V.", total: 205, status: "ENVIADO", date: "20 FEV / 16:03" },
  { number: "DZ-2026-3810AC", customer: "RAFAEL C.", total: 120, status: "PENDENTE", date: "20 FEV / 14:21" },
];

export function AdminDashboard() {
  const [section, setSection] = useState<Section>("dashboard");
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const toggleProduct = (id: string) => setProducts((current) => current.map((product) => product.id === id ? { ...product, active: product.active === false } : product));
  const duplicateProduct = (product: AdminProduct) => setProducts((current) => [...current, { ...product, id: `${product.id}-copy`, name: `${product.name} / COPY`, shortName: `${product.shortName} COPY`, sku: `${product.sku}-CP`, active: false }]);
  const deleteProduct = (id: string) => setProducts((current) => current.filter((product) => product.id !== id));

  const uploadFiles = async (files: FileList | File[]) => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) { setMessage("SUPABASE STORAGE AGUARDA CONFIGURAÇÃO."); return; }
    setMessage("ENVIANDO IMAGENS...");
    for (const file of Array.from(files)) {
      const path = `products/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
      if (error) { setMessage(error.message.toUpperCase()); return; }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setImages((current) => [...current, data.publicUrl]);
    }
    setMessage("UPLOAD CONCLUÍDO.");
  };

  const createProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: data.get("name"), sku: data.get("sku"), price: Number(data.get("price")), cost: Number(data.get("cost")), description: data.get("description"), category: data.get("category"), drop: data.get("drop"), tags: String(data.get("tags") || "").split(",").map((tag) => tag.trim()).filter(Boolean), images }) });
    const payload = await response.json() as { id?: string; error?: string };
    if (!response.ok) { setMessage(payload.error || "FALHA AO SALVAR PRODUTO."); return; }
    setMessage("PRODUTO GRAVADO NO CATÁLOGO."); setModalOpen(false); setImages([]);
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand"><Link href="/"><span>DROP</span><span>ZERO</span></Link><b>CONTROL</b></div>
        <nav>{nav.map((item, index) => <button className={section === item.id ? "active" : ""} onClick={() => setSection(item.id)} key={item.id}><i>0{index + 1}</i><item.icon /><span>{item.label}</span></button>)}</nav>
        <div className="admin-system"><span><i /> SYSTEM ONLINE</span><small>BUILD / 2.6.021</small><Link href="/">VER LOJA <ArrowUpRight /></Link></div>
      </aside>
      <main className="admin-main">
        <header className="admin-top"><div><span>DROPZERO / BACKOFFICE</span><strong>{section.toUpperCase()}</strong></div><div className="admin-top-actions"><button><Search /></button><button><Bell /><i /></button><div className="admin-user"><span>DZ</span><p>ADMIN / 001<small>ROOT ACCESS</small></p></div></div></header>
        {message && <div className="admin-message">{message}<button onClick={() => setMessage("")}><X /></button></div>}
        {section === "dashboard" && <DashboardHome setSection={setSection} />}
        {section === "products" && <ProductsAdmin products={products} setModalOpen={setModalOpen} toggleProduct={toggleProduct} duplicateProduct={duplicateProduct} deleteProduct={deleteProduct} />}
        {section === "orders" && <OrdersAdmin />}
        {section === "inventory" && <InventoryAdmin products={products} />}
        {section === "coupons" && <CouponsAdmin />}
        {section === "finance" && <FinanceAdmin />}
      </main>
      {modalOpen && <div className="admin-modal-backdrop"><div className="admin-modal"><header><div><span>NEW RECORD / PRODUCT</span><strong>ADICIONAR PEÇA</strong></div><button onClick={() => setModalOpen(false)}><X /></button></header><form onSubmit={createProduct}><div className="admin-form-grid"><label className="wide"><span>NOME</span><input name="name" required /></label><label><span>PREÇO / R$</span><input name="price" type="number" step=".01" required /></label><label><span>CUSTO / R$</span><input name="cost" type="number" step=".01" /></label><label><span>SKU</span><input name="sku" required /></label><label><span>CATEGORIA</span><select name="category"><option>CAMISETAS</option><option>HOODIES</option><option>CALÇAS</option><option>JAQUETAS</option><option>ACESSÓRIOS</option></select></label><label><span>DROP</span><select name="drop"><option>NO SIGNAL</option><option>STREET DAMAGE</option><option>AFTER DARK</option></select></label><label><span>TAGS / VÍRGULAS</span><input name="tags" placeholder="limited, new" /></label><label className="wide"><span>DESCRIÇÃO</span><textarea name="description" rows={4} required /></label></div><div className="admin-upload" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void uploadFiles(event.dataTransfer.files); }}><UploadCloud /><strong>ARRASTE IMAGENS AQUI</strong><span>OU SELECIONE ARQUIVOS / JPG, PNG, WEBP</span><input type="file" accept="image/*" multiple onChange={(event) => event.target.files && void uploadFiles(event.target.files)} /></div>{images.length > 0 && <div className="uploaded-images">{images.map((image, index) => <div key={image}><GripVertical /><img src={image} alt="" /><span>{index === 0 ? "PRINCIPAL" : `IMG 0${index + 1}`}</span><button type="button" onClick={() => setImages((current) => current.filter((item) => item !== image))}><X /></button></div>)}</div>}<button className="admin-save">SALVAR PRODUTO <ArrowUpRight /></button></form></div></div>}
    </div>
  );
}

function DashboardHome({ setSection }: { setSection: (section: Section) => void }) {
  const metrics = [{ label: "FATURAMENTO", value: "R$ 48.920", delta: "+18,4%", code: "BRUTO / MÊS" }, { label: "PEDIDOS", value: "184", delta: "+12,1%", code: "ORDER / MÊS" }, { label: "TICKET MÉDIO", value: "R$ 265,87", delta: "+3,2%", code: "AVG / ORDER" }, { label: "CLIENTES", value: "1.248", delta: "+27,8%", code: "ACTIVE / TOTAL" }];
  const bars = [34, 48, 42, 66, 54, 72, 58, 83, 69, 91, 77, 96, 85, 108];
  return <div className="admin-content"><div className="admin-page-head"><div><span>OVERVIEW / 21.02.26 — 22:17</span><h1>O CORRE<br />EM NÚMEROS.</h1></div><select><option>ÚLTIMOS 30 DIAS</option><option>7 DIAS</option><option>12 MESES</option></select></div><section className="metric-grid">{metrics.map((metric, index) => <article key={metric.label}><div><span>0{index + 1} / {metric.label}</span><small>{metric.code}</small></div><strong>{metric.value}</strong><b>{metric.delta}</b></article>)}</section><section className="admin-dashboard-grid"><article className="revenue-chart"><header><div><span>FATURAMENTO / DAILY TRACK</span><strong>R$ 18.432,00</strong></div><small>01—21 FEV</small></header><div className="chart-area"><div className="chart-y"><span>4K</span><span>3K</span><span>2K</span><span>1K</span><span>0</span></div><div className="chart-bars">{bars.map((height, index) => <i style={{ height }} key={index}><b>{index + 7}</b></i>)}</div></div></article><article className="low-stock"><header><span>ALERTA / ESTOQUE BAIXO</span><TriangleAlert /></header><strong>05</strong><p>VARIANTES PRECISAM DE ATENÇÃO</p>{initialProducts.filter((product) => product.stock < 10).slice(0,3).map((product) => <div key={product.id}><span>{product.sku}</span><b>{product.stock === 0 ? "ESGOTADO" : `${product.stock} UN.`}</b></div>)}<button onClick={() => setSection("inventory")}>ABRIR ESTOQUE <ChevronRight /></button></article></section><section className="recent-orders"><header><div><span>LIVE / PEDIDOS RECENTES</span><strong>ÚLTIMAS MOVIMENTAÇÕES</strong></div><button onClick={() => setSection("orders")}>VER TODOS <ArrowUpRight /></button></header><div className="admin-table"><div className="table-head"><span>PEDIDO</span><span>CLIENTE</span><span>DATA</span><span>STATUS</span><span>TOTAL</span><span /></div>{fakeOrders.map((order) => <div className="table-row" key={order.number}><b>{order.number}</b><span>{order.customer}</span><span>{order.date}</span><i className={`status-${order.status.toLowerCase()}`}>{order.status}</i><strong>{formatBRL(order.total)}</strong><button><MoreHorizontal /></button></div>)}</div></section></div>;
}

function ProductsAdmin({ products, setModalOpen, toggleProduct, duplicateProduct, deleteProduct }: { products: AdminProduct[]; setModalOpen: (open: boolean) => void; toggleProduct: (id:string) => void; duplicateProduct: (product:AdminProduct) => void; deleteProduct:(id:string) => void }) {
  return <div className="admin-content"><div className="admin-page-head compact"><div><span>CATALOG / {String(products.length).padStart(3,"0")} RECORDS</span><h1>PRODUTOS.</h1></div><button className="admin-primary" onClick={() => setModalOpen(true)}><Plus /> ADICIONAR PRODUTO</button></div><div className="admin-filterbar"><div><Search /><input placeholder="BUSCAR NOME, SKU OU DROP" /></div><button>FILTROS / 00</button><button>EXPORTAR CSV</button></div><div className="products-admin-table"><div className="pat-head"><span>PRODUTO</span><span>SKU / DROP</span><span>PREÇO</span><span>ESTOQUE</span><span>STATUS</span><span>AÇÕES</span></div>{products.map((product) => <div className="pat-row" key={product.id}><div><img src={product.images[0]} alt="" /><span><b>{product.shortName}</b><small>{product.categoryLabel}</small></span></div><span><b>{product.sku}</b><small>{product.drop}</small></span><strong>{formatBRL(product.price)}</strong><i className={product.stock === 0 ? "out" : product.stock < 6 ? "low" : "ok"}>{product.stock === 0 ? "ESGOTADO" : `${product.stock} UN.`}</i><button className={`status-toggle ${product.active === false ? "off" : ""}`} onClick={() => toggleProduct(product.id)}><i />{product.active === false ? "INATIVO" : "ATIVO"}</button><div className="row-actions"><Link href={`/produto/${product.slug}`}><Eye /></Link><button onClick={() => duplicateProduct(product)}><Copy /></button><button onClick={() => deleteProduct(product.id)}><X /></button></div></div>)}</div></div>;
}

function OrdersAdmin() { return <div className="admin-content"><div className="admin-page-head compact"><div><span>ORDERS / OPERATION</span><h1>PEDIDOS.</h1></div><button className="admin-primary">EXPORTAR LISTA</button></div><div className="order-kanban">{["PAGAMENTO PENDENTE","PAGO","PREPARANDO","ENVIADO","ENTREGUE"].map((status,index) => <div className={`order-stage stage-${index}`} key={status}><header><span>0{index+1}</span><strong>{status}</strong><b>{index === 0 ? 1 : index === 1 ? 1 : index === 2 ? 1 : index === 3 ? 1 : 0}</b></header>{fakeOrders.filter((_, orderIndex) => orderIndex === [3,0,1,2,-1][index]).map((order) => <article key={order.number}><small>{order.date}</small><strong>{order.number}</strong><span>{order.customer}</span><b>{formatBRL(order.total)}</b><button>ABRIR PEDIDO <ArrowUpRight /></button></article>)}</div>)}</div></div>; }
function InventoryAdmin({ products }: { products: AdminProduct[] }) { return <div className="admin-content"><div className="admin-page-head compact"><div><span>INVENTORY / LIVE</span><h1>ESTOQUE.</h1></div><button className="admin-primary"><Plus /> AJUSTE MANUAL</button></div><div className="inventory-summary"><article><span>DISPONÍVEL</span><strong>{products.reduce((sum,p)=>sum+p.stock,0)}</strong></article><article><span>BAIXO</span><strong>{products.filter(p=>p.stock>0&&p.stock<8).length}</strong></article><article><span>ESGOTADO</span><strong>{products.filter(p=>p.stock===0).length}</strong></article></div><div className="stock-list">{products.map((product) => <div key={product.id}><img src={product.images[0]} alt="" /><span><b>{product.shortName}</b><small>{product.sku} / VARIANTES {product.sizes.length * product.colors.length}</small></span><div className="stock-meter"><i style={{width:`${Math.min(100,product.stock*4)}%`}} /></div><strong className={product.stock===0?"out":product.stock<8?"low":"ok"}>{product.stock===0?"ESGOTADO":product.stock<8?"BAIXO":"DISPONÍVEL"}<small>{product.stock} UNIDADES</small></strong><button><MoreHorizontal /></button></div>)}</div></div>; }
function CouponsAdmin() { return <div className="admin-content"><div className="admin-page-head compact"><div><span>DISCOUNTS / RULES</span><h1>CUPONS.</h1></div><button className="admin-primary"><Plus /> CRIAR CUPOM</button></div><div className="coupon-admin-grid">{[{code:"DROPZERO10",value:"10% OFF",use:"184 / 500",valid:"30.06.26",active:true},{code:"FIRST20",value:"20% OFF",use:"092 / 200",valid:"28.02.26",active:true},{code:"FREESHIP",value:"FRETE GRÁTIS",use:"311 / ∞",valid:"SEM LIMITE",active:false}].map(coupon=><article key={coupon.code}><span className={coupon.active?"active":"inactive"}>{coupon.active?"ATIVO":"INATIVO"}</span><strong>{coupon.code}</strong><h3>{coupon.value}</h3><div><span>USO <b>{coupon.use}</b></span><span>VALIDADE <b>{coupon.valid}</b></span></div><button>EDITAR REGRAS <ArrowUpRight /></button></article>)}</div></div>; }
function FinanceAdmin() { const rows=[{label:"FATURAMENTO BRUTO",value:48920},{label:"DESCONTOS",value:-3424},{label:"FRETE",value:2780},{label:"REEMBOLSOS",value:-1289},{label:"VENDAS LÍQUIDAS",value:46987}]; return <div className="admin-content"><div className="admin-page-head compact"><div><span>FINANCE / FEB 2026</span><h1>FINANCEIRO.</h1></div><select><option>FEVEREIRO 2026</option></select></div><div className="finance-hero"><div><span>VENDAS LÍQUIDAS</span><strong>R$ 46.987,00</strong><p>+14,8% CONTRA O PERÍODO ANTERIOR</p></div><CircleDollarSign /></div><div className="finance-ledger">{rows.map((row,index)=><div key={row.label}><span>0{index+1}</span><strong>{row.label}</strong><b className={row.value<0?"negative":""}>{formatBRL(row.value)}</b></div>)}</div></div>; }
