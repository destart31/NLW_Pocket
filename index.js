const { select, input, checkbox } = require("@inquirer/prompts");
const fs = require("fs").promises;
//<------------------------------------------------------------>
let mensagem = "Bem vindo ao app de metas";

let metas;

// Ler e Salvar as metas criadas em um JSON para que quando siar do programa não sejam perdidas
// Le as metas criadas
const carregarMetas = async () => {
  try {
    const dados = await fs.readFile("metas.json", "utf-8");
    metas = JSON.parse(dados);
  } catch (erro) {
    metas = [];
  }
};

// Escreve as metas criadas no arquivo json
const salvarMetas = async () => {
  await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
};
//<---------------------Cadastro de metas-------------------->
const cadastrarMeta = async () => {
  const meta = await input({ message: "Digite a meta:" });

  if (meta.length == 0) {
    mensagem = "A meta não pode ser vazia.";
    return;
  }

  metas.push({ value: meta, checked: false });

  mensagem = "Meta cadastrada com sucesso!";
};
//<---------------------Listar metas-------------------->

const listarMetas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }
  const respostas = await checkbox({
    message:
      "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o Enter para finalizar essa etapa",
    // "..." a a função de "Espalhar" as metas
    choices: [...metas],
    instructions: false,
  });

  // Para cada "ForEach" só para lembrar
  metas.forEach((m) => {
    m.checked = false;
  });

  if (respostas.length == 0) {
    mensagem = "Nenhuma meta selecionada!";
    return;
  }
  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta;
    });

    meta.checked = true;
  });

  mensagem = "Meta(s) marcadas como concluída(s)";
};
//<---------------------metas realizadas-------------------->

const metasRealizadas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }

  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }
  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });
  if (realizadas.length == 0) {
    mensagem = "Não existe metas realizadas";
    return;
  }

  await select({
    message: "Metas realizadas: " + realizadas.length,
    choices: [...realizadas],
  });
};
//<---------------------deletar metas-------------------->

const deletarMetas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }
  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false };
  });
  const itemsADeletar = await checkbox({
    message: "Selecione item para deletar",
    choices: [...metasDesmarcadas],
    instructions: false,
  });
  if (itemsADeletar.length == 0) {
    mensagem = "Nenhuma item para deletar!";
    return;
  }
  itemsADeletar.forEach((item) => {
    metas = metas.filter((meta) => {
      return meta.value != item;
    });
  });

  mensagem = "Item(s) deletado(s) com sucesso!";
};
//<---------------------mestrar mensagens-------------------->

const mostrarMensagem = () => {
  console.clear();

  if (mensagem != "") {
    console.log(mensagem);
    console.log("");
    mensagem = "";
  }
};
//<---------------------metas em aberto-------------------->

const metasAbertas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }
  const abertas = metas.filter((meta) => {
    // "!meta.checked" é a mesma coisa que "meta.checked != true" no Javascript
    // se a meta não está selecionada [] ela então não é verdadeira
    // se a meta está selecionada [x] ela então é verdadeira
    return !meta.checked;
  });
  if (abertas.length == 0) {
    mensagem = "Não existe metas abertas :)";
    return;
  }
  await select({
    message: "Metas abertas: " + abertas.length,
    choices: [...abertas],
  });
};
//<---------------------start do programa-------------------->

const start = async () => {
  await carregarMetas();

  while (true) {
    mostrarMensagem();
    await salvarMetas();

    const opcao = await select({
      message: "Menu >",
      choices: [
        { name: "Cadastrar meta", value: "cadastrar" },
        { name: "Listar metas", value: "listar" },
        { name: "Metas realizadas", value: "realizadas" },
        { name: "Metas abertas", value: "abertas" },
        { name: "Deletar metas", value: "deletar" },
        { name: "Sair", value: "sair" },
      ],
    });

    switch (opcao) {
      case "cadastrar":
        await cadastrarMeta();
        break;
      case "listar":
        await listarMetas();
        break;
      case "realizadas":
        await metasRealizadas();
        break;
      case "abertas":
        await metasAbertas();
        break;
      case "deletar":
        await deletarMetas();
        break;
      case "sair":
        console.log("Até a próxima!");
        return;
    }
  }
};

start();
