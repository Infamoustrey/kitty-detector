let isLoading = false;

async function detect() {
  if (isLoading) return;

  isLoading = true;

  const loader = document.getElementById("loader");
  loader.style.visibility = "visible";

  const button = document.getElementById("detect-button");
  button.disabled = true;

  const response = await fetch("http://localhost:3000/api/cat");
  const json = await response.json();

  const { width, height, base64 } = json;

  const img = new Image();
  img.src = base64;
  img.style.width = width;
  img.style.height = height;

  img.onload = () => {
    const canvas = document.getElementById("myCanvas");

    canvas.style.width = width;
    canvas.style.height = height;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0);

    const cats = kittydar.detectCats(canvas);

    const stat = document.createElement("p");
    stat.innerText = cats.length
      ? "Cats Detected: " + cats.length
      : "Hmmmm.... No kitties detected";

    const stats = document.getElementById("stats");
    while (stats.firstChild) {
      stats.removeChild(stats.firstChild);
    }
    stats.appendChild(stat);

    for (let cat of cats) {
      ctx.beginPath();
      ctx.lineWidth = "5";
      ctx.strokeStyle = "red";
      ctx.rect(cat.x, cat.y, cat.width, cat.height);
      ctx.stroke();
    }
    loader.style.visibility = "hidden";
    isLoading = false;
    button.disabled = false;
  };
}
