# 🔥 DROP ZERO - Streetwear Revolution

Site de e-commerce moderno e alternativo para venda de roupas streetwear com design cyberpunk/urbano.

## ✨ Funcionalidades Implementadas

### 🛍️ Sistema de Compras
- **Carrinho de Compras** - Adicionar, remover, alterar quantidade
- **Quick View** - Visualizar produtos sem sair da página
- **Seletor de Tamanhos** - Escolher tamanho antes de adicionar ao carrinho
- **Sistema de Cupons** - Aplicar descontos com códigos promocionais
- **Cálculo de Frete** - Frete grátis acima de R$ 300

### ❤️ Lista de Desejos (Wishlist)
- Salvar produtos favoritos
- Persistência em localStorage
- Adicionar ao carrinho direto da wishlist

### ⚖️ Comparador de Produtos
- Comparar até 3 produtos simultaneamente
- Painel fixo na parte inferior da tela
- Ver preços, avaliações e características lado a lado

### 🔍 Busca Inteligente
- Busca em tempo real
- Resultados aparecem enquanto você digita
- Busca por nome, categoria e descrição

### 🎨 Filtros Avançados
- **Por Categoria**: Camisetas, Cargo Pants, Sneakers, Hoodies, Acessórios
- **Por Preço**: Faixas de preço predefinidas
- **Ordenação**: Menor/maior preço, popularidade, avaliação, novidades
- **Modo de Visualização**: Grid ou Lista

### 🌓 Tema Claro/Escuro
- Alternar entre modo escuro e claro
- Preferência salva no localStorage
- Transições suaves

### ⚙️ Configurações
- Ativar/desativar animações
- Ativar/desativar cursor personalizado
- Ativar/desativar efeitos sonoros
- Resetar todas as configurações

### 🎯 UX/UI Features
- **Cursor Personalizado** - Cursor animado que segue o mouse
- **Notificações Toast** - Feedback visual para ações do usuário
- **Animações Suaves** - Transições e efeitos em todos os elementos
- **Header Dinâmico** - Muda ao fazer scroll
- **Efeitos Sonoros** - Sons sutis para interações (opcional)
- **Skeleton Loading** - Tela de carregamento inicial
- **Responsive Design** - Funciona perfeitamente em mobile

### 💾 Persistência de Dados
Todos os dados são salvos no localStorage:
- Carrinho de compras
- Lista de desejos
- Produtos para comparar
- Tema selecionado
- Configurações
- Cupom aplicado

## 🎮 Como Usar

### Navegação Básica
1. **Filtrar Produtos**: Clique nas categorias no topo
2. **Buscar**: Digite na barra de pesquisa
3. **Ver Detalhes**: Clique no produto ou no ícone de olho
4. **Adicionar ao Carrinho**: Selecione tamanho e clique em "Adicionar"

### Carrinho
- **Abrir**: Clique no ícone 🛒 no header
- **Alterar Quantidade**: Use os botões + e -
- **Remover Item**: Clique no ícone 🗑️
- **Aplicar Cupom**: Digite o código e clique em "Aplicar"
- **Finalizar**: Clique em "Finalizar Compra"

### Cupons Disponíveis
```
DROPZERO10  - 10% OFF (compras acima de R$ 100)
FIRST20     - 20% OFF (compras acima de R$ 200)
CYBER30     - 30% OFF (compras acima de R$ 300)
FREESHIP    - Frete Grátis
VIP50       - 50% OFF (compras acima de R$ 500)
```

### Wishlist (Favoritos)
- **Adicionar**: Clique no ícone ❤️ no card do produto
- **Ver Lista**: Clique no ícone ❤️ no header
- **Remover**: Clique novamente no ícone ❤️

### Comparar Produtos
- **Adicionar**: Clique no ícone ⚖️ no card do produto
- **Ver Comparação**: Painel abre automaticamente na parte inferior
- **Limpar**: Clique em "Limpar Comparação"
- **Máximo**: 3 produtos por vez

## 🎨 Customização

### Cores (CSS Variables)
Edite as variáveis no arquivo `styles.css`:
```css
:root {
    --neon: #ccff00;        /* Cor principal (neon)
    --electric: #00ffff;    /* Cor secundária (cyan)
    --bg: #0a0a0a;         /* Background escuro
    --card: #1a1a1a;       /* Cards
    --text: #ffffff;        /* Texto
}
```

### Produtos
Adicione/edite produtos no arquivo `data.js`:
```javascript
{
    id: 13,
    name: "Nome do Produto",
    category: "camisetas", // ou "calças", "tênis", "hoodies", "acessórios"
    price: 150,
    oldPrice: 200, // opcional (preço riscado)
    images: ["url1.jpg", "url2.jpg", "url3.jpg"],
    description: "Descrição do produto...",
    rating: 4.8,
    reviews: 100,
    tags: ["new", "sale", "trending", "limited"],
    sizes: ["P", "M", "G", "GG"],
    colors: ["black", "white"],
    inStock: true,
    popular: true
}
```

### Cupons
Adicione cupons no arquivo `data.js`:
```javascript
"CODIGO": {
    discount: 0.20,        // 20% de desconto
    minValue: 200,         // Valor mínimo de compra
    freeShipping: false,   // Frete grátis
    description: "20% OFF"
}
```

## 📱 Responsividade

O site é totalmente responsivo e funciona em:
- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1366px)
- ✅ Mobile (320px - 768px)

## 🚀 Melhorias Implementadas

Comparado com a versão original:

1. **+300% mais funcionalidades**
2. **Design mais ousado e profissional**
3. **Sistema completo de e-commerce**
4. **Animações fluidas e modernas**
5. **UX muito superior**
6. **Código organizado e escalável**
7. **Performance otimizada**
8. **Acessibilidade melhorada**

## 🎯 Destaques Visuais

- ✨ Cursor personalizado interativo
- 🌈 Gradientes vibrantes
- 💫 Animações parallax
- 🎭 Glassmorphism effects
- 🔊 Feedback sonoro (opcional)
- 📢 Toast notifications
- 🎨 Tema light/dark
- 🖼️ Galeria de imagens por produto

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Animações, gradientes, flexbox, grid
- **JavaScript ES6+** - Lógica e interatividade
- **LocalStorage** - Persistência de dados
- **Web Audio API** - Efeitos sonoros

## 📦 Estrutura de Arquivos

```
dropzero/
│
├── index.html      # Estrutura HTML principal
├── styles.css      # Todos os estilos CSS
├── script.js       # Lógica principal da aplicação
├── data.js         # Database de produtos e configurações
└── README.md       # Este arquivo
```

## 💡 Dicas de Uso

1. **Performance**: Desative animações em dispositivos lentos
2. **Privacidade**: Dados ficam salvos localmente no navegador
3. **Mobile**: Use gestos de swipe para navegar
4. **Keyboard**: ESC fecha modals, Tab navega pelos elementos
5. **Acessibilidade**: Todos os elementos são clicáveis e navegáveis

## 🎨 Paleta de Cores

```
Neon Verde:    #ccff00 (Destaque principal)
Cyan Elétrico: #00ffff (Destaque secundário)
Magenta:       #ff00ff (Acentos)
Laranja:       #ff6b00 (Acentos)
Preto:         #0a0a0a (Background)
Branco:        #ffffff (Texto)
```

## 🔮 Futuras Melhorias Possíveis

- [ ] Backend com Node.js
- [ ] Integração com gateway de pagamento
- [ ] Sistema de reviews/comentários
- [ ] Chat de suporte
- [ ] Integração com redes sociais
- [ ] Sistema de pontos/recompensas
- [ ] Recomendações personalizadas com IA
- [ ] Realidade aumentada para experimentar roupas

## 📞 Suporte

Para dúvidas ou sugestões sobre o código, sinta-se livre para modificar e adaptar às suas necessidades!

---

**Desenvolvido com 💚 para a geração streetwear**

*"Style is a way to say who you are without having to speak" - DROP ZERO*