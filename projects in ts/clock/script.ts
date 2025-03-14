const clockText = document.querySelector("h1") as HTMLElement;
if (!clockText) {
  throw new Error("Clock element not found");
}

setInterval(() => {
  const time = new Date();
  clockText.textContent = time.toLocaleTimeString();
}, 1000);
