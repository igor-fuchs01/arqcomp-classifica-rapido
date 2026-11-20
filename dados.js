// =====================================================================
// Cartas do jogo, tiradas do livro
// "[SP3 MAT3] Tópicos de Arquitetura Computacional" (SPTech)
//
// Cada tema tem:
//   categorias: os nomes das caixas (de 2 a 4), na ordem em que aparecem
//   cartas:     { texto, resposta, explicacao }
//               resposta = posição da categoria certa (0 = primeira caixa)
// =====================================================================

const TEMAS = [
  // ------------------------------------------------------------------
  {
    id: "blocos",
    capitulo: "Cap. 2",
    nome: "Os três blocos do computador",
    descricao: "CPU, memória ou entrada e saída: a qual bloco cada peça pertence?",
    categorias: ["CPU", "Memória", "Entrada e saída"],
    cartas: [
      { texto: "Núcleo do chip ATmega328P", resposta: 0, explicacao: "A CPU do Arduino é o núcleo do ATmega328P." },
      { texto: "Busca e executa as instruções do programa", resposta: 0, explicacao: "Esse é o papel da CPU." },
      { texto: "ULA", resposta: 0, explicacao: "A ULA faz parte da CPU, junto com a UC e os registradores." },
      { texto: "UC", resposta: 0, explicacao: "A Unidade de Controle faz parte da CPU." },
      { texto: "Registradores", resposta: 0, explicacao: "Os registradores são pequenas memórias que ficam dentro da CPU." },
      { texto: "Guarda as instruções e os dados", resposta: 1, explicacao: "Esse é o papel do bloco de memória." },
      { texto: "Memória Flash do ATmega328P", resposta: 1, explicacao: "A Flash guarda o programa do Arduino." },
      { texto: "RAM do ATmega328P", resposta: 1, explicacao: "A RAM guarda as variáveis enquanto o programa roda." },
      { texto: "EEPROM", resposta: 1, explicacao: "A EEPROM é uma memória não volátil de 1 KB no Uno." },
      { texto: "Onde fica o programa armazenado (ideia de von Neumann)", resposta: 1, explicacao: "Para von Neumann, as instruções ficam na mesma memória que os dados." },
      { texto: "Sensor LM35", resposta: 2, explicacao: "O LM35 é um dispositivo de entrada." },
      { texto: "LED", resposta: 2, explicacao: "O LED é um dispositivo de saída." },
      { texto: "Cabo USB", resposta: 2, explicacao: "O cabo USB troca dados com o notebook: entrada e saída." },
      { texto: "Botão ligado num pino digital", resposta: 2, explicacao: "Botões, LEDs e relés ligam-se aos pinos de entrada e saída." },
      { texto: "Troca dados com o mundo de fora", resposta: 2, explicacao: "Esse é o papel do bloco de entrada e saída." },
    ],
  },
];
