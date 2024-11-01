import { buscarHTML } from "./buscar.js";
import { salvarCliente, salvarImovel } from "./editar.js";
import { renderizarListas } from "./listas.js";
import { dataModule } from "./buscar.js";
import { deParaMap } from "./variaveis/propriedades.js";

let formulario = $("#formulario");

// Function to build the Google Forms URL dynamically based on modified customer data
function buildGoogleFormsUrl(dadosSalvos, dadosModificados) {
  let googleFormsUrl = dadosSalvos.url_forms;
  console.log("Initial Google Forms URL:", googleFormsUrl);
  console.log("Modified fields:", dadosModificados);

  // Iterate over the modified fields and map them to the correct entry in Google Forms
  Object.keys(dadosModificados).forEach((field) => {
    if (deParaMap[field]) {
      const formEntry = deParaMap[field];
      googleFormsUrl = googleFormsUrl.replace(
        new RegExp(`(${formEntry}=[^&]*)`, "i"),
        `${formEntry}=${encodeURIComponent(dadosModificados[field])}`
      );
      console.log(`Updated URL for field "${field}":`, googleFormsUrl);
    }
  });

  return googleFormsUrl;
}

function gerarFormulario(tela, id) {
  // Limpar o formulário antes de renderizar novos campos
  formulario.empty();

  let item;
  let salvarFuncao;
  let template;

  if (tela === "Lista de Clientes") {
    const leads = dataModule.getLeads();
    item = leads.find((lead) => lead.customer_id == id);
    salvarFuncao = salvarCliente;
    template = "form_leads";
    console.log("Item:", item);
  } else if (tela === "Lista de Imóveis") {
    const imoveis = dataModule.getProperties();
    item = imoveis.find((imovel) => imovel.url_imovel == id);
    salvarFuncao = salvarImovel;
    template = "form_properties";
  }

  if (!item) {
    console.error("Item não encontrado para o id:", id);
    return;
  }

  const data = {
    template: template,
    obj: item,
  };

  buscarHTML(data)
    .then((htmlResponse) => {
      console.log("HTML Response:", htmlResponse);

      // Renderizar o HTML recebido no contêiner do formulário
      formulario.html(htmlResponse);

      // Atualiza os selects
      formulario.find("select").each(function () {
        const name = $(this).attr("name");
        const value = item[name];

        if (value !== undefined && value !== null) {
          $(this)
            .find("option")
            .each(function () {
              if (
                $(this).val().toLowerCase().trim() ===
                value.toLowerCase().trim()
              ) {
                $(this).prop("selected", true);
              }
            });
        }
      });

      // Atualiza os campos de texto e textarea
      formulario.find('input[type="text"], textarea').each(function () {
        const name = $(this).attr("name");
        const value = item[name];

        if (value !== undefined && value !== null) {
          $(this).val(value);
        }
      });

      // Atualiza os checkboxes
      formulario.find('input[type="checkbox"]').each(function () {
        const name = $(this).attr("name");
        const value = item[name];

        if (value && typeof value === "string") {
          const selectedValues = value
            .split(",") // Safe to split because value is a string
            .map((val) => val.trim().toLowerCase());
          if (selectedValues.includes($(this).val().toLowerCase())) {
            $(this).prop("checked", true);
          }
        } else if (typeof value === "boolean") {
          // If value is a boolean, handle it accordingly
          $(this).prop("checked", value);
        } else if (value !== undefined && value !== null) {
          // Convert other types to string and handle accordingly
          const selectedValues = value
            .toString()
            .split(",")
            .map((val) => val.trim().toLowerCase());
          if (selectedValues.includes($(this).val().toLowerCase())) {
            $(this).prop("checked", true);
          }
        }
      });

      // Adicionar botão de salvar no final do formulário
      console.log("Appending Salvar button for", tela);
      formulario.append(
        '<div class="button-container"><button type="button" id="salvarAnuncio">Enviar Anuncio</button><button type="button" id="salvar">Salvar</button></div>'
      );
      console.log("Salvar button appended");

      // Adicionar evento de clique para o botão de salvar
      $("#salvar").on("click", function () {
        const dadosModificados = {};
        let dadosSalvos;

        // Coletar dados salvos dependendo da tela
        if (tela === "Lista de Clientes") {
          dadosSalvos = dataModule
            .getLeads()
            .find((lead) => lead.customer_id == id);
        } else if (tela === "Lista de Imóveis") {
          dadosSalvos = dataModule
            .getProperties()
            .find((imovel) => imovel.url_imovel == id);
        } else {
          console.error("Tela desconhecida:", tela);
          return;
        }

        // Coletar dados do formulário
        formulario.find("[name]").each(function () {
          const name = $(this).attr("name");
          let value;

          if ($(this).is(":checkbox")) {
            const selectedCheckboxes = formulario
              .find(`input[name="${name}"]:checked`)
              .map(function () {
                return $(this).val();
              })
              .get();
            value = selectedCheckboxes.join(", ");
          } else {
            value = $(this).val() !== null ? $(this).val().toString() : "";
          }
          console.log("value: ", value);

          value = value.toLowerCase();

          let savedValue =
            dadosSalvos[name] !== undefined && dadosSalvos[name] !== null
              ? dadosSalvos[name].toString().toLowerCase()
              : "";

          if (typeof savedValue === "string" && savedValue.includes("http")) {
            const url = new URL(savedValue);
            savedValue = url.href;
          }

          if (value !== savedValue) {
            dadosModificados[name] = value;
          }
        });

        if (Object.keys(dadosModificados).length === 0) {
          console.log("Nenhum campo foi modificado.");
          return;
        }

        console.log("Campos modificados:", dadosModificados);
        $(".loadingScreen").css("display", "block");

        salvarFuncao(id, dadosModificados, () => {
          Object.keys(dadosModificados).forEach((key) => {
            dadosSalvos[key] = dadosModificados[key];
          });

          $(".formularios").css("display", "none");

          if (tela === "Lista de Clientes") {
            renderizarListas(tela, { data: dataModule.getLeads() });
          } else if (tela === "Lista de Imóveis") {
            renderizarListas(tela, { data: dataModule.getProperties() });
          }
          $(".loadingScreen").css("display", "none");
        });
      });

      // Adicionar evento de clique para o botão de enviar anuncio
      $("#salvarAnuncio").on("click", function () {
        console.log("entrou dentro do event listener salvarAnuncio ");
        const dadosModificados = {};
        let dadosSalvos;
        console.log("Saving data for screen:", tela);

        // Coletar dados salvos dependendo da tela
        if (tela === "Lista de Clientes") {
          dadosSalvos = dataModule
            .getLeads()
            .find((lead) => lead.customer_id == id);
        } else if (tela === "Lista de Imóveis") {
          dadosSalvos = dataModule
            .getProperties()
            .find((imovel) => imovel.url_imovel == id);
        } else {
          console.error("Tela desconhecida:", tela);
          return;
        }

        // Collect modified form data
        formulario.find("[name]").each(function () {
          const name = $(this).attr("name");
          let value;

          // Handle checkboxes (multiple selection)
          if ($(this).is(":checkbox")) {
            const selectedCheckboxes = formulario
              .find(`input[name="${name}"]:checked`)
              .map(function () {
                return $(this).val();
              })
              .get();
            value = selectedCheckboxes.join(", ");
          } else {
            value = $(this).val() !== null ? $(this).val().toString() : "";
          }

          console.log("value: ", value);

          // Ensure value is processed correctly
          value = value.toLowerCase();

          let savedValue =
            dadosSalvos[name] !== undefined && dadosSalvos[name] !== null
              ? dadosSalvos[name].toString().toLowerCase()
              : "";

          // Handle URL in saved value
          if (typeof savedValue === "string" && savedValue.includes("http")) {
            const url = new URL(savedValue);
            savedValue = url.href;
          }

          // If value has changed, store it in the modified data
          if (value !== savedValue) {
            dadosModificados[name] = value;
          }
        });

        console.log("Modified data:", dadosModificados);

        if (Object.keys(dadosModificados).length === 0) {
          console.log("No fields were modified.");
          return;
        }

        // Generate the updated Google Forms URL
        const updatedGoogleFormsUrl = buildGoogleFormsUrl(
          dadosSalvos,
          dadosModificados
        );
        console.log("Final Google Forms URL:", updatedGoogleFormsUrl);

        // Handle multiple selection fields for Google Forms URL
        Object.keys(dadosModificados).forEach((field) => {
          const entry = deParaMap.find((map) => map.label === field);

          if (entry && entry.field_type === "Múltipla Seleção") {
            // For multiple selection, append each value to the URL
            const selectedValues = dadosModificados[field].split(", ");
            selectedValues.forEach((val) => {
              updatedGoogleFormsUrl += `&${entry.entry_id}=${encodeURIComponent(
                val
              )}`;
            });
          }
        });

        console.log(
          "Google Forms URL with multiple selections:",
          updatedGoogleFormsUrl
        );

        // Redirect to the updated Google Forms URL
        window.location.href = updatedGoogleFormsUrl;
      });
    })
    .catch((error) => {
      console.error("Erro ao buscar o HTML do formulário:", error);
    });
}

export { gerarFormulario };
