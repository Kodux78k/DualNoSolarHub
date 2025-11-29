# Design System Hub1 – v1

Este documento compila os principais tokens, classes e convenções usadas nos aplicativos do ecossistema **Hub1/BlueCup** (por exemplo, Hub Solar, Dual Infodose, Livro Vivo).  Ele serve como guia rápido para reutilizar componentes existentes e para criar novos apps de maneira consistente.

## 1. Fundamentos

### 1.1 Tokens globais (`:root`)

No topo do CSS há um conjunto de variáveis que definem cores, raios de borda, sombras e espaçamentos.  Esses tokens são a base visual e devem ser reutilizados em qualquer novo componente.

- **Cores de fundo**: `--bg-day`, `--bg-sunset`, `--bg-night` controlam gradientes para manhã, pôr‑do‑sol e noite.
- **Cores base e texto**: `--panel`, `--panel-soft` definem a cor dos painéis; `--ink`, `--muted` controlam as cores de texto principal e texto suavizado.
- **Acentos**: `--accent`, `--accent-soft` (tema Nebula) e `--madeira`, `--madeira-soft` (tema Madeira) são usados para destaques e pills.
- **Raios**: `--radius-card` e `--radius-pill` definem cantos arredondados para cards e pills.
- **Espaçamentos**: `--safe-b` usa `env(safe-area-inset-bottom)` para lidar com áreas seguras no iOS; `--tap` define altura mínima para toques.

Sempre que criar um novo componente, procure reutilizar esses tokens ao invés de inventar cores ou valores novos.

### 1.2 Temas via `body[data-theme]`

O atributo `data-theme` no `<body>` seleciona o tema ativo:

- `data-theme="nebula"`: acentos azuis/violetas com gradientes futuristas.
- `data-theme="madeira"`: troca acentos por tons quentes (laranja, creme) e altera o estilo das pills.

Para alternar temas, basta alterar o atributo `data-theme` no `<body>` e ajustar as classes `.active` nas chips de seleção.

### 1.3 Humor (mood) via `body[data-mood]`

O atributo `data-mood` (valores `manha`, `tarde` ou `noite`) ajusta o gradiente de fundo e textos dinâmicos como a saudação (`#heroGreeting`) e o subtítulo (`#heroSubtitle`).  Um slider (`#timeRange`) controla esse atributo em tempo real.

## 2. Estrutura base

### 2.1 HTML principal

Todo app segue uma estrutura semelhante àbaixo:

```html
<body data-theme="nebula" data-mood="manha">
  <div class="app" id="app">
    <header class="app-header">…</header>
    <main class="app-main">
      <section class="hero-card">…</section>
      <section class="stacks">
        <details class="stack">…</details>
        <!-- outros stacks -->
      </section>
    </main>
    <footer class="app-footer">…</footer>
  </div>
</body>
```

#### `app` e seções

- `.app`: contêiner principal que imita um telefone.  Tudo acontece dentro dele.
- `.app-header`, `.app-main`, `.app-footer`: seções para cabeçalho, conteúdo principal e rodapé.
- Cada seção de conteúdo é um `<details class="stack">` (card sanfonado).  Um script garante que somente um stack esteja aberto por vez.

## 3. Componentes principais

### 3.1 Hero (Painel de horário)

O Hero apresenta informações dinâmicas de tempo e humor.  Principais classes:

- `.hero-card`: card grande no topo.
- `.hero-top`: linha com contador (`#timeLeft`) e botão de voz (`#heroVoice`).
- `.hero-title` (`#heroGreeting`): saudação dinâmica.
- `.hero-subtitle` (`#heroSubtitle`): frase que muda conforme o horário.
- `.hero-slider`: bloco que contém o slider de horário.
- `.hero-slider-row`: linha com horários e a label de mood.
- `.label-mood` (`#moodLabel`): pill que mostra o estado (“Manhã focada” etc.).
- `.range-wrap`, `.range-track`, `.range-fill`: wrapper visual do slider; `.range-fill` é ajustado via JS para mostrar preenchimento.
- `.hero-range` (`#timeRange`): `<input type="range">` controlado por JS.

**Dica:** Em outros apps que precisam de controle de tempo ou fases, reutilize a combinação `.range-wrap` + `.hero-range` + `.range-fill`.

### 3.2 Stacks (cards sanfonados)

A convenção de layout para stacks é fixa e deve ser mantida em novos apps. Cada módulo grande segue a estrutura:

```html
<details class="stack" open>
  <summary class="stack-summary">
    <div class="stack-main">
      <div class="stack-title">Título</div>
      <div class="stack-sub">Subtítulo</div>
    </div>
    <div class="stack-meta">
      <span class="stack-pill">Etiqueta</span>
      <div class="stack-icon">🪐</div>
    </div>
  </summary>
  <div class="stack-body">
    <!-- conteúdo interno -->
  </div>
</details>
```

- `.stack-summary`: cabeçalho clicável.
- `.stack-main`: grupo de título e subtítulo.
- `.stack-meta`: metadados do lado direito com `.stack-pill` (um marcador) e `.stack-icon` (ícone).  Use `.stack-icon.secondary` para variantes de cor.
- `.stack-body`: área interna, onde ficam painéis, grids ou viewers.

**Regra:** Só um `<details.stack>` aberto por vez; o JS adiciona/remove o atributo `open`.

### 3.3 Painéis internos (linhas clicáveis)

Dentro de `.stack-body`, o padrão principal de menu é uma lista vertical de itens:

```html
<ul class="panel-list">
  <li class="panel-row" data-log="Mensagem para log">
    <div class="panel-row-main">
      <strong>Título do painel</strong>
      <span class="meta">Descrição curta</span>
    </div>
    <span class="panel-pill"><i>🔗</i>Rótulo</span>
  </li>
  <!-- outras linhas -->
</ul>
```

- `.panel-row`: linha clicável; usa `data-log` para enviar texto ao log (`#logBox`).
- `.panel-row-main`: contém o `strong` (título) e um `span.meta` (descrição).
- `.panel-pill`: pill de ação no lado direito com `i` (ícone) e rótulo.

### 3.4 Pills de seleção e apps externos

Quando um stack precisa mostrar uma grade de opções, use `.pill-grid` com `.pill` individual:

```html
<div class="pill-grid">
  <div class="pill"
       data-url="https://…"
       data-title="✏️ Dual Editor • Kodux"
       data-log="Abrindo Dual Editor…">
    <span>✏️ Dual Editor</span>
    <span class="badge">Códigos & Prompts</span>
  </div>
  <!-- outras pills -->
</div>
```

- `.pill-grid`: grid de duas colunas (em mobile continua vertical).
- `.pill`: botão quadrado; `data-url` indica a página a ser carregada em um viewer; `data-title` é o título do iframe; `data-log` é a mensagem para o log.
- `.badge`: subtítulo da pill (por exemplo, categoria).

### 3.5 Viewers e integrações

Existem dois tipos de viewers internos:

- **Viewer genérico (`.livro-viewer`)**: usado para abrir documentos ou apps externos.  Inicialmente contém `.livro-empty` (texto placeholder).  Ao clicar em uma pill, o JS injeta um `<iframe>` com `src` e `title` baseados nos atributos da pill.
- **Viewer Solar (`.solar-viewer`)**: usado para carregar o painel Nos.S°lar ou outras integrações específicas.  Similar ao viewer genérico, mas com estilos distintos.

Sempre que integrar um app remoto, use uma pill com `data-url` e coloque o `<iframe>` dentro de um viewer dedicado.

### 3.6 Estado solar (Hub Solar)

Para representar estados simbólicos (por exemplo, luz, bateria, rede), usa‑se uma grade fixa:

```html
<div class="solar-grid" id="solarGrid">
  <div class="solar-card" data-kind="luz" data-state-index="0">
    <div class="solar-label">Luz</div>
    <div class="solar-state">
      <span class="solar-dot"></span>
      <span class="solar-icon">☀️</span>
      <span class="solar-text">…</span>
    </div>
  </div>
  <!-- outras cards (bateria, rede) -->
</div>
```

- `.solar-grid`: grid de três colunas.
- `.solar-card`: cada cartão de estado; `data-kind` define o tipo (luz, bateria, rede) e `data-state-index` indica o estado atual.
- Internamente: `.solar-dot` muda de cor no JS (verde para OK, laranja para Instável, vermelho para Off); `.solar-icon` exibe emoji; `.solar-text` exibe o texto.

**Reutilização:**  Esse padrão pode servir para outros nodes (por exemplo, NODE‑01, NODE‑02).  Alterar apenas o prefixo quando calcular o hash solar.

### 3.7 Chat Solar (integração com OpenRouter)

O componente de chat é composto por:

- `.solar-chat`: cartão do chat.
- `.solar-chat-header`, `.solar-chat-title`: título e descrição.
- `.solar-chat-key`: linha com input de chave de API (`#chatKey`) e botão para salvar/remover (`#chatSaveKey`).  A chave é armazenada em `localStorage['dual_openrouter_key']`.
- `.chat-messages` (`#chatMessages`): div que guarda as mensagens; cada mensagem recebe classes `.chat-msg.system`, `.chat-msg.user` ou `.chat-msg.assistant`.
- `.chat-input-row`: linha de input; contém `#chatInput` (`<textarea>`) e botão `#chatSend`.
- `.chat-helper`: texto informativo sobre armazenamento local.

Para adaptar o chat a outro app, altere apenas a mensagem `system` de contexto e eventualmente o modelo na requisição.

### 3.8 Temas e hash do dia (rodapé)

O rodapé (`.app-footer`) exibe:

- **Cards de tema:** `.theme-card` com `.theme-title`, `.theme-chips` e `.theme-chip`.  Cada `.theme-chip` possui `data-theme` (por exemplo, `nebula` ou `madeira`) e classe `.active` quando selecionada.  Clicar numa chip chama `setTheme(theme)`.
- **Hash do dia:** `.hash-card` com `.hash-header`, `.hash-title`, `.hash-tag-pill` e `.hash-main`.  O hash é calculado no JS a partir da data atual e serve como orientação diária ou identificação (ex.: `NOS-YYYY-MMDD-HHH-K#`).  Esse padrão pode ser reutilizado em outros nodes alterando apenas o prefixo.

## 4. Tabela de classes (resumo)

A tabela a seguir lista algumas classes‑chave, sua função e onde costumam ser usadas.  Use frases curtas para se orientar rapidamente.

| Classe CSS | Função principal | Onde usar |
| --- | --- | --- |
| `.app` | Contêiner do aplicativo; define o “telefone” | Envolve header, main e footer |
| `.app-header` | Cabeçalho com marca e controles | Topo da `.app` |
| `.app-main` | Área principal de conteúdo | Contém `hero` e `stacks` |
| `.hero-card` | Card grande do topo (saudação/horário) | Primeira seção dentro de `.app-main` |
| `.hero-range` | Slider de horário (input range) | Dentro de `.hero-slider` |
| `.stack` | Card sanfonado (details) | Cada módulo ou app interno |
| `.stack-summary` | Cabeçalho clicável do stack | Dentro de `.stack` |
| `.stack-body` | Área de conteúdo do stack | Painéis, grids, viewers |
| `.panel-list` | Lista vertical de painéis | Dentro de `.stack-body` |
| `.panel-row` | Linha clicável com título e meta | Menus internos |
| `.pill-grid` | Grade de opções (2 colunas) | Stacks com vários botões |
| `.pill` | Botão de ação externo; carrega um viewer | Atribuir `data-url` e `data-title` |
| `.livro-viewer` | Viewer genérico com iframe | Carrega documentos/apps |
| `.solar-grid` | Grade de status (luz, bateria, rede) | Hub Solar |
| `.solar-card` | Cartão de estado individual | Dentro de `.solar-grid` |
| `.solar-chat` | Componente de chat | Hub Solar |
| `.theme-chip` | Botão de seleção de tema | Rodapé |

## 5. Criando um novo app stack (passo a passo)

Siga estas etapas para adicionar um novo módulo (app) ao ecossistema, reutilizando o design system:

1. **Defina a estrutura:** Crie um `<details class="stack">` com `summary.stack-summary` e `div.stack-body`.  Dê a cada app um título (`.stack-title`) e subtítulo (`.stack-sub`) descritivo.  Se necessário, adicione um `span.stack-pill` para indicar tempo ou status e um `div.stack-icon` com um ícone.
2. **Escolha o tipo de conteúdo:**
   - Para uma lista de funcionalidades internas, use uma `<ul class="panel-list">` com `<li class="panel-row" data-log="…">`.  Preencha com títulos (`<strong>`), descrições (`<span class="meta">`) e um `span.panel-pill` para indicar ação.
   - Para uma grade de apps externos, utilize `<div class="pill-grid">` e insira várias `<div class="pill">` com `data-url`, `data-title` e `data-log`.  Dentro de cada `.pill` coloque um `span` para o nome e outro `span.badge` para a categoria.
   - Para exibir conteúdo externo, inclua um viewer (`.livro-viewer` ou `.solar-viewer`) dentro de `.stack-body`.  Inicialmente deixe um elemento com texto “Clique em um app” e substitua-o via JS com um `<iframe>` quando o usuário selecionar uma pill.
3. **Estado e log:** Se o app necessitar de estados simbólicos (por exemplo, “Ligado/Desligado”), considere reutilizar a estrutura de `.solar-grid` e `.solar-card`, trocando os rótulos e estados conforme necessário.  Para mensagens de log, adicione o atributo `data-log` nos elementos clicáveis; o JS centralizado deve enviar essas mensagens para um componente de log.
4. **Integração de temas e mood:** Certifique-se de que o novo app respeita o atributo `data-theme` e, se apropriado, interaja com o humor (`data-mood`) para modificar o texto ou cores.
5. **Teste a sanfona:** Verifique que apenas um stack abre por vez e que os outros se fecham automaticamente.  Ajuste a ordem de `details.stack` conforme a prioridade do app.

## 6. Checklist rápido para novos apps

Para não quebrar a consistência, sempre confira:

1. **Layout e tema**
   - Use `<body data-theme="…">` e mantenha a estrutura `.app`.
   - Reaproveite os tokens em `:root` e não crie novas cores arbitrárias.
2. **Stack padrão**
   - Cada módulo é um `details.stack` com `summary.stack-summary` e `div.stack-body`.
   - Inclua `.stack-title`, `.stack-sub`, `.stack-pill` e `.stack-icon` quando necessário.
3. **Ações internas**
   - Linhas clicáveis: `.panel-row` com `data-log`.
   - Grades de apps: `.pill-grid` + `.pill` com `data-url` e `data-title`.
4. **Integrações externas**
   - Sempre use viewers dedicados (`.livro-viewer` ou variantes) com `<iframe>`.
5. **Estado simbólico**
   - Se seu app possui estados, considere o padrão de `.solar-card` (dot colorido, ícone, texto).
6. **Log & Voz**
   - Para qualquer ação significativa, chame a função `log(texto)` para registrar no painel de log.
   - Se houver leitura em voz alta, passe o texto pela função central `speak(text)` para garantir consistência de TTS.

## 7. Referências e materiais

O design system aqui descrito baseia‑se no código dos apps **Nos.S°lar – Hub1** e **Dual Infodose**.  Para ver a implementação real:

- O arquivo *Hubnosol.html* (Hub Solar) mostra o uso de temas, estado solar e chat.  Nele, o `<style>` define tokens de cores, gradientes e classes como `.solar-grid` e `.theme-card`【858161686652123†screenshot】.
- O arquivo *Index no hub 3.html* (Dual Infodose) apresenta o padrão do Hero com slider e a estrutura de stacks e painéis【858161686652123†screenshot】.

Este guia foi sintetizado para auxiliar na criação de novos aplicativos dentro do ecossistema Hub1/BlueCup mantendo identidade visual, usabilidade e consistência.