
// Скачивает SVG-график (из ref) как PNG.

export function downloadChartAsPng(chartContainerRef, filename = 'chart.png') {
  const chartNode = chartContainerRef?.current;
  if (!chartNode) return;

  const svg = chartNode.querySelector('svg');
  if (!svg) return;

  const svgData = new XMLSerializer().serializeToString(svg);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = () => {
    canvas.width = svg.clientWidth || 800;
    canvas.height = svg.clientHeight || 400;

    // Белый фон (иначе PNG будет прозрачным)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const a = document.createElement('a');
    a.download = filename;
    a.href = canvas.toDataURL('image/png');
    a.click();
  };

  img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
}