
export function showToast(message, type = "success") {
  const root = document.getElementById("toast-root");
  if (!root) return;

  const toast = document.createElement("div");

  toast.className = `
  px-4 py-3 rounded-lg shadow-lg text-white max-w-xs w-full animate-slideIn 
  ${type === "success" ? "bg-green-600" : ""}
  ${type === "error" ? "bg-red-600" : ""}
  ${type === "warning" ? "bg-yellow-500" : ""}
`;
  toast.innerText = message;
  root.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("animate-slideOut");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
