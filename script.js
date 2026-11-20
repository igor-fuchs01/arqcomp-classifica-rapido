// =====================================================================
// Classifica Rápido: as cartas caem e o jogador joga cada uma na caixa certa
// As cartas ficam em dados.js (constante TEMAS)
// =====================================================================

// ---------- Configuração ----------
const PONTOS_POR_ACERTO = 10;
const ACERTOS_POR_NIVEL = 5;         // a cada 5 acertos, a carta cai mais rápido
const ACERTOS_POR_MULTIPLICADOR = 5; // a cada 5 acertos seguidos, os pontos valem mais
const MULTIPLICADOR_MAXIMO = 4;
const ACELERACAO_POR_NIVEL = 0.88;   // o tempo de queda vira 88% a cada nível
const TEMPO_MINIMO_QUEDA = 2.2;      // segundos
const TEMPO_FEEDBACK_CERTO = 600;    // ms
const TEMPO_FEEDBACK_TREINO = 2200;  // ms (acerto no treino, para dar tempo de ler)
const INTERVALO_CONTAGEM = 450;      // ms entre "3", "2", "1", "Já!"

const DIFICULDADES = {
  treino:  { nome: "Treino",  vidas: Infinity, fatorTempo: 1,   contaRecorde: false },
  normal:  { nome: "Normal",  vidas: 3,        fatorTempo: 1,   contaRecorde: true },
  dificil: { nome: "Difícil", vidas: 2,        fatorTempo: 0.7, contaRecorde: true },
};

// teclas mostradas em cada caixa e setas aceitas, conforme o número de caixas
const TECLAS_VISIVEIS = { 2: ["←", "→"], 3: ["←", "↓", "→"], 4: ["1", "2", "3", "4"] };
const SETAS = {
  2: { ArrowLeft: 0, ArrowRight: 1 },
  3: { ArrowLeft: 0, ArrowDown: 1, ArrowRight: 2 },
  4: {},
};

// o modo principal: mistura as cartas de todos os temas
const DESAFIO = {
  id: "desafio",
  capitulo: "Todos os capítulos",
  nome: "Desafio completo",
};

const TOTAL_CARTAS = TEMAS.reduce((soma, tema) => soma + tema.cartas.length, 0);
const TOTAL_PALAVRAS = new Set(TEMAS.flatMap((tema) => tema.categorias)).size;

// ---------- Elementos da página ----------
const $ = (id) => document.getElementById(id);
const telas = { inicio: $("tela-inicio"), jogo: $("tela-jogo"), fim: $("tela-fim") };
const areaJogo = $("area-jogo");
const cartaEl = $("carta");
const cartaConteudo = $("carta-conteudo");
const cartaTema = $("carta-tema");
const cartaTexto = $("carta-texto");
const barraTempo = $("barra-tempo");
const feedback = $("feedback");
const anuncio = $("anuncio");
const caixasEl = $("caixas");
const pausaEl = $("pausa");
const botaoPausa = $("botao-pausa");
const menosMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");

// ---------- Estado do jogo ----------
const estado = {
  dificuldade: "normal",
  temaId: null,
  baralho: [],          // lista de { carta, tema }
  atual: null,          // { carta, tema } que está na tela
  temaDasCaixas: null,  // tema cujas caixas estão desenhadas
  cartaCaindo: false,   // true enquanto o jogador pode responder
  aguardando: false,    // true enquanto mostra a explicação, antes da próxima carta
  contando: false,      // true durante a contagem regressiva
  pausado: false,
  posY: 0,
  tempoQueda: 6,        // segundos para a carta atual chegar ao fim
  pontos: 0,
  vidas: 3,
  sequencia: 0,
  acertos: 0,
  erros: 0,
  revisao: [],          // cartas erradas, para mostrar no fim
  rodando: false,
  ultimoTempo: 0,
  idLoop: null,
  timer: null,
};

// ---------- Utilidades ----------
function embaralhar(lista) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function criar(pai, tag, classe, texto) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (texto !== undefined) el.textContent = texto;
  pai.appendChild(el);
  return el;
}

// reinicia uma animação CSS (remove a classe, força o navegador a notar, coloca de novo)
function reanimar(el, classe) {
  el.classList.remove(classe);
  void el.offsetWidth;
  el.classList.add(classe);
}

// localStorage pode falhar (janela anônima etc.): o jogo continua, só não salva
function ler(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor === null ? padrao : valor;
  } catch {
    return padrao;
  }
}

function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, String(valor));
  } catch {
    // sem localStorage
  }
}

const dificuldadeAtual = () => DIFICULDADES[estado.dificuldade];
const emTreino = () => estado.dificuldade === "treino";

// recorde separado por tema e dificuldade (o Normal mantém a chave antiga)
function chaveRecorde(temaId) {
  const sufixo = estado.dificuldade === "normal" ? "" : "-" + estado.dificuldade;
  return "classifica-recorde-" + temaId + sufixo;
}
const lerRecorde = (temaId) => Number(ler(chaveRecorde(temaId), 0)) || 0;

// estrelas: melhor número de acertos numa partida (Normal ou Difícil)
const lerMelhorAcertos = (temaId) => Number(ler("classifica-acertos-" + temaId, 0)) || 0;
const metasDeEstrelas = (tema) => (tema === DESAFIO ? [10, 30, 60] : [5, 10, tema.cartas.length]);
const contarEstrelas = (tema, acertos) => metasDeEstrelas(tema).filter((meta) => acertos >= meta).length;

function buscarTema(id) {
  return id === DESAFIO.id ? DESAFIO : TEMAS.find((tema) => tema.id === id);
}

function montarBaralho(temaId) {
  const temas = temaId === DESAFIO.id ? TEMAS : [buscarTema(temaId)];
  return embaralhar(temas.flatMap((tema) => tema.cartas.map((carta) => ({ carta, tema }))));
}

const nivelAtual = () => 1 + Math.floor(estado.acertos / ACERTOS_POR_NIVEL);
const multiplicador = () =>
  Math.min(1 + Math.floor(estado.sequencia / ACERTOS_POR_MULTIPLICADOR), MULTIPLICADOR_MAXIMO);

function mostrarTela(nome) {
  Object.values(telas).forEach((tela) => tela.classList.remove("ativa"));
  telas[nome].classList.add("ativa");
  window.scrollTo(0, 0);
}

function desenharEstrelas(container, quantidade, animar = false) {
  container.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const estrela = criar(container, "span", "estrela" + (i < quantidade ? " cheia" : ""), "★");
    if (animar && i < quantidade) {
      estrela.classList.add("animar");
      estrela.style.animationDelay = 250 + i * 220 + "ms";
    }
  }
  container.setAttribute("aria-label", `${quantidade} de 3 estrelas`);
}

// ---------- Som (Web Audio, sem arquivos) ----------
let somLigado = ler("classifica-som", "1") === "1";
let audio = null;

const NOTAS = {
  certo: [660, 880],
  errado: [220, 165],
  nivel: [523, 659, 784],
  combo: [784, 988],
  contagem: [440],
  ja: [880],
  fim: [392, 330, 262],
  recorde: [523, 659, 784, 1047],
};

function tocar(tipo) {
  if (!somLigado) return;
  try {
    audio = audio || new (window.AudioContext || window.webkitAudioContext)();
    const volume = tipo === "errado" ? 0.06 : 0.12;
    NOTAS[tipo].forEach((frequencia, i) => {
      const oscilador = audio.createOscillator();
      const ganho = audio.createGain();
      const inicio = audio.currentTime + i * 0.09;
      oscilador.type = tipo === "errado" ? "square" : "sine";
      oscilador.frequency.value = frequencia;
      ganho.gain.setValueAtTime(0.0001, inicio);
      ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.01);
      ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.16);
      oscilador.connect(ganho).connect(audio.destination);
      oscilador.start(inicio);
      oscilador.stop(inicio + 0.17);
    });
  } catch {
    // navegador sem Web Audio: segue sem som
  }
}

function atualizarBotoesSom() {
  document.querySelectorAll(".botao-som").forEach((botao) => {
    botao.textContent = somLigado ? "🔊" : "🔇";
    botao.setAttribute("aria-pressed", String(somLigado));
  });
}

// ---------- Menu ----------
function escolherDificuldade(dificuldade) {
  estado.dificuldade = DIFICULDADES[dificuldade] ? dificuldade : "normal";
  salvar("classifica-dificuldade", estado.dificuldade);
  document.querySelectorAll(".dificuldade").forEach((botao) => {
    botao.setAttribute("aria-checked", String(botao.dataset.dificuldade === estado.dificuldade));
  });
  montarMenu();
}

function textoRecorde(temaId) {
  return emTreino() ? "Treino: sem recorde" : `Recorde ${dificuldadeAtual().nome}: ${lerRecorde(temaId)}`;
}

function montarMenu() {
  // cartão principal: Desafio completo
  $("hero-cartas").textContent = `${TOTAL_CARTAS} pistas · ${TOTAL_PALAVRAS} palavras`;
  $("hero-recorde").textContent = textoRecorde(DESAFIO.id);
  desenharEstrelas($("hero-estrelas"), contarEstrelas(DESAFIO, lerMelhorAcertos(DESAFIO.id)));

  // níveis, cada um com um grupo das 16 palavras
  const lista = $("lista-niveis");
  lista.innerHTML = "";
  let estrelasTotais = 0;

  TEMAS.forEach((tema, i) => {
    const estrelas = contarEstrelas(tema, lerMelhorAcertos(tema.id));
    estrelasTotais += estrelas;

    const botao = criar(lista, "button", "nivel" + (estrelas === 3 ? " completo" : ""));
    botao.type = "button";
    botao.style.setProperty("--i", i);
    botao.addEventListener("click", () => iniciarJogo(tema.id));

    criar(botao, "span", "nivel-numero", String(i + 1));
    const corpo = criar(botao, "span", "nivel-corpo");
    criar(corpo, "span", "nivel-capitulo", tema.capitulo);
    criar(corpo, "span", "nivel-nome", tema.nome);

    const categorias = criar(corpo, "span", "nivel-categorias");
    tema.categorias.forEach((nome, j) => {
      criar(categorias, "span", "etiqueta", nome).style.background = `var(--caixa-${j + 1})`;
    });

    const rodape = criar(corpo, "span", "nivel-rodape");
    desenharEstrelas(criar(rodape, "span", "estrelas"), estrelas);
    criar(rodape, "span", "", emTreino() ? `${tema.cartas.length} pistas` : `Recorde: ${lerRecorde(tema.id)}`);
  });

  const maximo = TEMAS.length * 3;
  $("progresso-texto").textContent = `★ ${estrelasTotais}/${maximo}`;
  $("progresso-preenchido").style.width = (estrelasTotais / maximo) * 100 + "%";
}

// ---------- Fluxo do jogo ----------
function iniciarJogo(temaId) {
  pararJogo();
  const dificuldade = dificuldadeAtual();

  Object.assign(estado, {
    temaId,
    baralho: montarBaralho(temaId),
    atual: null,
    temaDasCaixas: null,
    cartaCaindo: false,
    aguardando: false,
    contando: false,
    pausado: false,
    posY: 0,
    pontos: 0,
    vidas: dificuldade.vidas,
    sequencia: 0,
    acertos: 0,
    erros: 0,
    revisao: [],
    rodando: true,
  });

  $("nome-tema").textContent = buscarTema(temaId).nome;
  $("selo-dificuldade").textContent = dificuldade.nome;
  pausaEl.hidden = true;
  botaoPausa.textContent = "⏸ Pausar";
  botaoPausa.hidden = emTreino(); // no treino a carta não cai, então não há o que pausar
  areaJogo.classList.toggle("sem-tempo", emTreino());
  areaJogo.classList.remove("flash-certo", "flash-errado", "tremer");
  feedback.classList.remove("visivel");
  cartaEl.classList.add("oculta");
  barraTempo.style.transform = "scaleX(1)";
  barraTempo.className = "";

  // já mostra as caixas da primeira carta durante a contagem
  desenharCaixas(estado.baralho[estado.baralho.length - 1].tema);
  atualizarHud();
  mostrarTela("jogo");

  estado.ultimoTempo = performance.now();
  estado.idLoop = requestAnimationFrame(loop);

  if (emTreino()) {
    proximaCarta();
  } else {
    contagemRegressiva();
  }
}

function contagemRegressiva() {
  const passos = ["3", "2", "1", "Já!"];
  let i = 0;
  estado.contando = true;

  const passo = () => {
    if (!estado.rodando) return;
    if (i < passos.length) {
      const ultimo = i === passos.length - 1;
      anunciar(passos[i], ultimo ? "ja" : "contagem");
      tocar(ultimo ? "ja" : "contagem");
      i++;
      estado.timer = setTimeout(passo, INTERVALO_CONTAGEM);
    } else {
      estado.contando = false;
      proximaCarta();
    }
  };
  passo();
}

function proximaCarta() {
  // quando o baralho acaba, embaralha tudo de novo
  if (estado.baralho.length === 0) estado.baralho = montarBaralho(estado.temaId);

  estado.atual = estado.baralho.pop();
  const { carta, tema } = estado.atual;

  desenharCaixas(tema);
  limparCaixas();
  cartaEl.classList.remove("saindo", "oculta", "perigo");
  cartaTema.textContent = estado.temaId === DESAFIO.id ? tema.nome : "";
  cartaTexto.textContent = carta.texto;
  reanimar(cartaConteudo, "entrando");

  estado.posY = emTreino() ? 24 : 0;
  estado.tempoQueda = calcularTempoQueda(carta, tema);
  posicionarCarta();
  barraTempo.style.transform = "scaleX(1)";
  barraTempo.className = "";

  feedback.classList.remove("visivel");
  areaJogo.classList.remove("flash-certo", "flash-errado", "tremer");
  estado.aguardando = false;
  estado.cartaCaindo = true;
}

// textos longos e mais caixas dão mais tempo; cada nível e o Difícil aceleram
function calcularTempoQueda(carta, tema) {
  let base = 4.5 + carta.texto.length * 0.06 + (tema.categorias.length - 2) * 1.2;
  if (estado.temaId === DESAFIO.id) base += 1; // as caixas mudam, precisa de tempo para ler
  const tempo = base * dificuldadeAtual().fatorTempo * Math.pow(ACELERACAO_POR_NIVEL, nivelAtual() - 1);
  return Math.max(tempo, TEMPO_MINIMO_QUEDA);
}

function desenharCaixas(tema) {
  if (estado.temaDasCaixas === tema) return;
  estado.temaDasCaixas = tema;

  const n = tema.categorias.length;
  caixasEl.className = "caixas n" + n;
  caixasEl.innerHTML = "";
  tema.categorias.forEach((nome, i) => {
    const botao = criar(caixasEl, "button", "caixa");
    botao.type = "button";
    botao.dataset.indice = i;
    criar(botao, "span", "caixa-tecla", TECLAS_VISIVEIS[n][i]);
    criar(botao, "span", "caixa-nome", nome);
  });
}

function limparCaixas() {
  [...caixasEl.children].forEach((caixa) => caixa.classList.remove("acertou", "errou", "era-esta"));
}

function alturaUtil() {
  return Math.max(areaJogo.clientHeight - cartaEl.offsetHeight - 12, 0);
}

function posicionarCarta(deslocamentoX = 0, rotacao = 0) {
  cartaEl.style.transform =
    `translate(calc(-50% + ${deslocamentoX}px), ${estado.posY}px) rotate(${rotacao}deg)`;
}

function loop(agora) {
  if (!estado.rodando) return;

  // segundos desde o último quadro (limitado para a carta não "teletransportar" se o navegador travar)
  const dt = Math.min((agora - estado.ultimoTempo) / 1000, 0.1);
  estado.ultimoTempo = agora;

  if (estado.cartaCaindo && !estado.pausado && !emTreino()) {
    const limite = alturaUtil();
    estado.posY = Math.min(estado.posY + (limite / estado.tempoQueda) * dt, limite);
    const progresso = limite ? estado.posY / limite : 1;

    // a carta balança um pouco enquanto cai e fica vermelha perto do fim
    posicionarCarta(0, Math.sin(estado.posY / 45) * 3);
    cartaEl.classList.toggle("perigo", progresso > 0.75);
    barraTempo.style.transform = `scaleX(${1 - progresso})`;
    barraTempo.className = progresso > 0.75 ? "perigo" : progresso > 0.5 ? "alerta" : "";

    if (progresso >= 1) errar(null); // tempo esgotado
  }

  estado.idLoop = requestAnimationFrame(loop);
}

function responder(indice) {
  if (!estado.cartaCaindo || estado.pausado) return;
  if (indice >= estado.atual.tema.categorias.length) return;

  voarParaCaixa(indice);
  if (indice === estado.atual.carta.resposta) {
    acertar(indice);
  } else {
    errar(indice);
  }
}

// a carta voa girando até a caixa escolhida
function voarParaCaixa(indice) {
  const caixa = caixasEl.children[indice];
  const area = areaJogo.getBoundingClientRect();
  const alvo = caixa.getBoundingClientRect();
  const deslocamentoX = alvo.left + alvo.width / 2 - (area.left + area.width / 2);

  cartaEl.classList.remove("perigo");
  cartaEl.classList.add("saindo");
  estado.posY = areaJogo.clientHeight;
  posicionarCarta(deslocamentoX, Math.sign(deslocamentoX) * 18);
}

function acertar(indice) {
  estado.cartaCaindo = false;
  const multiplicadorAntes = multiplicador();
  estado.acertos++;
  estado.sequencia++;

  const mult = multiplicador();
  const ganho = PONTOS_POR_ACERTO * mult;
  estado.pontos += ganho;

  const caixa = caixasEl.children[indice];
  caixa.classList.add("acertou");
  mostrarPopup(caixa, "+" + ganho);
  reanimar($("hud-pontos"), "pulo");

  let mensagem = `✓ Certo! +${ganho}`;
  const subiuNivel = !emTreino() && estado.acertos % ACERTOS_POR_NIVEL === 0;

  if (subiuNivel) {
    anunciar(`Nível ${nivelAtual()}!`, "nivel");
    tocar("nivel");
  } else if (mult > multiplicadorAntes) {
    anunciar(`Combo ×${mult}!`, "combo");
    reanimar($("hud-multiplicador"), "pulo");
    tocar("combo");
  } else {
    tocar("certo");
  }

  // no treino, também mostra a explicação para fixar o conteúdo
  if (emTreino()) mensagem += " " + estado.atual.carta.explicacao;

  atualizarHud();
  mostrarFeedback(true, mensagem, emTreino());
  esperarParaAvancar(emTreino() ? TEMPO_FEEDBACK_TREINO : TEMPO_FEEDBACK_CERTO);
}

// indice = null quando o tempo acabou
function errar(indice) {
  estado.cartaCaindo = false;
  estado.erros++;
  estado.sequencia = 0;

  const { carta, tema } = estado.atual;
  if (indice === null) {
    cartaEl.classList.add("saindo");
  } else {
    caixasEl.children[indice].classList.add("errou");
  }
  caixasEl.children[carta.resposta].classList.add("era-esta");
  reanimar(areaJogo, "tremer");

  if (!emTreino()) {
    estado.vidas--;
    reanimar($("hud-vidas"), "perdeu");
  }
  guardarParaRevisao(carta, tema);

  const inicio = indice === null ? "⏱ Tempo esgotado!" : "✗ Errou!";
  const mensagem = `${inicio} Resposta certa: ${tema.categorias[carta.resposta]}. ${carta.explicacao}`;

  tocar("errado");
  atualizarHud();
  mostrarFeedback(false, mensagem, true);

  // no treino espera o jogador; senão avança sozinho depois de dar tempo de ler
  esperarParaAvancar(emTreino() ? null : Math.min(2000 + mensagem.length * 30, 6000));
}

function esperarParaAvancar(ms) {
  estado.aguardando = true;
  clearTimeout(estado.timer);
  if (ms !== null) estado.timer = setTimeout(avancar, ms);
}

function avancar() {
  if (!estado.aguardando) return;
  clearTimeout(estado.timer);
  estado.aguardando = false;

  if (estado.vidas <= 0) {
    fimDeJogo();
  } else {
    proximaCarta();
  }
}

function mostrarFeedback(certo, mensagem, comDica) {
  feedback.textContent = mensagem;
  if (comDica) criar(feedback, "small", "", "Enter, toque ou clique para continuar");
  feedback.classList.toggle("certo", certo);
  feedback.classList.toggle("errado", !certo);
  feedback.classList.add("visivel");
  areaJogo.classList.remove("flash-certo", "flash-errado");
  areaJogo.classList.add(certo ? "flash-certo" : "flash-errado");
}

function anunciar(texto, tipo) {
  anuncio.textContent = texto;
  anuncio.className = "anuncio";
  void anuncio.offsetWidth;
  anuncio.className = "anuncio mostrar " + tipo;
}

function mostrarPopup(caixa, texto) {
  const popup = criar(caixa, "span", "popup", texto);
  setTimeout(() => popup.remove(), 900);
}

function guardarParaRevisao(carta, tema) {
  const repetida = estado.revisao.some((item) => item.carta === carta);
  if (!repetida) estado.revisao.push({ carta, tema });
}

function atualizarHud() {
  const mult = multiplicador();
  $("hud-pontos").textContent = estado.pontos;
  $("hud-sequencia").textContent = estado.sequencia;
  $("hud-multiplicador").textContent = "×" + mult;
  $("hud-multiplicador").classList.toggle("ativo", mult > 1);
  $("hud-nivel").textContent = emTreino() ? "–" : nivelAtual();

  if (emTreino()) {
    $("hud-vidas").textContent = "∞";
  } else {
    const maximo = dificuldadeAtual().vidas;
    const restantes = Math.max(estado.vidas, 0);
    $("hud-vidas").textContent = "❤️".repeat(restantes) + "🖤".repeat(maximo - restantes);
  }
}

function alternarPausa() {
  if (!estado.rodando || emTreino()) return;
  if (!estado.pausado && !estado.cartaCaindo) return; // só pausa com a carta caindo

  estado.pausado = !estado.pausado;
  pausaEl.hidden = !estado.pausado;
  botaoPausa.textContent = estado.pausado ? "▶ Continuar" : "⏸ Pausar";
  estado.ultimoTempo = performance.now();
}

function pararJogo() {
  estado.rodando = false;
  estado.cartaCaindo = false;
  estado.aguardando = false;
  estado.contando = false;
  clearTimeout(estado.timer);
  cancelAnimationFrame(estado.idLoop);
}

function encerrar() {
  if (!estado.rodando) return;
  if (estado.acertos + estado.erros === 0) {
    voltarAoMenu();
  } else {
    fimDeJogo();
  }
}

function fimDeJogo() {
  pararJogo();

  const tema = buscarTema(estado.temaId);
  const dificuldade = dificuldadeAtual();
  let novoRecorde = false;
  let estrelas = 0;

  if (dificuldade.contaRecorde) {
    if (estado.pontos > lerRecorde(tema.id)) {
      salvar(chaveRecorde(tema.id), estado.pontos);
      novoRecorde = true;
    }
    if (estado.acertos > lerMelhorAcertos(tema.id)) {
      salvar("classifica-acertos-" + tema.id, estado.acertos);
    }
    estrelas = contarEstrelas(tema, estado.acertos);
  }

  const total = estado.acertos + estado.erros;
  $("fim-tema").textContent = `${tema.nome} · ${dificuldade.nome}` + (emTreino() ? " (recorde e estrelas não contam)" : "");
  $("fim-pontos").textContent = estado.pontos;
  $("fim-acertos").textContent = estado.acertos;
  $("fim-erros").textContent = estado.erros;
  $("fim-precisao").textContent = (total ? Math.round((estado.acertos / total) * 100) : 0) + "%";
  $("fim-recorde").hidden = !novoRecorde;

  const estrelasEl = $("fim-estrelas");
  estrelasEl.hidden = emTreino();
  desenharEstrelas(estrelasEl, estrelas, true);
  const proximaMeta = metasDeEstrelas(tema)[estrelas];
  $("fim-meta").textContent = emTreino() || proximaMeta === undefined
    ? ""
    : `Próxima estrela: ${proximaMeta} acertos numa partida.`;

  // próximo nível e atalho para o desafio completo
  const indice = TEMAS.indexOf(tema);
  const temProximo = indice >= 0 && indice < TEMAS.length - 1;
  $("botao-proximo").hidden = !temProximo;
  $("botao-proximo").dataset.tema = temProximo ? TEMAS[indice + 1].id : "";
  $("botao-desafio").hidden = tema === DESAFIO;

  mostrarRevisao();
  mostrarTela("fim");
  if (novoRecorde) {
    tocar("recorde");
    soltarConfete();
  } else {
    tocar("fim");
  }
}

function mostrarRevisao() {
  const lista = $("lista-revisao");
  lista.innerHTML = "";
  $("sem-erros").hidden = estado.revisao.length > 0;

  estado.revisao.forEach(({ carta, tema }) => {
    const item = criar(lista, "li");
    criar(item, "span", "revisao-tema", tema.nome);
    criar(item, "strong", "", carta.texto);
    item.append(" → ");
    criar(item, "span", "revisao-resposta", tema.categorias[carta.resposta]);
    criar(item, "p", "revisao-explicacao", carta.explicacao);
  });
}

function soltarConfete() {
  if (menosMovimento.matches) return;
  const container = $("confete");
  const cores = ["--caixa-1", "--caixa-2", "--caixa-3", "--ouro", "--verde"];
  container.innerHTML = "";
  for (let i = 0; i < 40; i++) {
    const pedaco = criar(container, "i");
    pedaco.style.left = Math.random() * 100 + "%";
    pedaco.style.background = `var(${cores[i % cores.length]})`;
    pedaco.style.animationDelay = Math.random() * 0.6 + "s";
    pedaco.style.animationDuration = 1.8 + Math.random() * 1.4 + "s";
  }
  setTimeout(() => (container.innerHTML = ""), 3600);
}

function voltarAoMenu() {
  pararJogo();
  montarMenu();
  mostrarTela("inicio");
}

function piscarCaixa(indice) {
  const caixa = caixasEl.children[indice];
  if (!caixa) return;
  caixa.classList.add("apertada");
  setTimeout(() => caixa.classList.remove("apertada"), 120);
}

// ---------- Controles ----------
document.querySelectorAll(".dificuldade").forEach((botao) => {
  botao.addEventListener("click", () => escolherDificuldade(botao.dataset.dificuldade));
});

$("hero-desafio").addEventListener("click", () => iniciarJogo(DESAFIO.id));

document.querySelectorAll(".botao-som").forEach((botao) => {
  botao.addEventListener("click", () => {
    somLigado = !somLigado;
    salvar("classifica-som", somLigado ? "1" : "0");
    atualizarBotoesSom();
    tocar("certo");
  });
});

caixasEl.addEventListener("click", (evento) => {
  const caixa = evento.target.closest(".caixa");
  if (!caixa) return;
  if (estado.aguardando) {
    avancar();
  } else {
    responder(Number(caixa.dataset.indice));
  }
});

areaJogo.addEventListener("click", (evento) => {
  if (evento.target.closest("#pausa")) return;
  if (estado.aguardando) avancar();
});

botaoPausa.addEventListener("click", alternarPausa);
$("botao-continuar").addEventListener("click", alternarPausa);
$("botao-encerrar").addEventListener("click", encerrar);
$("botao-repetir").addEventListener("click", () => iniciarJogo(estado.temaId));
$("botao-proximo").addEventListener("click", (evento) => iniciarJogo(evento.currentTarget.dataset.tema));
$("botao-desafio").addEventListener("click", () => iniciarJogo(DESAFIO.id));
$("botao-menu").addEventListener("click", voltarAoMenu);

document.addEventListener("keydown", (evento) => {
  if (!telas.jogo.classList.contains("ativa") || !estado.rodando) return;
  const tecla = evento.key;

  if (tecla === "Escape") return encerrar();
  if (tecla === "p" || tecla === "P") return alternarPausa();

  if (estado.aguardando && (tecla === "Enter" || tecla === " ")) {
    evento.preventDefault();
    return avancar();
  }

  if (!estado.atual || estado.contando) return;
  const n = estado.atual.tema.categorias.length;
  let indice = null;
  if (/^[1-9]$/.test(tecla) && Number(tecla) <= n) indice = Number(tecla) - 1;
  else if (tecla in SETAS[n]) indice = SETAS[n][tecla];
  if (indice === null) return;

  evento.preventDefault();
  if (estado.aguardando) return avancar(); // apertar uma caixa durante a explicação pula para a próxima
  piscarCaixa(indice);
  responder(indice);
});

// trocou de aba no meio do jogo: pausa sozinho
document.addEventListener("visibilitychange", () => {
  if (document.hidden && estado.rodando && estado.cartaCaindo && !estado.pausado && !emTreino()) {
    alternarPausa();
  }
  estado.ultimoTempo = performance.now();
});

// ---------- Início ----------
document.body.appendChild($("confete")); // fora das telas, para cobrir a página inteira
// quem jogou a versão anterior tinha "modo"; o treino continua valendo
const dificuldadeSalva = ler("classifica-dificuldade", ler("classifica-modo", "normal"));
atualizarBotoesSom();
escolherDificuldade(dificuldadeSalva);
