// editar.js

const API_URL = "https://api-gateway-us-central1-397xvf1t.uc.gateway.dev/";
const ENDPOINT_CUSTOMER = "customer-edition";
const ENDPOINT_PROPERTY = "properties-edition";

function salvarCliente(id, dados, callback) {
  const editadoPor = "teste"; // Ajuste conforme necessário
  const payload = Object.keys(dados)
    .filter(
      (field_label) =>
        dados[field_label] !== undefined &&
        dados[field_label] !== null &&
        dados[field_label] !== ""
    )
    .map((field_label) => ({
      customer_id: id,
      field_label,
      value: dados[field_label],
      edited_by: editadoPor,
    }));

  if (payload.length === 0) {
    console.log("Nenhuma alteração detectada.");
    return;
  }

  console.log("Enviando dados para o servidor:", payload);

  fetch(API_URL + ENDPOINT_CUSTOMER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (!response.ok) {
        return response.text().then((text) => {
          throw new Error(text);
        });
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .then((data) => {
      console.log("Resposta do servidor:", data);
      alert("Dados salvos com sucesso!");
      callback();
    })
    .catch((error) => {
      console.error("Erro ao salvar os dados:", error);
      alert("Erro ao salvar os dados.");
    });
}

function salvarImovel(id, dados, callback) {
  console.log("salvarImovel called with id:", id);
  console.log("dados received:", JSON.stringify(dados, null, 2));

  const editadoPor = "teste"; // Ajuste conforme necessário

  // Step 1: Filter and map the payload
  const payload = Object.keys(dados)
    .filter((field_label) => {
      const value = dados[field_label];
      console.log(`Filtering field: ${field_label}, value: ${value}`);
      return value !== undefined && value !== null && value !== "";
    })
    .map((field_label) => {
      const payloadItem = {
        id_imovel: id,
        field_label,
        value: dados[field_label],
        edited_by: editadoPor,
      };
      console.log("Mapping payload item:", payloadItem);
      return payloadItem;
    });

  // Step 2: Check if there are changes to be sent
  if (payload.length === 0) {
    console.log("Nenhuma alteração detectada.");
    return;
  }

  console.log(
    "Enviando dados para o servidor:",
    JSON.stringify(payload, null, 2)
  );

  // Step 3: Make the API request
  fetch(API_URL + ENDPOINT_PROPERTY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      console.log("Server response status:", response);
      if (!response.ok) {
        return response.text().then((text) => {
          console.error("Erro no response:", text);
          throw new Error(text);
        });
      }
      const contentType = response.headers.get("content-type");
      console.log("Response content type:", contentType);
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
      } else {
        return response.text();
      }
    })
    .then((data) => {
      console.log("Resposta do servidor:", data);
      alert("Dados salvos com sucesso!");
      callback();
    })
    .catch((error) => {
      console.error("Erro ao salvar os dados:", error);
      alert("Erro ao salvar os dados.");
    });
}

export { salvarCliente, salvarImovel };
