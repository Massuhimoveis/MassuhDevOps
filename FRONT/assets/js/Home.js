document.addEventListener("DOMContentLoaded", function () {
  const crmCard = document.getElementById("crm-card");

  crmCard.addEventListener("click", function () {
    // Redireciona para a página de listas do CRM
    window.location.href = "crm/listas.html";
  });
});
