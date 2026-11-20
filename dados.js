// =====================================================================
// Pistas do jogo: as 16 palavras da Atividade Avaliativa III
// (Arquitetura Computacional, Sprint 3)
//
// Cada carta é uma PISTA e as caixas são as PALAVRAS. Regras das pistas:
//   - no máximo 15 palavras;
//   - não pode conter a resposta, nem parte dela, nem a sigla por extenso;
//   - precisa estar correta segundo o e-book e levar a uma única resposta.
//
// Cada nível tem:
//   categorias: as palavras (caixas), na ordem em que aparecem
//   cartas:     { texto (a pista), resposta, explicacao }
//               resposta = posição da palavra certa (0 = primeira caixa)
// =====================================================================

const TEMAS = [
  // ------------------------------------------------------------------
  {
    id: "dentro-da-cpu",
    capitulo: "Cap. 2.1",
    nome: "Dentro da CPU",
    descricao: "Quem executa, quem calcula, quem manda e quem guarda o dado em uso?",
    categorias: ["CPU", "ULA", "UC", "Registradores"],
    cartas: [
      { texto: "Bloco que busca e executa as instruções do programa.", resposta: 0, explicacao: "CPU: busca e executa as instruções. É formada por ULA, UC e registradores." },
      { texto: "Formada por ULA, UC e registradores.", resposta: 0, explicacao: "A CPU é o conjunto de ULA, UC e registradores." },
      { texto: "Um dos três blocos do computador, ao lado da memória e da entrada e saída.", resposta: 0, explicacao: "Os três blocos são CPU, memória e entrada e saída." },
      { texto: "No Arduino Uno, é o núcleo do ATmega328P, rodando a 16 MHz.", resposta: 0, explicacao: "A CPU do Uno é o núcleo do ATmega328P." },
      { texto: "Repete sem parar o ciclo de busca e execução.", resposta: 0, explicacao: "É a CPU que busca e executa cada instrução, no ritmo do clock." },

      { texto: "Calcula o 4 quando a instrução ADD 2, 2 é executada.", resposta: 1, explicacao: "ULA (Unidade Lógica e Aritmética): faz as contas." },
      { texto: "Faz soma, subtração e as operações AND, OR, XOR e NOT.", resposta: 1, explicacao: "Contas e operações lógicas são o trabalho da ULA." },
      { texto: "Circuito construído a partir de somadores, como o meio somador do Logisim.", resposta: 1, explicacao: "Na escada do livro: porta lógica → meio somador → ULA." },
      { texto: "Na analogia da cozinha, é quem cozinha.", resposta: 1, explicacao: "Na analogia do livro, a ULA cozinha, a UC é o chef e os registradores são a bancada." },
      { texto: "Recebe a ordem da UC e entrega o resultado ao acumulador.", resposta: 1, explicacao: "A ULA calcula o que a UC mandou e o resultado vai para o acumulador." },

      { texto: "Lê cada instrução, descobre o que ela pede e dá as ordens.", resposta: 2, explicacao: "UC (Unidade de Controle): interpreta a instrução e comanda as outras partes." },
      { texto: "Decodifica a instrução e comanda as outras partes da CPU.", resposta: 2, explicacao: "Decodificar e dar as ordens é o papel da UC." },
      { texto: "Na analogia da cozinha, faz o papel de chef.", resposta: 2, explicacao: "Na analogia do livro, a UC é o chef." },
      { texto: "Reconhece que ADD 2, 2 é uma soma e manda a ULA calcular.", resposta: 2, explicacao: "Passo 2 do exemplo do livro: a UC reconhece a soma." },
      { texto: "Parte da CPU que comanda, mas não faz contas.", resposta: 2, explicacao: "Quem faz as contas é a ULA; a UC só dá as ordens." },

      { texto: "Memórias minúsculas dentro da CPU, as mais rápidas do computador.", resposta: 3, explicacao: "Registradores: pequenas memórias coladas na ULA." },
      { texto: "Acumulador, Contador de Programa e o de Instrução são exemplos deles.", resposta: 3, explicacao: "Os três registradores do livro: Acumulador, PC e Registrador de Instrução." },
      { texto: "Guardam o dado que a CPU está usando neste exato momento.", resposta: 3, explicacao: "O dado em uso fica nos registradores, bem perto da ULA." },
      { texto: "Na analogia da cozinha, são a bancada.", resposta: 3, explicacao: "Na analogia do livro, os registradores são a bancada." },
      { texto: "Um deles, o PC, guarda a posição da próxima instrução.", resposta: 3, explicacao: "O Contador de Programa (PC) é um dos registradores." },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "tipos-de-memoria",
    capitulo: "Cap. 5",
    nome: "Tipos de memória",
    descricao: "Memória de trabalho, firmware, configuração ou programa: qual é qual?",
    categorias: ["RAM", "ROM", "EEPROM", "Flash"],
    cartas: [
      { texto: "Memória de trabalho: guarda os programas em execução e seus dados.", resposta: 0, explicacao: "RAM: a memória de trabalho do computador." },
      { texto: "Onde fica a variável que zera quando o Arduino é desligado.", resposta: 0, explicacao: "Variáveis ficam na RAM, que é volátil." },
      { texto: "No Arduino Uno tem 2 KB; no notebook, alguns gigabytes.", resposta: 0, explicacao: "A RAM do Uno tem 2 KB (2.048 bytes)." },
      { texto: "A CPU lê qualquer posição dela no mesmo tempo.", resposta: 0, explicacao: "Por isso o nome: Random Access Memory, memória de acesso aleatório." },
      { texto: "Volátil: perde todo o conteúdo quando a energia acaba.", resposta: 0, explicacao: "Entre RAM, ROM, EEPROM e Flash, só a RAM é volátil." },

      { texto: "Nas primeiras versões, era gravada na fábrica e nunca mais mudava.", resposta: 1, explicacao: "ROM (Read Only Memory): o nome ficou antigo, hoje ela costuma ser feita com Flash." },
      { texto: "Guarda o que o equipamento precisa para começar a funcionar.", resposta: 1, explicacao: "A ROM guarda o firmware de inicialização." },
      { texto: "Onde fica a BIOS ou a UEFI; hoje costuma ser feita com Flash.", resposta: 1, explicacao: "O firmware de inicialização fica na ROM, que hoje quase sempre é Flash." },

      { texto: "Memória não volátil de apenas 1 KB no Arduino Uno.", resposta: 2, explicacao: "O Uno tem EEPROM de 1 KB, além da Flash e da RAM." },
      { texto: "Onde o próprio programa guarda uma configuração que sobrevive ao desligamento.", resposta: 2, explicacao: "Na EEPROM o programa salva dados que não podem sumir." },
      { texto: "Terceira memória do ATmega328P, além da Flash e da RAM.", resposta: 2, explicacao: "Flash (programa), RAM (variáveis) e EEPROM (dados permanentes)." },
      { texto: "Pequena e não volátil: guarda dados do programa, não o programa.", resposta: 2, explicacao: "O programa fica na Flash; os dados permanentes, na EEPROM." },

      { texto: "Guarda o programa do Arduino Uno e tem 32 KB.", resposta: 3, explicacao: "A Flash do Uno tem 32 KB e guarda o programa." },
      { texto: "Mesma tecnologia do pendrive: não volátil e regravável.", resposta: 3, explicacao: "Flash: não volátil, mas pode ser regravada." },
      { texto: "Graças a ela, dá para gravar programas novos no Arduino pela IDE.", resposta: 3, explicacao: "Por ser regravável, a Flash recebe cada programa novo." },
      { texto: "Dos seus 32 KB no Uno, 0,5 KB já vêm ocupados de fábrica.", resposta: 3, explicacao: "Meio KB da Flash guarda o programa que recebe o código pela USB." },
      { texto: "Por ser regravável, permite atualizar o firmware da placa-mãe.", resposta: 3, explicacao: "Hoje o firmware fica em Flash, por isso pode ser atualizado." },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "hierarquia-de-memoria",
    capitulo: "Cap. 5.1",
    nome: "Hierarquia de memória",
    descricao: "As caixas seguem a pirâmide: da mais rápida (1) para a mais lenta (4).",
    categorias: ["Registradores", "Cache", "RAM", "Memória de massa"],
    cartas: [
      { texto: "Topo da pirâmide: poucos bytes, colados na ULA.", resposta: 0, explicacao: "Registradores: o nível mais rápido e menor." },
      { texto: "A camada mais rápida e mais cara por byte.", resposta: 0, explicacao: "Quanto mais perto da CPU, mais rápida e mais cara." },
      { texto: "Fica dentro da CPU e guarda o dado em uso agora.", resposta: 0, explicacao: "O dado que está sendo usado fica nos registradores." },

      { texto: "Guarda cópia do que a CPU usou há pouco, para não ir à RAM.", resposta: 1, explicacao: "A cache evita buscar tudo na RAM, que é mais lenta." },
      { texto: "Camada de KB a MB, entre os registradores e a memória principal.", resposta: 1, explicacao: "Pirâmide: registradores, cache, RAM e memória de massa." },
      { texto: "O ATmega328P do Arduino Uno não tem esta camada.", resposta: 1, explicacao: "O Uno não tem cache: lê direto da Flash e da RAM." },
      { texto: "No nível 1, responde em cerca de 0,5 ns.", resposta: 1, explicacao: "A cache L1 responde em cerca de 0,5 ns; a RAM, em cerca de 100 ns." },
      { texto: "Pequena, muito rápida e volátil, fica dentro do processador.", resposta: 1, explicacao: "A cache fica no processador, logo abaixo dos registradores." },

      { texto: "Memória principal, com alguns GB no notebook.", resposta: 2, explicacao: "A RAM é a memória principal." },
      { texto: "Responde em cerca de 100 ns, 200 vezes mais lenta que a L1.", resposta: 2, explicacao: "100 ns ÷ 0,5 ns = 200 vezes." },
      { texto: "Onde a API do projeto roda, no notebook.", resposta: 2, explicacao: "A leitura do LM35 passa pela RAM do notebook, onde a API roda." },
      { texto: "Fica na placa-mãe e guarda os programas em execução.", resposta: 2, explicacao: "A RAM guarda os programas que estão rodando." },

      { texto: "SSD ou HD.", resposta: 3, explicacao: "Memória de massa é o armazenamento: SSD ou HD." },
      { texto: "Base da pirâmide: centenas de GB a TB.", resposta: 3, explicacao: "A memória de massa é a maior de todas as camadas." },
      { texto: "A única camada não volátil da pirâmide.", resposta: 3, explicacao: "Registradores, cache e RAM perdem tudo sem energia; SSD e HD não." },
      { texto: "Onde o banco de dados guarda a leitura do LM35 para sempre.", resposta: 3, explicacao: "No projeto, a leitura termina no SSD, guardada de forma permanente." },
      { texto: "A camada mais lenta e mais barata por byte.", resposta: 3, explicacao: "Quanto mais longe da CPU, mais lenta, maior e mais barata." },
      { texto: "Guarda arquivos e programas instalados de forma permanente.", resposta: 3, explicacao: "Esse é o papel da memória de massa (SSD ou HD)." },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "barramentos-e-dma",
    capitulo: "Caps. 4 e 6",
    nome: "Barramentos e DMA",
    descricao: "ONDE ler, O QUÊ transportar, ou quem copia sem ocupar a CPU?",
    categorias: ["Address bus", "Data bus", "DMA"],
    cartas: [
      { texto: "Responde à pergunta ONDE? e só sai da CPU.", resposta: 0, explicacao: "Address bus (barramento de endereço): é a CPU que escolhe onde ler ou escrever." },
      { texto: "Fios que levam o número da posição de memória a acessar.", resposta: 0, explicacao: "O endereço é o número da posição que a CPU quer acessar." },
      { texto: "Com 11 fios, alcança 2.048 posições: o tamanho da RAM do Uno.", resposta: 0, explicacao: "Com n fios de endereço existem 2ⁿ posições: 2¹¹ = 2.048." },
      { texto: "Seu número de fios define quantas posições a CPU acessa.", resposta: 0, explicacao: "n fios de endereço = 2ⁿ posições." },
      { texto: "Primeiro passo da leitura: a CPU coloca nele a posição desejada.", resposta: 0, explicacao: "Leitura: endereço → aviso de leitura no controle → conteúdo volta pelo data bus." },

      { texto: "Responde à pergunta O QUÊ? e vai e volta.", resposta: 1, explicacao: "Data bus (barramento de dados): leva o valor, nos dois sentidos." },
      { texto: "Leva o valor lido ou escrito entre a CPU e a memória.", resposta: 1, explicacao: "O valor que está sendo lido ou escrito passa pelo data bus." },
      { texto: "Também leva as instruções da memória até a CPU.", resposta: 1, explicacao: "Instruções e valores entram na CPU pelo mesmo caminho: o data bus." },
      { texto: "Na leitura, a memória coloca nele o conteúdo pedido.", resposta: 1, explicacao: "Passo 3 da leitura: o conteúdo vai para o data bus." },
      { texto: "Seu tamanho não muda quantas posições a CPU alcança.", resposta: 1, explicacao: "Só o address bus entra na conta das posições; o data bus não." },

      { texto: "Um controlador próprio copia entre o dispositivo e a RAM, liberando a CPU.", resposta: 2, explicacao: "DMA (Direct Memory Access): o controlador de DMA faz a cópia." },
      { texto: "A CPU só configura a cópia e recebe um aviso no fim.", resposta: 2, explicacao: "Os três passos do DMA: CPU configura, controlador copia, controlador avisa." },
      { texto: "Placas de rede, som e vídeo usam isso para transferir dados.", resposta: 2, explicacao: "Disco, rede, vídeo e som transferem dados por DMA." },
      { texto: "O ATmega328P não tem; o ESP32 tem.", resposta: 2, explicacao: "No Uno, toda transferência passa pela CPU, porque ele não tem DMA." },
      { texto: "Não dá prioridade a dados importantes: só muda quem faz a cópia.", resposta: 2, explicacao: "Engano comum: o DMA não é um caminho prioritário." },
      { texto: "Permite copiar um vídeo do pendrive enquanto você navega sem travar.", resposta: 2, explicacao: "Com DMA, a CPU delega a cópia e fica livre." },
    ],
  },

  // ------------------------------------------------------------------
  {
    id: "chips-e-nucleos",
    capitulo: "Cap. 3",
    nome: "Microcontrolador e núcleos",
    descricao: "Um computador inteiro num chip, ou quantas unidades de processamento?",
    categorias: ["Microcontrolador", "Dual core", "Quad core"],
    cartas: [
      { texto: "CPU, memória e entrada e saída reunidas num único chip.", resposta: 0, explicacao: "Microcontrolador: um computador completo num chip só." },
      { texto: "O ATmega328P do Arduino Uno é um exemplo.", resposta: 0, explicacao: "Arduino é a placa; o ATmega328P é o microcontrolador." },
      { texto: "Chip barato e de baixo consumo, feito para uma tarefa específica.", resposta: 0, explicacao: "Baixo custo e tarefa específica são marcas do microcontrolador." },
      { texto: "ESP32, PIC e STM32 são exemplos usados na indústria.", resposta: 0, explicacao: "Todos são microcontroladores." },
      { texto: "Comanda a máquina de lavar: escolhe o tempo de cada etapa e liga o motor.", resposta: 0, explicacao: "Eletrodomésticos usam microcontroladores." },
      { texto: "Já traz conversor analógico-digital e comunicação serial embutidos.", resposta: 0, explicacao: "O microcontrolador reúne no chip os circuitos de entrada e saída." },

      { texto: "Processador com duas unidades de processamento independentes no mesmo chip.", resposta: 1, explicacao: "Dual core: dois núcleos num só processador." },
      { texto: "Executa duas tarefas ao mesmo tempo, uma em cada unidade.", resposta: 1, explicacao: "Cada núcleo do dual core executa instruções de forma independente." },
      { texto: "Tem metade das unidades de processamento de um processador de quatro.", resposta: 1, explicacao: "Dual core = 2 núcleos; quad core = 4." },
      { texto: "Dois conjuntos de ULA, UC e registradores trabalhando juntos num chip.", resposta: 1, explicacao: "Cada núcleo tem sua própria ULA, UC e registradores: o dual core tem dois." },

      { texto: "Processador com quatro unidades de processamento independentes no mesmo chip.", resposta: 2, explicacao: "Quad core: quatro núcleos num só processador." },
      { texto: "Executa quatro tarefas ao mesmo tempo, uma em cada unidade.", resposta: 2, explicacao: "Cada núcleo do quad core executa instruções de forma independente." },
      { texto: "Tem o dobro das unidades de processamento de um processador de duas.", resposta: 2, explicacao: "Quad core = 4 núcleos; dual core = 2." },
      { texto: "Quatro conjuntos de ULA, UC e registradores trabalhando juntos num chip.", resposta: 2, explicacao: "Cada núcleo tem sua própria ULA, UC e registradores: o quad core tem quatro." },
    ],
  },
];
