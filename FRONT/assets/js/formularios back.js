import {
  fieldForm,
  fieldsClientes,
  fieldsImoveis,
} from "./variaveis/propriedades.js";
import { buscarCampos, dataModule } from "./buscar.js";
import { salvarCliente, salvarImovel } from "./editar.js";
import { renderizarListas } from "./listas.js";

let formulario = $("#formulario");

function gerarFormulario(tela, id) {
  // Limpar o formulário antes de renderizar novos campos
  formulario.empty();

  // Buscar campos
  console.log("Buscando campos para tela:", tela, "com id:", id);
  buscarCampos((data) => {
    console.log("Campos buscados:", data);

    let item;
    let salvarFuncao;
    let camposRelevantes;

    if (tela === "Lista de Clientes") {
      const leads = dataModule.getLeads();
      item = leads.find((lead) => lead.customer_id == id);
      salvarFuncao = salvarCliente;
      camposRelevantes = fieldsClientes;
    } else if (tela === "Lista de Imóveis") {
      const imoveis = dataModule.getProperties();
      item = imoveis.find((imovel) => imovel.url_imovel == id);
      salvarFuncao = salvarImovel;
      camposRelevantes = fieldsImoveis;
    }

    if (!item) {
      console.error("Item não encontrado para o id:", id);
      return;
    }

    // Armazenar valores originais do item
    const valoresOriginais = {};

    // Filtrar campos com base na tela
    const camposFiltrados = camposRelevantes.map((fieldLabel) => {
      return (
        data.find((campo) => campo.field_label === fieldLabel) || {
          field_label: fieldLabel,
          field_type: "string", // Assume "string" type if not found
          field_visible_label: fieldLabel,
        }
      );
    });

    console.log("Campos filtrados para a tela:", tela, camposFiltrados);

    // Gerar formulário com os campos filtrados e preencher os valores
    camposFiltrados.forEach((campo) => {
      if (campo.field_label === "customer_id") {
        return; // Ignorar campo customer_id
      }
      console.log("Renderizando campo:", campo);

      let formElement = $(fieldForm);

      // Definir os atributos do campo
      formElement.attr("data-field-type", campo.field_type);
      formElement.attr("data-variavel", campo.field_label);

      // Definir o label visível
      let labelName = campo.field_visible_label || campo.field_label;
      formElement.find("label").text(labelName);

      // Definir campos obrigatoriamente como booleanos
      const boolFields = [
        "Aceita_Permuta",
        "Aceita_Fgts",
        "Aceita_Financiamento",
        "Reformado",
        "Reforma_Hidraulica",
        "Reforma_Eletrica",
        "Vista_Livre",
      ];

      const boolFieldsAbled = [
        "Fachada_Reformada",
        "Mobiliado",
        "Varanda",
        "Vazado",
        "Dce",
        "Elevador",
        "Gas_Encanado",
      ];

      if (boolFields.includes(campo.field_label)) {
        campo.field_type = "bool";
      }
      // Ensure boolFieldsAbled fields are treated as boolean
      if (boolFieldsAbled.includes(campo.field_label)) {
        campo.field_type = "bool";
      }

      // Configurar o input/select conforme o tipo de campo
      let fieldValue = formElement.find(".field-value");
      fieldValue.empty(); // Limpar qualquer conteúdo existente
      switch (campo.field_type) {
        case "categorical":
          let selectElement = $("<select></select>");
          if (campo.multiple_answers_allowed === "TRUE") {
            selectElement.attr("multiple", "multiple");
          }
          campo.field_options.forEach((option) => {
            let selected =
              item &&
              item[campo.field_label] &&
              item[campo.field_label].includes(option)
                ? "selected"
                : "";
            selectElement.append(
              `<option value="${option}" ${selected}>${option}</option>`
            );
          });
          fieldValue.append(selectElement);
          valoresOriginais[campo.field_label] = selectElement.val();
          break;
        case "string":
          let inputString = `<input type="text" name="${
            campo.field_label
          }" placeholder="${labelName}" value="${
            item ? item[campo.field_label] : ""
          }"/>`;
          fieldValue.append(inputString);
          valoresOriginais[campo.field_label] = item
            ? item[campo.field_label]
            : "";
          break;
        case "numeric":
        case "int":
        case "float":
          let inputNumber = `<input type="number" name="${
            campo.field_label
          }" placeholder="${labelName}" value="${
            item ? item[campo.field_label] : ""
          }"/>`;
          if (campo.field_type === "float") {
            inputNumber = `<input type="number" step="0.01" name="${
              campo.field_label
            }" placeholder="${labelName}" value="${
              item ? item[campo.field_label] : ""
            }"/>`;
          }
          fieldValue.append(inputNumber);
          valoresOriginais[campo.field_label] = item
            ? item[campo.field_label]
            : "";
          break;
        case "datetime":
          let inputDateTime = `<input type="datetime-local" name="${
            campo.field_label
          }" placeholder="${labelName}" value="${
            item ? item[campo.field_label] : ""
          }"/>`;
          fieldValue.append(inputDateTime);
          valoresOriginais[campo.field_label] = item
            ? item[campo.field_label]
            : "";
          break;
        case "bool":
          let value = item ? item[campo.field_label] : "";
          // Normalize the value to a boolean or "undefined"
          value =
            value === "true"
              ? "true"
              : value === "false"
              ? "false"
              : value === null || value === "undefined"
              ? "undefined"
              : value;

          let isDisabled = boolFieldsAbled.includes(campo.field_label)
            ? ""
            : "disabled";

          let checked = false;
          let indeterminate = false;

          switch (value) {
            case "true":
              checked = true;
              indeterminate = false;
              break;
            case "false":
              checked = false;
              indeterminate = false;
              break;
            case "undefined":
            default:
              checked = false;
              indeterminate = true;
              break;
          }

          let inputBool = `
                <label>
                    <input type="checkbox" name="${campo.field_label}" ${
            checked ? "checked" : ""
          } ${isDisabled}>
                    ${
                      checked
                        ? "checked"
                        : indeterminate
                        ? "indeterminate"
                        : "unchecked"
                    }
                </label>
            `;

          fieldValue.append(inputBool);
          valoresOriginais[campo.field_label] = value;

          // Set indeterminate property via JavaScript
          const checkbox = fieldValue.find(
            `input[name="${campo.field_label}"]`
          )[0];
          if (indeterminate) {
            checkbox.indeterminate = true;
          }

          // Update label text on state change
          if (!isDisabled) {
            checkbox.addEventListener("change", function () {
              if (this.indeterminate) {
                this.nextSibling.textContent = "indeterminate";
              } else {
                this.nextSibling.textContent = this.checked
                  ? "checked"
                  : "unchecked";
              }
            });
          }

          break;

        default:
          console.log("Tipo de campo desconhecido:", campo.field_type);
          break;
      }

      // Adicionar o campo ao formulário
      formulario.append(formElement);
      console.log("Campo renderizado:", formElement);
    });

    // Adicionar botão de salvar no final do formulário
    formulario.append('<button type="button" id="salvar">Salvar</button>');

    // Adicionar evento de clique para o botão de salvar
    $("#salvar").on("click", function () {
      const dados = {};
      camposFiltrados.forEach((campo) => {
        const valorAtual = formulario
          .find(`[name="${campo.field_label}"]`)
          .val();
        if (
          valoresOriginais[campo.field_label] != valorAtual &&
          valorAtual !== "" &&
          valorAtual !== null &&
          valorAtual !== undefined
        ) {
          dados[campo.field_label] = valorAtual;
        }
      });
      console.log("Dados para salvar:", dados);
      salvarFuncao(id, dados, () => {
        // Atualizar os dados no dataModule
        Object.keys(dados).forEach((key) => {
          item[key] = dados[key];
        });

        // Fechar o formulário
        $(".formularios").css("display", "none");

        // Atualizar a lista de itens
        if (tela === "Lista de Clientes") {
          renderizarListas(tela, { data: dataModule.getLeads() });
        } else if (tela === "Lista de Imóveis") {
          renderizarListas(tela, { data: dataModule.getProperties() });
        }
      });
    });
  });
  $("select[multiple]").select2({
    width: "100%", // Ajusta a largura do dropdown para 100%
  });
}

export { gerarFormulario };
