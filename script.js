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
