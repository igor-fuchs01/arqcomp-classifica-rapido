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

  // ------------------------------------------------------------------
  {
    id: "ciclo",
    capitulo: "Cap. 2.2",
    nome: "Busca ou Execução?",
    descricao: "Em qual fase do ciclo cada passo acontece?",
    categorias: ["Busca", "Execução"],
    cartas: [
      { texto: "Buscar a instrução na memória", resposta: 0, explicacao: "É o primeiro passo (fetch) da fase de busca." },
      { texto: "Ler a instrução no endereço indicado pelo PC", resposta: 0, explicacao: "Na busca, a CPU lê a instrução no endereço apontado pelo Contador de Programa." },
      { texto: "Colocar a instrução no Registrador de Instrução", resposta: 0, explicacao: "Na busca, a instrução lida vai para o Registrador de Instrução." },
      { texto: "O PC avança para a próxima instrução", resposta: 0, explicacao: "O PC avança no ciclo de busca, logo depois de a instrução ser lida." },
      { texto: "Fetch", resposta: 0, explicacao: "Fetch = buscar. Faz parte da fase de busca." },
      { texto: "Decodificar: descobrir o que a instrução pede (decode)", resposta: 0, explicacao: "Na versão em quatro passos do livro, buscar e decodificar formam a fase de busca." },
      { texto: "A ULA faz a conta", resposta: 1, explicacao: "Calcular é o passo executar (execute), na fase de execução." },
      { texto: "Execute", resposta: 1, explicacao: "Execute = executar. Faz parte da fase de execução." },
      { texto: "Guardar o resultado num registrador ou na memória (write back)", resposta: 1, explicacao: "Executar e guardar o resultado formam a fase de execução." },
      { texto: "Mover um dado", resposta: 1, explicacao: "Na execução, a UC manda fazer o que a instrução pede: uma conta, mover um dado ou ler um sensor." },
      { texto: "Ler o sensor que a instrução pediu", resposta: 1, explicacao: "Fazer o que a instrução pede é a fase de execução." },
      { texto: "O Acumulador recebe o 4 de ADD 2, 2", resposta: 1, explicacao: "Guardar o resultado (write back) é o último passo da execução." },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "chip",
    capitulo: "Cap. 3",
    nome: "Microprocessador ou Microcontrolador?",
    descricao: "CPU sozinha num chip ou um computador inteiro num chip só?",
    categorias: ["Microprocessador", "Microcontrolador"],
    cartas: [
      { texto: "Intel Core", resposta: 0, explicacao: "O Intel Core é um microprocessador: precisa de RAM e armazenamento fora do chip." },
      { texto: "AMD Ryzen", resposta: 0, explicacao: "O AMD Ryzen é um microprocessador de computadores e notebooks." },
      { texto: "Processador do notebook", resposta: 0, explicacao: "Notebooks usam microprocessadores, que dependem de RAM e SSD externos." },
      { texto: "Servidor", resposta: 0, explicacao: "Computadores, notebooks e servidores usam microprocessadores." },
      { texto: "Precisa de RAM e SSD fora do chip", resposta: 0, explicacao: "O microprocessador tem só a CPU; memória e periféricos ficam fora." },
      { texto: "Depende de uma placa-mãe para ligar tudo", resposta: 0, explicacao: "O microprocessador depende da placa-mãe para se ligar à memória e ao armazenamento." },
      { texto: "Roda qualquer tipo de programa", resposta: 0, explicacao: "Flexibilidade alta é característica do microprocessador." },
      { texto: "Alto consumo de energia", resposta: 0, explicacao: "Microprocessadores consomem mais energia que microcontroladores." },
      { texto: "ATmega328P", resposta: 1, explicacao: "O ATmega328P, o chip do Arduino Uno, é um microcontrolador." },
      { texto: "ESP32", resposta: 1, explicacao: "O ESP32 é um microcontrolador que já vem com Wi-Fi e Bluetooth." },
      { texto: "PIC", resposta: 1, explicacao: "A família PIC é de microcontroladores muito usados na indústria." },
      { texto: "STM32", resposta: 1, explicacao: "A família STM32 é de microcontroladores muito usados na indústria." },
      { texto: "Máquina de lavar", resposta: 1, explicacao: "Tarefa específica e baixo custo: é trabalho para um microcontrolador." },
      { texto: "CPU + memória + entrada e saída no mesmo chip", resposta: 1, explicacao: "Ter tudo num chip só é o que define um microcontrolador." },
      { texto: "Conversor analógico-digital (analogRead) dentro do chip", resposta: 1, explicacao: "O microcontrolador já traz o conversor que transforma a tensão do sensor num número." },
      { texto: "Comunicação serial embutida no chip", resposta: 1, explicacao: "O microcontrolador já traz a comunicação serial, usada para falar com o computador." },
      { texto: "Feito para uma tarefa específica", resposta: 1, explicacao: "O microcontrolador é otimizado para tarefas como ler um sensor ou acender um LED." },
      { texto: "Baixo custo e baixo consumo", resposta: 1, explicacao: "Baixo custo e baixo consumo são marcas do microcontrolador." },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "arduino",
    capitulo: "Cap. 3.1",
    nome: "Arduino Uno: verdadeiro ou falso?",
    descricao: "Os números e os blocos da placa que está na sua bancada.",
    categorias: ["Verdadeiro", "Falso"],
    cartas: [
      { texto: "A entrada recomendada pelo conector de energia é de 7 a 12 V", resposta: 0, explicacao: "Pelo conector, 7 a 12 V; pela USB, 5 V." },
      { texto: "Pela USB, o Uno é alimentado com 5 V", resposta: 0, explicacao: "Pela USB a placa recebe 5 V." },
      { texto: "A placa entrega 5 V e 3,3 V para os circuitos", resposta: 0, explicacao: "A fonte converte a energia de fora nessas duas tensões." },
      { texto: "O clock do Uno é de 16 GHz", resposta: 1, explicacao: "São 16 MHz: 16 milhões de batidas por segundo." },
      { texto: "A memória Flash do Uno tem 32 KB", resposta: 0, explicacao: "Flash de 32 KB, RAM de 2 KB e EEPROM de 1 KB." },
      { texto: "A RAM do Uno tem 2 GB", resposta: 1, explicacao: "A RAM do Uno tem 2 KB (2.048 bytes), não 2 GB." },
      { texto: "A EEPROM do Uno tem 1 KB", resposta: 0, explicacao: "Isso mesmo: 1 KB para dados que sobrevivem ao desligamento." },
      { texto: "O Uno tem 14 pinos digitais e 6 entradas analógicas", resposta: 0, explicacao: "São 14 pinos digitais e 6 entradas analógicas." },
      { texto: "As entradas analógicas vão de A0 a A7", resposta: 1, explicacao: "São 6 entradas: de A0 a A5." },
      { texto: "Os pinos 0 e 1 são usados na comunicação serial", resposta: 0, explicacao: "Eles têm um circuito extra embutido no chip para a serial." },
      { texto: "Todos os 14 pinos digitais conseguem variar o brilho de um LED", resposta: 1, explicacao: "Só 6 pinos digitais conseguem variar a intensidade de um LED." },
      { texto: "0,5 KB da Flash já vem ocupado por um programa de fábrica", resposta: 0, explicacao: "Esse pequeno programa recebe o seu código pela USB." },
      { texto: "\"Arduino\" é o nome do microcontrolador", resposta: 1, explicacao: "Arduino é o nome da placa. O microcontrolador é o ATmega328P." },
      { texto: "Desligar o Arduino apaga o programa gravado", resposta: 1, explicacao: "O programa fica na Flash, que não perde o conteúdo sem energia." },
      { texto: "A EEPROM perde o conteúdo quando a energia acaba", resposta: 1, explicacao: "A EEPROM é não volátil: guarda dados que sobrevivem ao desligamento." },
      { texto: "A faixa recomendada pelo conector de energia é de 12 a 24 V", resposta: 1, explicacao: "A entrada recomendada é de 7 a 12 V." },
      { texto: "O firmware é o programa que você escreve na IDE", resposta: 0, explicacao: "O firmware é o programa gravado no chip, e fica na Flash." },
      { texto: "O conversor analógico-digital trabalha quando você usa analogRead()", resposta: 0, explicacao: "Ele transforma a tensão do sensor em um número." },
    ],
  },
];
