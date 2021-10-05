import { candao } from "../../declarations/candao";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  const name = document.getElementById("name").value.toString();
  // Interact with candao actor, calling the greet method
  const greeting = await candao.greet(name);

  document.getElementById("greeting").innerText = greeting;
});
