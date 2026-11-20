// =====================================================================
// Classifica Rápido: as cartas caem e o jogador joga cada uma na caixa certa
// As cartas ficam em dados.js (constante TEMAS)
// =====================================================================

// ---------- Configuração ----------
const VIDAS_INICIAIS = 3;
const PONTOS_POR_ACERTO = 10;
const ACERTOS_POR_NIVEL = 5;        // a cada 5 acertos, sobe um nível (cai mais rápido)
const ACERTOS_POR_MULTIPLICADOR = 5; // a cada 5 acertos seguidos, os pontos valem mais
const MULTIPLICADOR_MAXIMO = 4;
const ACELERACAO_POR_NIVEL = 0.88;  // o tempo de queda vira 88% a cada nível
const TEMPO_MINIMO_QUEDA = 2.5;     // segundos
const TEMPO_FEEDBACK_CERTO = 600;   // ms (modo normal)
const TEMPO_FEEDBACK_TREINO = 2200; // ms (acerto no modo treino, para dar tempo de ler)

// teclas mostradas em cada caixa e setas aceitas, conforme o número de caixas
const TECLAS_VISIVEIS = { 2: ["←", "→"], 3: ["←", "↓", "→"], 4: ["1", "2", "3", "4"] };
const SETAS = {
  2: { ArrowLeft: 0, ArrowRight: 1 },
  3: { ArrowLeft: 0, ArrowDown: 1, ArrowRight: 2 },
  4: {},
};

// tema especial que mistura as cartas de todos os outros
const DESAFIO = {
  id: "desafio",
  capitulo: "Todos os capítulos",
  nome: "Desafio final",
  descricao: "Cartas de todos os temas misturadas. Atenção: as caixas mudam a cada carta!",
};

// ---------- Elementos da página ----------
const $ = (id) => document.getElementById(id);
const telas = { inicio: $("tela-inicio"), jogo: $("tela-jogo"), fim: $("tela-fim") };
const listaTemas = $("lista-temas");
const areaJogo = $("area-jogo");
const cartaEl = $("carta");
const cartaTema = $("carta-tema");
const cartaTexto = $("carta-texto");
const feedback = $("feedback");
const caixasEl = $("caixas");
const pausaEl = $("pausa");
const botaoPausa = $("botao-pausa");

// ---------- Estado do jogo ----------
const estado = {
  modo: "normal",       // "normal" ou "treino"
  temaId: null,
  baralho: [],          // lista de { carta, tema }
  atual: null,          // { carta, tema } que está na tela
  temaDasCaixas: null,  // tema cujas caixas estão desenhadas
  cartaCaindo: false,   // true enquanto o jogador pode responder
  aguardando: false,    // true enquanto mostra a explicação, antes da próxima carta
  pausado: false,
  posY: 0,
  tempoQueda: 6,        // segundos para a carta atual chegar ao fim
  pontos: 0,
  vidas: VIDAS_INICIAIS,
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

const lerRecorde = (temaId) => Number(ler("classifica-recorde-" + temaId, 0)) || 0;
const salvarRecorde = (temaId, pontos) => salvar("classifica-recorde-" + temaId, pontos);

function buscarTema(id) {
  return id === DESAFIO.id ? DESAFIO : TEMAS.find((tema) => tema.id === id);
}

function montarBaralho(temaId) {
  const temas = temaId === DESAFIO.id ? TEMAS : [buscarTema(temaId)];
  return embaralhar(temas.flatMap((tema) => tema.cartas.map((carta) => ({ carta, tema }))));
}

const emTreino = () => estado.modo === "treino";
const nivelAtual = () => 1 + Math.floor(estado.acertos / ACERTOS_POR_NIVEL);
const multiplicador = () =>
  Math.min(1 + Math.floor(estado.sequencia / ACERTOS_POR_MULTIPLICADOR), MULTIPLICADOR_MAXIMO);

function mostrarTela(nome) {
  Object.values(telas).forEach((tela) => tela.classList.remove("ativa"));
  telas[nome].classList.add("ativa");
  window.scrollTo(0, 0);
}

// ---------- Som (Web Audio, sem arquivos) ----------
let somLigado = ler("classifica-som", "1") === "1";
let audio = null;

const NOTAS = {
  certo: [660, 880],
  errado: [220, 165],
  nivel: [523, 659, 784],
  fim: [392, 330, 262],
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
function escolherModo(modo) {
  estado.modo = modo;
  salvar("classifica-modo", modo);
  document.querySelectorAll(".modo").forEach((botao) => {
    botao.setAttribute("aria-checked", String(botao.dataset.modo === modo));
  });
}

function montarMenu() {
  listaTemas.innerHTML = "";

  [...TEMAS, DESAFIO].forEach((tema) => {
    const botao = criar(listaTemas, "button", "botao-tema" + (tema === DESAFIO ? " desafio" : ""));
    botao.type = "button";
    botao.addEventListener("click", () => iniciarJogo(tema.id));

    criar(botao, "span", "tema-capitulo", tema.capitulo);
    criar(botao, "span", "tema-nome", tema.nome);
    criar(botao, "span", "tema-descricao", tema.descricao);

    if (tema.categorias) {
      const linha = criar(botao, "span", "tema-categorias");
      tema.categorias.forEach((nome, i) => {
        criar(linha, "span", "etiqueta", nome).style.background = `var(--caixa-${i + 1})`;
      });
    }

    const total = tema === DESAFIO
      ? TEMAS.reduce((soma, t) => soma + t.cartas.length, 0)
      : tema.cartas.length;
    criar(botao, "span", "tema-recorde", `${total} cartas · Recorde: ${lerRecorde(tema.id)}`);
  });
}

// ---------- Fluxo do jogo ----------
function iniciarJogo(temaId) {
  clearTimeout(estado.timer);
  cancelAnimationFrame(estado.idLoop);

  Object.assign(estado, {
    temaId,
    baralho: montarBaralho(temaId),
    atual: null,
    temaDasCaixas: null,
    cartaCaindo: false,
    aguardando: false,
    pausado: false,
    posY: 0,
    pontos: 0,
    vidas: VIDAS_INICIAIS,
    sequencia: 0,
    acertos: 0,
    erros: 0,
    revisao: [],
    rodando: true,
  });

  $("nome-tema").textContent = buscarTema(temaId).nome + (emTreino() ? " · Treino" : "");
  pausaEl.hidden = true;
  botaoPausa.textContent = "⏸ Pausar";
  botaoPausa.hidden = emTreino(); // no treino a carta não cai, então não há o que pausar

  atualizarHud();
  mostrarTela("jogo");
  proximaCarta();

  estado.ultimoTempo = performance.now();
  estado.idLoop = requestAnimationFrame(loop);
}

function proximaCarta() {
  // quando o baralho acaba, embaralha tudo de novo
  if (estado.baralho.length === 0) estado.baralho = montarBaralho(estado.temaId);

  estado.atual = estado.baralho.pop();
  const { carta, tema } = estado.atual;

  desenharCaixas(tema);
  cartaEl.classList.remove("saindo");
  cartaTema.textContent = estado.temaId === DESAFIO.id ? tema.nome : "";
  cartaTexto.textContent = carta.texto;

  estado.posY = emTreino() ? 16 : 0;
  estado.tempoQueda = calcularTempoQueda(carta, tema);
  posicionarCarta();

  feedback.classList.remove("visivel");
  areaJogo.classList.remove("flash-certo", "flash-errado");
  estado.aguardando = false;
  estado.cartaCaindo = true;
}

// textos longos e mais caixas dão mais tempo; cada nível acelera
function calcularTempoQueda(carta, tema) {
  let base = 4.5 + carta.texto.length * 0.06 + (tema.categorias.length - 2) * 1.2;
  if (estado.temaId === DESAFIO.id) base += 1; // as caixas mudam, precisa de tempo para ler
  return Math.max(base * Math.pow(ACELERACAO_POR_NIVEL, nivelAtual() - 1), TEMPO_MINIMO_QUEDA);
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

function alturaUtil() {
  return Math.max(areaJogo.clientHeight - cartaEl.offsetHeight - 4, 0);
}

function posicionarCarta(deslocamentoX = 0) {
  cartaEl.style.transform = `translate(calc(-50% + ${deslocamentoX}px), ${estado.posY}px)`;
}

function loop(agora) {
  if (!estado.rodando) return;

  // segundos desde o último quadro (limitado para a carta não "teletransportar" se o navegador travar)
  const dt = Math.min((agora - estado.ultimoTempo) / 1000, 0.1);
  estado.ultimoTempo = agora;

  if (estado.cartaCaindo && !estado.pausado && !emTreino()) {
    const limite = alturaUtil();
    estado.posY += (limite / estado.tempoQueda) * dt;

    if (estado.posY >= limite) {
      estado.posY = limite;
      posicionarCarta();
      errar(null); // tempo esgotado
    } else {
      posicionarCarta();
    }
  }

  estado.idLoop = requestAnimationFrame(loop);
}

function responder(indice) {
  if (!estado.cartaCaindo || estado.pausado) return;
  if (indice >= estado.atual.tema.categorias.length) return;

  voarParaCaixa(indice);
  if (indice === estado.atual.carta.resposta) {
    acertar();
  } else {
    errar(indice);
  }
}

// a carta voa até a caixa escolhida
function voarParaCaixa(indice) {
  const caixa = caixasEl.children[indice];
  const area = areaJogo.getBoundingClientRect();
  const alvo = caixa.getBoundingClientRect();
  const deslocamentoX = alvo.left + alvo.width / 2 - (area.left + area.width / 2);

  cartaEl.classList.add("saindo");
  estado.posY = areaJogo.clientHeight;
  posicionarCarta(deslocamentoX);
}

function acertar() {
  estado.cartaCaindo = false;
  estado.acertos++;
  estado.sequencia++;

  const mult = multiplicador();
  const ganho = PONTOS_POR_ACERTO * mult;
  estado.pontos += ganho;

  let mensagem = `✓ Certo! +${ganho}`;
  const subiuNivel = !emTreino() && estado.acertos % ACERTOS_POR_NIVEL === 0;

  if (subiuNivel) {
    mensagem += ` · Nível ${nivelAtual()}, mais rápido!`;
    tocar("nivel");
  } else {
    tocar("certo");
  }

  // no treino, também mostra a explicação para fixar o conteúdo
  if (emTreino()) mensagem += " " + estado.atual.carta.explicacao;

  atualizarHud();
  mostrarFeedback(true, mensagem, emTreino());
  esperarParaAvancar(emTreino() ? TEMPO_FEEDBACK_TREINO : TEMPO_FEEDBACK_CERTO);
}

// indiceEscolhido = null quando o tempo acabou
function errar(indiceEscolhido) {
  estado.cartaCaindo = false;
  estado.erros++;
  estado.sequencia = 0;
  if (!emTreino()) estado.vidas--;

  const { carta, tema } = estado.atual;
  if (indiceEscolhido === null) cartaEl.classList.add("saindo");
  guardarParaRevisao(carta, tema);

  const inicio = indiceEscolhido === null ? "⏱ Tempo esgotado!" : "✗ Errou!";
  const mensagem = `${inicio} Resposta certa: ${tema.categorias[carta.resposta]}. ${carta.explicacao}`;

  tocar("errado");
  atualizarHud();
  mostrarFeedback(false, mensagem, true);

  // no treino espera o jogador; no normal avança sozinho depois de dar tempo de ler
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

  if (!emTreino() && estado.vidas <= 0) {
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
  areaJogo.classList.add(certo ? "flash-certo" : "flash-errado");
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
  $("hud-vidas").textContent = emTreino()
    ? "∞"
    : "❤️".repeat(Math.max(estado.vidas, 0)) + "🖤".repeat(VIDAS_INICIAIS - Math.max(estado.vidas, 0));
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
  let novoRecorde = false;
  if (!emTreino() && estado.pontos > lerRecorde(tema.id)) {
    salvarRecorde(tema.id, estado.pontos);
    novoRecorde = true;
  }

  const total = estado.acertos + estado.erros;
  $("fim-tema").textContent = tema.nome + (emTreino() ? " · modo treino (recorde não conta)" : "");
  $("fim-pontos").textContent = estado.pontos;
  $("fim-acertos").textContent = estado.acertos;
  $("fim-erros").textContent = estado.erros;
  $("fim-precisao").textContent = (total ? Math.round((estado.acertos / total) * 100) : 0) + "%";
  $("fim-recorde").hidden = !novoRecorde;

  mostrarRevisao();
  tocar("fim");
  mostrarTela("fim");
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
