import { candao } from "../../declarations/candao";

document.getElementById("clickMeBtn").addEventListener("click", async () => {
  // Interact with candao actor, calling the greet method
  const greeting = await candao.print();

  document.getElementById("greeting").innerText = greeting;
});
