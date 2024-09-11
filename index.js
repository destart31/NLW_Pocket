const { select, input, checkbox } = require("@inquirer/prompts");

let meta = {
  value: "Tomar 3L de água por dia",
  checked: false,
};

let metas = [meta];

const cadastrarMeta = async () => {
  const meta = await input({ message: "Digite a meta:" });

  if (meta.length == 0) {
    console.log("A meta não pode ser vazia.");
    return;
  }

  metas.push({ value: meta, checked: false });
};

const listarMetas = async () => {
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
    console.log("Nenhuma meta selecionada!");
    return;
  }
  respostas.forEach((resposta) => {
    const meta = metas.find((m) => {
      return m.value == resposta;
    });

    meta.checked = true;
  });

  console.log("Meta(s) marcadas como concluída(s)");
};

const metasRealizadas = async () => {
  if (metas.length == 0) {
    mensagem = "Não existem metas!";
    return;
  }
  const realizadas = metas.filter((meta) => {
    return meta.checked;
  });
  if (realizadas.length == 0) {
    console.log("Não existe metas realizadas");
    return;
  }

  await select({
    message: "Metas realizadas: " + realizadas.length,
    choices: [...realizadas],
  });
};

const deletarMetas = async () => {
  const metasDesmarcadas = metas.map((meta) => {
    return { value: meta.value, checked: false };
  });
  const itemsADeletar = await checkbox({
    message: "Selecione item para deletar",
    choices: [...metasDesmarcadas],
    instructions: false,
  });
  if (itemsADeletar.length == 0) {
    console.log("Nenhuma item para deletar!");
    return;
  }
  itemsADeletar.forEach((item) => {
    metas = metas.filter((meta) => {
      return meta.value != item;
    });
  });

  console.log("Item(s) deletado(s) com sucesso!");
};

const metasAbertas = async () => {
  const abertas = metas.filter((meta) => {
    // "!meta.checked" é a mesma coisa que "meta.checked != true" no Javascript
    // se a meta não está selecionada [] ela então não é verdadeira
    // se a meta está selecionada [x] ela então é verdadeira
    return !meta.checked;
  });
  if (abertas.length == 0) {
    console.log("Não existe metas abertas :)");
    return;
  }
  await select({
    message: "Metas abertas: " + abertas.length,
    choices: [...abertas],
  });
};

const start = async () => {
  while (true) {
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
        console.log(metas);
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
