export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: string;
  categoryLabel: string;
  price: number;
  oldPrice?: number;
  sku: string;
  drop: string;
  dropName: string;
  images: [string, string, ...string[]];
  description: string;
  composition: string;
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviews: number;
  limited?: boolean;
};

export const products: CatalogProduct[] = [
  {
    id: "01",
    slug: "tee-void-black-edition",
    name: "Tee ‘VOID’ Black Edition",
    shortName: "TEE VOID 001",
    category: "camisetas",
    categoryLabel: "CAMISETAS",
    price: 120,
    sku: "DZ-NS-TEE-001",
    drop: "DROP 001",
    dropName: "NO SIGNAL",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=88",
    ],
    description: "Camiseta oversized em algodão pesado com estampa de alta densidade. Feita para ganhar marcas, não para ficar intacta.",
    composition: "100% algodão, 240 g/m². Malha penteada. Estampa silk à base d’água.",
    sizes: ["P", "M", "G", "GG"],
    colors: ["PRETO", "OFF-WHITE"],
    stock: 14,
    rating: 4.8,
    reviews: 127,
    limited: true,
  },
  {
    id: "02",
    slug: "cargo-damage-tactical",
    name: "Cargo ‘DAMAGE’ Tactical",
    shortName: "CARGO DAMAGE 002",
    category: "calcas",
    categoryLabel: "CALÇAS",
    price: 250,
    oldPrice: 320,
    sku: "DZ-SD-CRG-002",
    drop: "DROP 002",
    dropName: "STREET DAMAGE",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?auto=format&fit=crop&w=1200&q=88",
    ],
    description: "Cargo utilitária de corte amplo, bolsos modulares e acabamento lavado. Construída para o concreto.",
    composition: "Sarja 100% algodão, 320 g/m². Ferragens niqueladas e lavagem industrial.",
    sizes: ["38", "40", "42", "44"],
    colors: ["ASFALTO", "OLIVA"],
    stock: 7,
    rating: 4.9,
    reviews: 203,
  },
  {
    id: "03",
    slug: "hoodie-after-dark",
    name: "Hoodie ‘AFTER DARK’",
    shortName: "HOODIE DARK 003",
    category: "hoodies",
    categoryLabel: "HOODIES",
    price: 289,
    sku: "DZ-AD-HOD-003",
    drop: "DROP 003",
    dropName: "AFTER DARK",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=1200&q=88",
    ],
    description: "Moletom boxy com capuz duplo e aplicação frontal rachada. Volume alto, toque seco e presença pesada.",
    composition: "Moletom 3 cabos, 50% algodão e 50% poliéster, 420 g/m².",
    sizes: ["P", "M", "G", "GG"],
    colors: ["CARVÃO", "CIMENTO"],
    stock: 4,
    rating: 4.7,
    reviews: 156,
    limited: true,
  },
  {
    id: "04",
    slug: "bomber-apex",
    name: "Bomber ‘APEX’",
    shortName: "BOMBER APEX 004",
    category: "jaquetas",
    categoryLabel: "JAQUETAS",
    price: 380,
    sku: "DZ-SD-JKT-004",
    drop: "DROP 002",
    dropName: "STREET DAMAGE",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=88",
    ],
    description: "Jaqueta bomber resistente à água, com forro térmico e bolsos internos. Silhueta ampla, acabamento fosco.",
    composition: "Nylon técnico, forro reciclado e ribana reforçada.",
    sizes: ["M", "G", "GG"],
    colors: ["PRETO"],
    stock: 0,
    rating: 4.9,
    reviews: 67,
  },
  {
    id: "05",
    slug: "tee-urban-chaos",
    name: "Tee ‘URBAN CHAOS’",
    shortName: "TEE CHAOS 005",
    category: "camisetas",
    categoryLabel: "CAMISETAS",
    price: 110,
    oldPrice: 140,
    sku: "DZ-NS-TEE-005",
    drop: "DROP 001",
    dropName: "NO SIGNAL",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1618354691229-88d47f285158?auto=format&fit=crop&w=1200&q=88",
    ],
    description: "Camiseta off-white com arte de arquivo xerocada. Corte reto e gola espessa para uso diário.",
    composition: "100% algodão certificado, 220 g/m².",
    sizes: ["P", "M", "G", "GG", "XG"],
    colors: ["PAPEL", "PRETO"],
    stock: 21,
    rating: 4.5,
    reviews: 92,
  },
  {
    id: "06",
    slug: "chain-industrial",
    name: "Chain ‘INDUSTRIAL’",
    shortName: "CHAIN METAL 006",
    category: "acessorios",
    categoryLabel: "ACESSÓRIOS",
    price: 85,
    sku: "DZ-SD-ACC-006",
    drop: "DROP 002",
    dropName: "STREET DAMAGE",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1611652022419-a9419f74343a?auto=format&fit=crop&w=1200&q=88",
    ],
    description: "Corrente de elos robustos em aço inoxidável. Ajuste por mosquetão e assinatura gravada.",
    composition: "Aço inox 316L. Comprimento ajustável entre 45 e 55 cm.",
    sizes: ["ÚNICO"],
    colors: ["AÇO"],
    stock: 32,
    rating: 4.6,
    reviews: 134,
  },
  {
    id: "07",
    slug: "jogger-comfort-asphalt",
    name: "Jogger ‘ASPHALT’",
    shortName: "JOGGER ASPHALT 007",
    category: "calcas",
    categoryLabel: "CALÇAS",
    price: 180,
    oldPrice: 220,
    sku: "DZ-AD-JOG-007",
    drop: "DROP 003",
    dropName: "AFTER DARK",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=88",
    ],
    description: "Jogger pesada com joelho articulado e cintura ajustável. Conforto de moletom, leitura de uniforme.",
    composition: "Moletom felpado 360 g/m², cordão chato e ilhoses metálicos.",
    sizes: ["P", "M", "G", "GG"],
    colors: ["PRETO", "MESCLA"],
    stock: 9,
    rating: 4.8,
    reviews: 178,
  },
  {
    id: "08",
    slug: "beanie-arctic",
    name: "Beanie ‘ARCTIC’",
    shortName: "BEANIE ARCTIC 008",
    category: "acessorios",
    categoryLabel: "ACESSÓRIOS",
    price: 65,
    sku: "DZ-AD-BNE-008",
    drop: "DROP 003",
    dropName: "AFTER DARK",
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?auto=format&fit=crop&w=1200&q=88",
      "https://images.unsplash.com/photo-1519709042477-8de6eaf1fdc5?auto=format&fit=crop&w=1200&q=88",
    ],
    description: "Gorro canelado de dobra alta com etiqueta tecida externa. Sem estação, sem gênero.",
    composition: "Lã acrílica premium antialérgica.",
    sizes: ["ÚNICO"],
    colors: ["PRETO", "CIMENTO"],
    stock: 18,
    rating: 4.4,
    reviews: 211,
  },
];

export const categoryData = [
  { name: "CAMISETAS", slug: "camisetas", count: "02", image: products[0].images[0] },
  { name: "HOODIES", slug: "hoodies", count: "01", image: products[2].images[0] },
  { name: "CALÇAS", slug: "calcas", count: "02", image: products[1].images[0] },
  { name: "JAQUETAS", slug: "jaquetas", count: "01", image: products[3].images[0] },
  { name: "ACESSÓRIOS", slug: "acessorios", count: "02", image: products[5].images[0] },
  { name: "DROPS", slug: "drops", count: "03", image: "https://images.pexels.com/photos/35855468/pexels-photo-35855468.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200" },
];

export const drops = [
  { code: "001", name: "NO SIGNAL", date: "12.04.25", pieces: "07 PEÇAS", image: "https://images.pexels.com/photos/15267842/pexels-photo-15267842.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200" },
  { code: "002", name: "STREET DAMAGE", date: "28.08.25", pieces: "09 PEÇAS", image: "https://images.pexels.com/photos/35855468/pexels-photo-35855468.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200" },
  { code: "003", name: "AFTER DARK", date: "21.02.26", pieces: "06 PEÇAS", image: "https://images.pexels.com/photos/31016833/pexels-photo-31016833.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=1200" },
];

export const formatBRL = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}
