// DOM要素の取得
const dropZone = document.getElementById('drop-zone');
const previewZone = document.getElementById('preview-zone');
const downloadBtn = document.getElementById('download-btn');
let currentCanvas = null;

// WebP変換用のDOM要素
const webpDropZone = document.getElementById('webp-drop-zone');
const webpPreviewZone = document.getElementById('webp-preview-zone');
const webpDownloadBtn = document.getElementById('webp-download-btn');
let webpCanvas = null;

// ドラッグ&ドロップのイベント処理（正方形化ツール）
dropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', (e) => {
  dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleImage(files[0]);
  }
});

// WebP変換用のドラッグ&ドロップイベント処理
webpDropZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  webpDropZone.classList.add('drag-over');
});

webpDropZone.addEventListener('dragleave', (e) => {
  webpDropZone.classList.remove('drag-over');
});

webpDropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  webpDropZone.classList.remove('drag-over');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleWebPImage(files[0]);
  }
});

function handleImage(file) {
  if (!file.type.startsWith('image/')) {
    alert('画像ファイルをドロップしてください。');
    return;
  }
  const reader = new FileReader();
  reader.onload = function (evt) {
    const img = new Image();
    img.onload = function () {
      // Canvas作成
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const size = 800;
      canvas.width = size;
      canvas.height = size;
      // 背景を白で塗りつぶし
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);
      // 縦横比を維持して最大サイズを計算
      let destWidth, destHeight;
      if (img.width > img.height) {
        destWidth = size;
        destHeight = Math.round(img.height * (size / img.width));
      } else {
        destHeight = size;
        destWidth = Math.round(img.width * (size / img.height));
      }
      // 中央配置のための座標計算
      const x = Math.round((size - destWidth) / 2);
      const y = Math.round((size - destHeight) / 2);
      ctx.drawImage(img, x, y, destWidth, destHeight);
      // プレビュー表示
      previewZone.innerHTML = '';
      previewZone.appendChild(canvas);
      currentCanvas = canvas;
      // ダウンロードボタン表示
      downloadBtn.style.display = 'inline-block';
      // 画像を自動でダウンロード
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'square-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

// WebP→JPG変換処理
function handleWebPImage(file) {
  if (file.type !== 'image/webp') {
    alert('WebP画像ファイルをドロップしてください。');
    return;
  }
  const reader = new FileReader();
  reader.onload = function (evt) {
    const img = new Image();
    img.onload = function () {
      // Canvas作成（元のサイズを維持）
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      // 画像をそのまま描画
      ctx.drawImage(img, 0, 0);
      // プレビュー表示
      webpPreviewZone.innerHTML = '';
      webpPreviewZone.appendChild(canvas);
      webpCanvas = canvas;
      // ダウンロードボタン表示
      webpDownloadBtn.style.display = 'inline-block';
      // 画像を自動でダウンロード（JPG形式）
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'converted-image.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

// ダウンロードボタンのクリックイベント（正方形化ツール）
downloadBtn.addEventListener('click', () => {
  // #preview-zone 内のcanvas要素を取得
  const canvas = previewZone.querySelector('canvas');
  if (!canvas) return;
  // PNG形式のData URLに変換
  const dataUrl = canvas.toDataURL('image/png');
  // aタグを動的に作成
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'square-image.png';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// WebP変換用ダウンロードボタンのクリックイベント
webpDownloadBtn.addEventListener('click', () => {
  // #webp-preview-zone 内のcanvas要素を取得
  const canvas = webpPreviewZone.querySelector('canvas');
  if (!canvas) return;
  // JPG形式のData URLに変換
  const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
  // aタグを動的に作成
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'converted-image.jpg';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}); 