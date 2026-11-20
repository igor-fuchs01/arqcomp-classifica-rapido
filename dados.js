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

  // ------------------------------------------------------------------
  {
    id: "cpu",
    capitulo: "Cap. 2.1",
    nome: "Quem faz o quê na CPU?",
    descricao: "ULA, UC ou registradores: quem calcula, quem manda e quem guarda?",
    categorias: ["ULA", "UC", "Registradores"],
    cartas: [
      { texto: "Calcula 2 + 2 = 4", resposta: 0, explicacao: "Quem faz as contas é a ULA (Unidade Lógica e Aritmética)." },
      { texto: "Faz soma e subtração", resposta: 0, explicacao: "As operações aritméticas são da ULA." },
      { texto: "Faz AND, OR, XOR e NOT", resposta: 0, explicacao: "As operações lógicas também são da ULA." },
      { texto: "Montada com circuitos parecidos com o meio somador", resposta: 0, explicacao: "Na escada: porta lógica → meio somador → ULA." },
      { texto: "Quem \"cozinha\" na cozinha da CPU", resposta: 0, explicacao: "Na analogia do livro, a ULA cozinha, a UC é o chef e os registradores são a bancada." },
      { texto: "Lê cada instrução e descobre o que ela pede", resposta: 1, explicacao: "Esse é o trabalho da Unidade de Controle." },
      { texto: "Envia as ordens para as outras partes", resposta: 1, explicacao: "A UC comanda: ela diz para a ULA o que fazer." },
      { texto: "Reconhece que ADD 2, 2 é uma soma", resposta: 1, explicacao: "Passo 2 do exemplo: a UC reconhece a soma e ordena à ULA que some." },
      { texto: "O \"chef\" da cozinha da CPU", resposta: 1, explicacao: "Na analogia do livro, a UC é o chef." },
      { texto: "Descobre se a instrução pede uma conta, mover um dado ou ler um sensor", resposta: 1, explicacao: "A UC interpreta a instrução e manda fazer o que ela pede." },
      { texto: "Acumulador", resposta: 2, explicacao: "O Acumulador é o registrador que recebe o resultado da ULA." },
      { texto: "Contador de Programa (PC)", resposta: 2, explicacao: "O PC é o registrador que guarda o endereço da próxima instrução." },
      { texto: "Registrador de Instrução", resposta: 2, explicacao: "Ele guarda a instrução que está sendo executada agora." },
      { texto: "Guarda o dado que está sendo usado agora", resposta: 2, explicacao: "Os registradores guardam o dado em uso, bem perto da ULA." },
      { texto: "A memória mais rápida e a menor do computador", resposta: 2, explicacao: "Os registradores ficam colados na ULA e guardam poucos bytes." },
      { texto: "A \"bancada\" da cozinha da CPU", resposta: 2, explicacao: "Na analogia do livro, os registradores são a bancada." },
    ],
  },
];
