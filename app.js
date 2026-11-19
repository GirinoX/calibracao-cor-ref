(() => {
  "use strict";

  const HEADER_THEME_COLOR = "#563D80";

  function pyRound(value) {
    const floor = Math.floor(value);
    const frac = value - floor;
    if (Math.abs(frac - 0.5) < 1e-9) {
      return floor % 2 === 0 ? floor : floor + 1;
    }
    return Math.round(value);
  }

  function clampByte(n) {
    return Math.max(0, Math.min(255, n | 0));
  }

  function rgbToHex(r, g, b) {
    return (
      "#" +
      [r, g, b]
        .map((v) => clampByte(v).toString(16).padStart(2, "0").toUpperCase())
        .join("")
    );
  }

  function contrastTextRgb(r, g, b) {
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    return lum < 140 ? "#FFFFFF" : "#121216";
  }

  function buildChannelSteps(labelPrefix, weights, percentages) {
    const [wr, wg, wb] = weights;
    return percentages.map((pct) => {
      const base = pyRound((pct / 100) * 255);
      const r = pyRound(base * wr);
      const g = pyRound(base * wg);
      const b = pyRound(base * wb);
      const zone =
        pct <= 20 ? "Sombra do canal" : pct === 50 ? "Gama 50%" : pct >= 85 ? "Contraste / Topo" : "Meio-tom";
      return {
        pct,
        name: `${labelPrefix} ${pct}%`,
        rgb: [r, g, b],
        note: `${zone} • Degrau puro (${pct}% de 255)`,
      };
    });
  }

  function buildNeutralSteps(labelPrefix, percentages, noteText) {
    return percentages.map((pct) => {
      const val = pyRound((pct / 100) * 255);
      return {
        pct,
        name: `${labelPrefix} ${pct}%`,
        rgb: [val, val, val],
        note: noteText,
      };
    });
  }

  const CHANNEL_PCTS = [10, 20, 35, 50, 70, 85, 95, 100];
  const SHADOW_PCTS = [0, 1, 2, 3, 4, 6, 8, 10, 12, 15, 20];
  const HIGHLIGHT_PCTS = [80, 85, 88, 90, 92, 94, 96, 97, 98, 99, 100];

  const STAGES = [
    {
      id: "sequencia_guiada",
      tabLabel: "★ Sequência 7 Etapas",
      title: "★ Sequência Visual Inteligente (7 Etapas no Olho)",
      dotHex: "#FFC041",
      tip: "Siga esta ordem exata da Estação: 1.Âncora Neutra (blinda o cinza contra roxo) → 2.Vermelho → 3.Coral → 4.Verde → 5.Oliva → 6.Azul (Convergência) → 7.Sombra Final.",
      ribbons: [
        { name: "ETAPA 1/7 • CINZA 50% (ÂNCORA NEUTRA)", rgb: [128, 128, 128], textRgb: [245, 245, 245], note: "Ancora R=G=B primeiro para o cinza JAMAIS ficar roxo" },
        { name: "ETAPA 1/7 • BRANCO 96% (TOPO NEUTRO)", rgb: [245, 245, 245], textRgb: [20, 20, 20], note: "Contraste neutro sem estourar no 100%" },
        { name: "ETAPA 2/7 • VERMELHO PURO", rgb: [229, 57, 53], textRgb: [255, 255, 255], note: "Força e saturação principal de R (trava com Carmesim/Tomate)" },
        { name: "ETAPA 2/7 • CARMESIM ESCURO", rgb: [142, 27, 27], textRgb: [255, 235, 235], note: "Profundidade escura do Vermelho" },
        { name: "ETAPA 3/7 • CORAL / PELE QUENTE", rgb: [224, 159, 125], textRgb: [25, 18, 15], note: "Meio-tom R+G ajustado sem desconfigurar Vermelho Puro" },
        { name: "ETAPA 4/7 • VERDE VIVO", rgb: [67, 160, 71], textRgb: [255, 255, 255], note: "Pureza e gama médio de G com R e Cinza blindados" },
        { name: "ETAPA 4/7 • ESMERALDA ESCURO", rgb: [27, 94, 32], textRgb: [235, 255, 235], note: "Sombra e densidade do canal Verde" },
        { name: "ETAPA 5/7 • OLIVA NEUTRO (PONTE R=G)", rgb: [158, 157, 36], textRgb: [255, 255, 240], note: "Equilíbrio exato R=158 / G=157 — prepara a convergência do Azul" },
        { name: "ETAPA 6/7 • AZUL COBALTO (CONVERGÊNCIA)", rgb: [30, 136, 229], textRgb: [255, 255, 255], note: "Limite físico EDID: LG FHD B_y=0.0498 vs Ultrawide B_y=0.0596" },
        { name: "ETAPA 6/7 • AZUL CÉU", rgb: [79, 195, 247], textRgb: [15, 25, 35], note: "Se não convergir sozinho, use '⚡ Mudar Linha' no programa" },
        { name: "ETAPA 6/7 • BRANCO GELO", rgb: [215, 228, 242], textRgb: [20, 24, 30], note: "Conferência de ponto branco frio sem puxar cinza p/ violeta" },
        { name: "ETAPA 7/7 • SOMBRA 6% (CHECK-UP FINAL)", rgb: [15, 15, 15], textRgb: [215, 215, 220], note: "Destrava 1%–4% do preto movendo R, G e B juntos" },
      ],
      stepBands: [
        {
          title: "ETAPA 1 & 7 — DEGRAUS DE SOMBRA (0% a 20%)",
          hint: "1% e 2% devem se separar sutilmente do Preto 0% sem tom roxo",
          colsClass: "steps-11",
          items: buildNeutralSteps("SOMBRA", SHADOW_PCTS, "Coluna vertebral neutra • Sombra"),
        },
        {
          title: "ETAPA 1 & 7 — ALTAS-LUZES E CONTRASTE (80% a 100%)",
          hint: "96%–99% devem se distinguir do Branco 100%",
          colsClass: "steps-11",
          items: buildNeutralSteps("LUZ", HIGHLIGHT_PCTS, "Coluna vertebral neutra • Altas-luzes"),
        },
      ],
      ramps: [
        {
          label: "RAMPA NEUTRA 100% P&B (R=G=B • 0% → 100% — Apenas Preto, Cinza e Branco Puro)",
          startRgb: [0, 0, 0],
          endRgb: [255, 255, 255],
          note: "Se surgirem faixas esverdeadas ou roxas na rampa do monitor, clique em '🧼 Purificar Cinza (100% P&B)' na Estação",
        },
      ],
    },
    {
      id: "vermelho",
      tabLabel: "1. Vermelho (R)",
      title: "1. Vermelho (R)",
      dotHex: "#E53935",
      tip: "Compare vermelhos puros, tom de pele e degraus R (10%–100%) antes de fixar o canal R.",
      ribbons: [
        { name: "VERMELHO PURO", rgb: [229, 57, 53], textRgb: [255, 255, 255], note: "Saturação principal de R" },
        { name: "CARMESIM ESCURO", rgb: [142, 27, 27], textRgb: [255, 235, 235], note: "Profundidade escura de R" },
        { name: "TOMATE VIVO", rgb: [255, 82, 82], textRgb: [25, 10, 10], note: "Brilho / neon no vermelho" },
        { name: "CORAL / PELE QUENTE", rgb: [224, 159, 125], textRgb: [25, 18, 15], note: "Equilíbrio R/G/B em pele" },
        { name: "CINZA 50% NEUTRO", rgb: [128, 128, 128], textRgb: [245, 245, 245], note: "Conferência de neutralidade" },
      ],
      stepBands: [
        {
          title: "DEGRAUS PUROS VERMELHO (10% a 100%)",
          hint: "Sombra (10–20%), Gama (50%), Contraste (85–100%)",
          colsClass: "steps-8",
          items: buildChannelSteps("VERMELHO PURO", [1, 0, 0], CHANNEL_PCTS),
        },
      ],
      ramps: [
        {
          label: "RAMPA CANAL VERMELHO [0x16] • 8% → 100%",
          startRgb: [20, 0, 0],
          endRgb: [255, 0, 0],
          note: "Gradiente contínuo do canal Vermelho",
        },
      ],
    },
    {
      id: "verde",
      tabLabel: "2. Verde (G)",
      title: "2. Verde (G)",
      dotHex: "#43A047",
      tip: "Compare verdes vivos/escuros, oliva e degraus puros de G sem puxar para amarelo ou ciano.",
      ribbons: [
        { name: "VERDE VIVO", rgb: [67, 160, 71], textRgb: [255, 255, 255], note: "Saturação principal de G" },
        { name: "ESMERALDA ESCURO", rgb: [27, 94, 32], textRgb: [235, 255, 235], note: "Profundidade escura de G" },
        { name: "MENTA CLARO", rgb: [129, 199, 132], textRgb: [18, 30, 18], note: "Meios-tons e altas de G" },
        { name: "OLIVA NEUTRO", rgb: [158, 157, 36], textRgb: [255, 255, 240], note: "Equilíbrio entre R e G" },
        { name: "CINZA 50% NEUTRO", rgb: [128, 128, 128], textRgb: [245, 245, 245], note: "Conferência de neutralidade" },
      ],
      stepBands: [
        {
          title: "DEGRAUS PUROS VERDE (10% a 100%)",
          hint: "Sombra (10–20%), Gama (50%), Contraste (85–100%)",
          colsClass: "steps-8",
          items: buildChannelSteps("VERDE PURO", [0, 1, 0], CHANNEL_PCTS),
        },
      ],
      ramps: [
        {
          label: "RAMPA CANAL VERDE [0x18] • 8% → 100%",
          startRgb: [0, 20, 0],
          endRgb: [0, 255, 0],
          note: "Gradiente contínuo do canal Verde",
        },
      ],
    },
    {
      id: "azul",
      tabLabel: "3. Azul (B)",
      title: "3. Azul (B)",
      dotHex: "#1E88E5",
      tip: "Compare cobalto, marinho, azul céu e branco gelo para fechar o equilíbrio RGB.",
      ribbons: [
        { name: "AZUL COBALTO", rgb: [30, 136, 229], textRgb: [255, 255, 255], note: "Saturação principal de B" },
        { name: "AZUL MARINHO", rgb: [13, 71, 161], textRgb: [235, 242, 255], note: "Profundidade escura de B" },
        { name: "AZUL CÉU", rgb: [79, 195, 247], textRgb: [15, 25, 35], note: "Altas e ciano em B" },
        { name: "BRANCO GELO", rgb: [215, 228, 242], textRgb: [20, 24, 30], note: "Temperatura fria / ponto branco" },
        { name: "CINZA 50% NEUTRO", rgb: [128, 128, 128], textRgb: [245, 245, 245], note: "Conferência de neutralidade" },
      ],
      stepBands: [
        {
          title: "DEGRAUS PUROS AZUL (10% a 100%)",
          hint: "Sombra (10–20%), Gama (50%), Contraste (85–100%)",
          colsClass: "steps-8",
          items: buildChannelSteps("AZUL PURO", [0, 0, 1], CHANNEL_PCTS),
        },
      ],
      ramps: [
        {
          label: "RAMPA CANAL AZUL [0x1A] • 8% → 100%",
          startRgb: [0, 0, 20],
          endRgb: [0, 0, 255],
          note: "Gradiente contínuo do canal Azul",
        },
      ],
    },
    {
      id: "final_sombra",
      tabLabel: "4. Final + Sombra",
      title: "4. Validação Final + Sombra (100% P&B + Esverdeado / Roxo / Quente / Frio)",
      dotHex: "#FFC041",
      tip: "A rampa neutra deve ter APENAS tons de preto, cinza e branco puros. Use '🧼 Purificar Cinza (100% P&B)' para limpar ondas e ajuste 'Cinza Esverdeado' ou 'Cinza Roxo / Magenta' no programa.",
      ribbons: [
        { name: "SOMBRA 6% (PRETO PROFUNDO)", rgb: [15, 15, 15], textRgb: [210, 210, 215], note: "Separação anti-Black Crush" },
        { name: "CINZA 25% (ESCURO)", rgb: [64, 64, 64], textRgb: [235, 235, 235], note: "Gama inferior" },
        { name: "CINZA 50% (GAMA)", rgb: [128, 128, 128], textRgb: [245, 245, 245], note: "Ponto médio de Gama 2.20" },
        { name: "CINZA 75% (CLARO)", rgb: [191, 191, 191], textRgb: [20, 20, 20], note: "Gama superior neutra" },
        { name: "BRANCO 96% (CONTRASTE)", rgb: [245, 245, 245], textRgb: [20, 20, 20], note: "Não pode fundir no 100%" },
        { name: "BRANCO 100% (PICO)", rgb: [255, 255, 255], textRgb: [20, 20, 20], note: "Referência máxima de brilho" },
        { name: "VERMELHO PURO", rgb: [229, 57, 53], textRgb: [255, 255, 255], note: "Conferência final de R" },
        { name: "VERDE VIVO", rgb: [67, 160, 71], textRgb: [255, 255, 255], note: "Conferência final de G" },
        { name: "AZUL COBALTO", rgb: [30, 136, 229], textRgb: [255, 255, 255], note: "Conferência final de B" },
        { name: "TOM PELE / ÂMBAR", rgb: [216, 164, 127], textRgb: [25, 20, 18], note: "Naturalidade de cor mista" },
      ],
      stepBands: [
        {
          title: "DEGRAUS DE SOMBRA (0% a 20%)",
          hint: "1% e 2% devem se separar sutilmente do Preto 0%",
          colsClass: "steps-11",
          items: buildNeutralSteps("SOMBRA", SHADOW_PCTS, "Detalhe de sombra (anti-Black Crush)"),
        },
        {
          title: "ALTAS-LUZES / CONTRASTE (80% a 100%)",
          hint: "96%–99% devem se distinguir do Branco 100%",
          colsClass: "steps-11",
          items: buildNeutralSteps("LUZ", HIGHLIGHT_PCTS, "Detalhe de altas-luzes (Contraste)"),
        },
      ],
      ramps: [
        {
          label: "RAMPA NEUTRA BASE & GAMA (100% P&B • 0% → 100%)",
          startRgb: [0, 0, 0],
          endRgb: [255, 255, 255],
          note: "Deve exibir SOMENTE preto, cinza e branco puros (zero verde / zero roxo)",
        },
      ],
    },
    {
      id: "tudo",
      tabLabel: "5. Tudo",
      title: "5. Visão Completa (Tudo)",
      dotHex: "#FFFFFF",
      tip: "Todas as faixas principais, degraus de sombra/luz e 4 rampas contínuas em uma tela.",
      ribbons: [
        { name: "BRANCO 100%", rgb: [255, 255, 255], textRgb: [20, 20, 20], note: "Referência de pico branco" },
        { name: "CINZA 75%", rgb: [191, 191, 191], textRgb: [20, 20, 20], note: "Cinza claro" },
        { name: "CINZA 50% (NEUTRO)", rgb: [128, 128, 128], textRgb: [245, 245, 245], note: "Cinza neutro de gama" },
        { name: "SOMBRA 4%", rgb: [10, 10, 10], textRgb: [190, 190, 195], note: "Sombra profunda (Black Crush)" },
        { name: "VERMELHO (R)", rgb: [229, 57, 53], textRgb: [255, 255, 255], note: "Canal Vermelho" },
        { name: "VERDE (G)", rgb: [67, 160, 71], textRgb: [255, 255, 255], note: "Canal Verde" },
        { name: "AZUL (B)", rgb: [30, 136, 229], textRgb: [255, 255, 255], note: "Canal Azul" },
        { name: "TOM PELE / ÂMBAR", rgb: [216, 164, 127], textRgb: [25, 20, 18], note: "Tom quente natural" },
      ],
      stepBands: [
        {
          title: "BRILHO [0x10] — Detalhe de Sombra (0% a 20%)",
          hint: "Separação perto do preto puro",
          colsClass: "steps-11",
          items: buildNeutralSteps("SOMBRA", SHADOW_PCTS, "Detalhe de sombra (0% a 20%)"),
        },
        {
          title: "CONTRASTE [0x12] — Detalhe de Luz (80% a 100%)",
          hint: "Separação perto do branco puro",
          colsClass: "steps-11",
          items: buildNeutralSteps("LUZ", HIGHLIGHT_PCTS, "Detalhe de luz (80% a 100%)"),
        },
      ],
      ramps: [
        {
          label: "CINZA NEUTRO • 0% → 100%",
          startRgb: [0, 0, 0],
          endRgb: [255, 255, 255],
          note: "Rampa neutra completa",
        },
        {
          label: "GANHO R [0x16] • 10% → 100%",
          startRgb: [26, 0, 0],
          endRgb: [255, 0, 0],
          note: "Rampa pura de Vermelho",
        },
        {
          label: "GANHO G [0x18] • 10% → 100%",
          startRgb: [0, 26, 0],
          endRgb: [0, 255, 0],
          note: "Rampa pura de Verde",
        },
        {
          label: "GANHO B [0x1A] • 10% → 100%",
          startRgb: [0, 0, 26],
          endRgb: [0, 0, 255],
          note: "Rampa pura de Azul",
        },
      ],
    },
  ];

  // State
  let activeStageIdx = 0;
  let studioDark = false;
  let wakeLockSentinel = null;
  let wakeLockDesired = false;

  // Fullscreen state
  let fsMode = null; // "single" | "stage" | null
  let fsPlaylist = [];
  let fsIndex = 0;
  let fsHudVisible = true;
  let touchStartX = null;
  let touchStartY = null;
  let suppressNextTap = false;

  // DOM Elements
  const themeColorMeta = document.getElementById("theme-color-meta");
  const activeTabBadge = document.getElementById("active-tab-badge");
  const btnWakeLock = document.getElementById("btn-wakelock");
  const btnStudio = document.getElementById("btn-studio");
  const wakeLockFeedback = document.getElementById("wakelock-feedback");
  const btnToggleChecklist = document.getElementById("btn-toggle-checklist");
  const checklistBody = document.getElementById("checklist-body");
  const tabsNav = document.getElementById("tabs-nav");
  const stageHeading = document.getElementById("stage-heading");
  const stageTip = document.getElementById("stage-tip");
  const btnStageFullscreen = document.getElementById("btn-stage-fullscreen");
  const btnCarouselStart = document.getElementById("btn-carousel-start");
  const stageContent = document.getElementById("stage-content");

  const fsOverlay = document.getElementById("fullscreen-overlay");
  const fsSurface = document.getElementById("fs-surface");
  const fsSingleHud = document.getElementById("fs-single-hud");
  const fsCounter = document.getElementById("fs-counter");
  const fsName = document.getElementById("fs-name");
  const fsNote = document.getElementById("fs-note");
  const fsHex = document.getElementById("fs-hex");
  const fsRgb = document.getElementById("fs-rgb");
  const btnCopyHex = document.getElementById("btn-copy-hex");
  const btnFsPrev = document.getElementById("btn-fs-prev");
  const btnFsNext = document.getElementById("btn-fs-next");
  const btnFsClose = document.getElementById("btn-fs-close");
  const fsStageWrap = document.getElementById("fs-stage-wrap");
  const fsStageCanvas = document.getElementById("fs-stage-canvas");
  const fsStagePill = document.getElementById("fs-stage-pill");
  const fsStageLabel = document.getElementById("fs-stage-label");
  const btnFsStageClose = document.getElementById("btn-fs-stage-close");

  function setThemeColor(hex) {
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", hex);
    }
  }

  function currentStage() {
    return STAGES[activeStageIdx] || STAGES[0];
  }

  function buildStagePlaylist(stage) {
    const items = [];
    for (const r of stage.ribbons) {
      items.push({
        kind: "solid",
        name: r.name,
        rgb: r.rgb,
        note: r.note,
      });
    }
    for (const band of stage.stepBands) {
      for (const s of band.items) {
        items.push({
          kind: "solid",
          name: s.name,
          rgb: s.rgb,
          note: s.note,
        });
      }
    }
    for (const rm of stage.ramps) {
      items.push({
        kind: "ramp",
        name: rm.label,
        startRgb: rm.startRgb,
        endRgb: rm.endRgb,
        note: rm.note,
      });
    }
    return items;
  }

  function syncChecklistUi(collapsed) {
    checklistBody.hidden = collapsed;
    btnToggleChecklist.setAttribute("aria-expanded", String(!collapsed));
    btnToggleChecklist.textContent = collapsed ? "Mostrar" : "Ocultar";
  }

  function renderTabs() {
    tabsNav.innerHTML = "";
    STAGES.forEach((st, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tab-btn" + (idx === activeStageIdx ? " is-active" : "");
      btn.setAttribute("aria-current", idx === activeStageIdx ? "page" : "false");

      const dot = document.createElement("span");
      dot.className = "tab-dot";
      dot.style.backgroundColor = st.dotHex;

      const txt = document.createElement("span");
      txt.textContent = st.tabLabel;

      btn.append(dot, txt);
      btn.addEventListener("click", () => selectStage(idx, true));
      tabsNav.appendChild(btn);
    });
  }

  function renderStage() {
    const stage = currentStage();
    activeTabBadge.textContent = stage.tabLabel;
    stageHeading.textContent = stage.title;
    stageTip.textContent = stage.tip;
    renderTabs();

    const playlist = buildStagePlaylist(stage);
    stageContent.innerHTML = "";

    let cursor = 0;

    // 1. Ribbons / Amostras Principais
    const ribSection = document.createElement("div");
    const ribHeader = document.createElement("div");
    ribHeader.className = "section-label-row";
    ribHeader.innerHTML =
      '<h3 class="section-label">Amostras de Cor (Toque para Tela Cheia)</h3>' +
      '<span class="section-hint">sRGB exato</span>';
    ribSection.appendChild(ribHeader);

    const ribFrame = document.createElement("div");
    ribFrame.className = "optical-frame";
    const ribList = document.createElement("div");
    ribList.className = "ribbon-list";

    stage.ribbons.forEach((r) => {
      const idxInPlaylist = cursor++;
      const [rr, rg, rb] = r.rgb;
      const hex = rgbToHex(rr, rg, rb);
      const [tr, tg, tb] = r.textRgb;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "swatch-ribbon";
      btn.style.backgroundColor = hex;
      btn.style.color = `rgb(${tr}, ${tg}, ${tb})`;

      const nameEl = document.createElement("span");
      nameEl.className = "swatch-name";
      nameEl.textContent = r.name;

      const metaEl = document.createElement("span");
      metaEl.className = "swatch-meta";
      metaEl.textContent = `${hex} • RGB(${rr},${rg},${rb})`;

      btn.append(nameEl, metaEl);
      btn.addEventListener("click", () => openSingleFullscreen(playlist, idxInPlaylist));
      ribList.appendChild(btn);
    });
    ribFrame.appendChild(ribList);
    ribSection.appendChild(ribFrame);
    stageContent.appendChild(ribSection);

    // 2. Step Bands
    stage.stepBands.forEach((band) => {
      const bandSection = document.createElement("div");
      const bandHeader = document.createElement("div");
      bandHeader.className = "section-label-row";

      const h3 = document.createElement("h3");
      h3.className = "section-label";
      h3.textContent = band.title;

      const hint = document.createElement("span");
      hint.className = "section-hint";
      hint.textContent = band.hint;

      bandHeader.append(h3, hint);
      bandSection.appendChild(bandHeader);

      const frame = document.createElement("div");
      frame.className = "optical-frame";
      const grid = document.createElement("div");
      grid.className = `steps-grid ${band.colsClass}`;

      band.items.forEach((item) => {
        const idxInPlaylist = cursor++;
        const [sr, sg, sb] = item.rgb;
        const hex = rgbToHex(sr, sg, sb);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "step-tile";
        btn.style.backgroundColor = hex;
        btn.style.color = contrastTextRgb(sr, sg, sb);
        btn.setAttribute("aria-label", `${item.name} ${hex}`);

        const pctEl = document.createElement("span");
        pctEl.className = "step-pct";
        pctEl.textContent = `${item.pct}%`;

        const valEl = document.createElement("span");
        valEl.className = "step-val";
        valEl.textContent = hex;

        btn.append(pctEl, valEl);
        btn.addEventListener("click", () => openSingleFullscreen(playlist, idxInPlaylist));
        grid.appendChild(btn);
      });

      frame.appendChild(grid);
      bandSection.appendChild(frame);
      stageContent.appendChild(bandSection);
    });

    // 3. Gradient Ramps
    const rampSection = document.createElement("div");
    const rampHeader = document.createElement("div");
    rampHeader.className = "section-label-row";
    rampHeader.innerHTML =
      '<h3 class="section-label">Rampas Contínuas (Toque para Tela Cheia)</h3>' +
      '<span class="section-hint">Banding e transição</span>';
    rampSection.appendChild(rampHeader);

    const rampFrame = document.createElement("div");
    rampFrame.className = "optical-frame";
    const rampsStack = document.createElement("div");
    rampsStack.className = "ramps-stack";

    stage.ramps.forEach((rm) => {
      const idxInPlaylist = cursor++;
      const startCss = `rgb(${rm.startRgb.join(",")})`;
      const endCss = `rgb(${rm.endRgb.join(",")})`;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ramp-btn";
      btn.style.background = `linear-gradient(90deg, ${startCss} 0%, ${endCss} 100%)`;

      const lblEl = document.createElement("span");
      lblEl.textContent = rm.label;

      const arrowEl = document.createElement("span");
      arrowEl.textContent = "⛶";

      btn.append(lblEl, arrowEl);
      btn.addEventListener("click", () => openSingleFullscreen(playlist, idxInPlaylist));
      rampsStack.appendChild(btn);
    });

    rampFrame.appendChild(rampsStack);
    rampSection.appendChild(rampFrame);
    stageContent.appendChild(rampSection);
  }

  function selectStage(idx, updateHash) {
    const safeIdx = Math.max(0, Math.min(STAGES.length - 1, idx));
    activeStageIdx = safeIdx;
    if (updateHash) {
      history.replaceState(null, "", `#${STAGES[safeIdx].id}`);
    }
    renderStage();
  }

  function tryRequestBrowserFullscreen() {
    const el = document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    }
  }

  function tryExitBrowserFullscreen() {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }

  function renderSingleFullscreen() {
    if (!fsPlaylist.length) return;
    const item = fsPlaylist[fsIndex];
    fsCounter.textContent = `${fsIndex + 1} / ${fsPlaylist.length}`;
    fsName.textContent = item.name;
    fsNote.textContent = item.note || "";

    if (item.kind === "ramp") {
      const sHex = rgbToHex(...item.startRgb);
      const eHex = rgbToHex(...item.endRgb);
      fsSurface.style.background = `linear-gradient(90deg, rgb(${item.startRgb.join(",")}) 0%, rgb(${item.endRgb.join(",")}) 100%)`;
      fsHex.textContent = `${sHex} → ${eHex}`;
      fsRgb.textContent = `RGB(${item.startRgb.join(",")}) → RGB(${item.endRgb.join(",")})`;
      btnCopyHex.textContent = "Copiar Fim";
      btnCopyHex.dataset.copyValue = eHex;
      setThemeColor(eHex);
    } else {
      const [r, g, b] = item.rgb;
      const hex = rgbToHex(r, g, b);
      fsSurface.style.background = "";
      fsSurface.style.backgroundColor = hex;
      fsHex.textContent = hex;
      fsRgb.textContent = `RGB(${r}, ${g}, ${b})`;
      btnCopyHex.textContent = "Copiar HEX";
      btnCopyHex.dataset.copyValue = hex;
      setThemeColor(hex);
    }

    fsSingleHud.hidden = !fsHudVisible;
  }

  function openSingleFullscreen(playlist, startIndex) {
    fsPlaylist = playlist;
    fsIndex = Math.max(0, Math.min(playlist.length - 1, startIndex));
    fsMode = "single";
    fsHudVisible = true;

    fsStageWrap.hidden = true;
    fsSingleHud.hidden = false;
    fsOverlay.hidden = false;
    document.body.classList.add("fs-open");

    renderSingleFullscreen();
    tryRequestBrowserFullscreen();
  }

  function openStageFullscreen() {
    const stage = currentStage();
    fsMode = "stage";
    fsHudVisible = true;
    fsSingleHud.hidden = true;
    fsStageWrap.hidden = false;
    fsStageLabel.textContent = stage.title;
    fsStagePill.hidden = false;

    fsSurface.style.background = "#0E0E10";
    fsStageCanvas.innerHTML = "";

    // Ribbons
    const ribBand = document.createElement("div");
    ribBand.className = "fs-band-ribbons";
    stage.ribbons.forEach((r) => {
      const row = document.createElement("div");
      row.className = "fs-band-ribbon";
      const [rr, rg, rb] = r.rgb;
      const [tr, tg, tb] = r.textRgb;
      const hex = rgbToHex(rr, rg, rb);
      row.style.backgroundColor = hex;
      row.style.color = `rgb(${tr}, ${tg}, ${tb})`;

      const left = document.createElement("span");
      left.textContent = r.name;
      const right = document.createElement("code");
      right.textContent = hex;
      row.append(left, right);
      ribBand.appendChild(row);
    });
    fsStageCanvas.appendChild(ribBand);

    // Step Bands
    stage.stepBands.forEach((band) => {
      const stepsWrap = document.createElement("div");
      stepsWrap.className = "fs-band-steps";
      stepsWrap.style.gridTemplateColumns = `repeat(${band.items.length}, minmax(0, 1fr))`;
      band.items.forEach((item) => {
        const cell = document.createElement("div");
        cell.className = "fs-band-step";
        const [sr, sg, sb] = item.rgb;
        cell.style.backgroundColor = rgbToHex(sr, sg, sb);
        cell.style.color = contrastTextRgb(sr, sg, sb);
        cell.textContent = `${item.pct}%`;
        stepsWrap.appendChild(cell);
      });
      fsStageCanvas.appendChild(stepsWrap);
    });

    // Ramps
    stage.ramps.forEach((rm) => {
      const rampDiv = document.createElement("div");
      rampDiv.className = "fs-band-ramp";
      rampDiv.style.background = `linear-gradient(90deg, rgb(${rm.startRgb.join(",")}) 0%, rgb(${rm.endRgb.join(",")}) 100%)`;
      const lbl = document.createElement("span");
      lbl.textContent = rm.label;
      rampDiv.appendChild(lbl);
      fsStageCanvas.appendChild(rampDiv);
    });

    setThemeColor("#0E0E10");
    fsOverlay.hidden = false;
    document.body.classList.add("fs-open");
    tryRequestBrowserFullscreen();
  }

  function closeFullscreen() {
    fsMode = null;
    fsOverlay.hidden = true;
    fsSingleHud.hidden = true;
    fsStageWrap.hidden = true;
    document.body.classList.remove("fs-open");
    setThemeColor(HEADER_THEME_COLOR);
    tryExitBrowserFullscreen();
  }

  function stepSingleFullscreen(delta) {
    if (fsMode !== "single" || !fsPlaylist.length) return;
    fsIndex = (fsIndex + delta + fsPlaylist.length) % fsPlaylist.length;
    renderSingleFullscreen();
  }

  // Wake Lock API
  function updateWakeLockUi(active, note) {
    btnWakeLock.classList.toggle("is-on", active);
    btnWakeLock.setAttribute("aria-pressed", String(active));
    btnWakeLock.textContent = active ? "☀ Tela Acesa: ON" : "☀ Tela Acesa: OFF";
    wakeLockFeedback.textContent = note || "";
  }

  async function acquireWakeLock() {
    if (!("wakeLock" in navigator)) {
      wakeLockDesired = false;
      updateWakeLockUi(false, "Wake Lock não suportado neste navegador.");
      return;
    }
    try {
      wakeLockSentinel = await navigator.wakeLock.request("screen");
      wakeLockSentinel.addEventListener("release", () => {
        if (!wakeLockDesired) {
          updateWakeLockUi(false, "");
        }
      });
      updateWakeLockUi(true, "");
    } catch (_err) {
      wakeLockDesired = false;
      updateWakeLockUi(false, "Não foi possível travar a tela acesa.");
    }
  }

  async function toggleWakeLock() {
    if (wakeLockDesired) {
      wakeLockDesired = false;
      if (wakeLockSentinel) {
        try {
          await wakeLockSentinel.release();
        } catch (_err) {
          // ignore
        }
        wakeLockSentinel = null;
      }
      updateWakeLockUi(false, "");
    } else {
      wakeLockDesired = true;
      await acquireWakeLock();
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible" && wakeLockDesired) {
      acquireWakeLock();
    }
  });

  // Event Listeners
  btnWakeLock.addEventListener("click", toggleWakeLock);

  btnStudio.addEventListener("click", () => {
    studioDark = !studioDark;
    document.body.classList.toggle("studio-dark", studioDark);
    btnStudio.classList.toggle("is-studio-on", studioDark);
    btnStudio.setAttribute("aria-pressed", String(studioDark));
    btnStudio.textContent = studioDark ? "◐ Modo Estúdio: ON" : "◐ Modo Estúdio: OFF";
  });

  btnToggleChecklist.addEventListener("click", () => {
    const nextCollapsed = !checklistBody.hidden;
    syncChecklistUi(nextCollapsed);
    try {
      localStorage.setItem("calibracao_checklist_hidden", nextCollapsed ? "1" : "0");
    } catch (_err) {
      // ignore storage errors
    }
  });

  btnStageFullscreen.addEventListener("click", openStageFullscreen);
  btnCarouselStart.addEventListener("click", () => {
    const playlist = buildStagePlaylist(currentStage());
    openSingleFullscreen(playlist, 0);
  });

  btnFsPrev.addEventListener("click", (e) => {
    e.stopPropagation();
    stepSingleFullscreen(-1);
  });

  btnFsNext.addEventListener("click", (e) => {
    e.stopPropagation();
    stepSingleFullscreen(1);
  });

  btnFsClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeFullscreen();
  });

  btnFsStageClose.addEventListener("click", (e) => {
    e.stopPropagation();
    closeFullscreen();
  });

  fsSingleHud.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  fsStagePill.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  btnCopyHex.addEventListener("click", async (e) => {
    e.stopPropagation();
    const val = btnCopyHex.dataset.copyValue || "";
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
      btnCopyHex.textContent = "Copiado!";
      setTimeout(() => {
        if (fsMode === "single") renderSingleFullscreen();
      }, 1100);
    } catch (_err) {
      btnCopyHex.textContent = val;
    }
  });

  fsSurface.addEventListener("click", () => {
    if (suppressNextTap) {
      suppressNextTap = false;
      return;
    }
    if (fsMode === "single") {
      fsHudVisible = !fsHudVisible;
      fsSingleHud.hidden = !fsHudVisible;
    } else if (fsMode === "stage") {
      fsHudVisible = !fsHudVisible;
      fsStagePill.hidden = !fsHudVisible;
    }
  });

  fsSurface.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  fsSurface.addEventListener(
    "touchend",
    (e) => {
      if (touchStartX === null || touchStartY === null || e.changedTouches.length !== 1) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      touchStartX = null;
      touchStartY = null;
      if (fsMode === "single" && Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
        suppressNextTap = true;
        stepSingleFullscreen(dx < 0 ? 1 : -1);
      }
    },
    { passive: true }
  );

  document.addEventListener("keydown", (e) => {
    if (!fsMode) return;
    if (e.key === "Escape") {
      closeFullscreen();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      stepSingleFullscreen(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      stepSingleFullscreen(-1);
    } else if (e.key === " ") {
      e.preventDefault();
      if (fsMode === "single") {
        fsHudVisible = !fsHudVisible;
        fsSingleHud.hidden = !fsHudVisible;
      } else if (fsMode === "stage") {
        fsHudVisible = !fsHudVisible;
        fsStagePill.hidden = !fsHudVisible;
      }
    }
  });

  function applyHashRoute() {
    const hash = window.location.hash.replace(/^#/, "").trim().toLowerCase();
    const idx = STAGES.findIndex((s) => s.id === hash);
    if (idx >= 0) {
      activeStageIdx = idx;
    }
    renderStage();
  }

  window.addEventListener("hashchange", applyHashRoute);

  try {
    const savedCollapsed = localStorage.getItem("calibracao_checklist_hidden") === "1";
    syncChecklistUi(savedCollapsed);
  } catch (_err) {
    syncChecklistUi(false);
  }

  applyHashRoute();
})();
