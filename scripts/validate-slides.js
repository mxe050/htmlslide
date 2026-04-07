/**
 * validate-slides.js — スライド自動検証スクリプト
 * 生成後のスライドに対してレイアウト・デザインルール違反を自動検出する
 */
function validateSlides(container) {
  const results = [];
  const slides = container.querySelectorAll('.slide');
  const containerRect = container.getBoundingClientRect();

  slides.forEach((slide, idx) => {
    const num = idx + 1;
    // テキストはみ出し検証
    slide.querySelectorAll('*').forEach(el => {
      if (el.scrollWidth > el.clientWidth + 2 || el.scrollHeight > el.clientHeight + 2) {
        if (el.classList.contains('s-bullets') || el.classList.contains('speaker-notes-text')) return;
        results.push({ slide: num, type: 'overflow', severity: 'warning', message: `要素がはみ出しています: <${el.tagName.toLowerCase()}>` });
      }
    });
    // 余白チェック（端から5%以上）
    const sRect = slide.getBoundingClientRect();
    slide.querySelectorAll('.s-title,.s-subtitle,.s-body,.s-bullets').forEach(el => {
      const r = el.getBoundingClientRect();
      const marginLeft = (r.left - sRect.left) / sRect.width * 100;
      const marginRight = (sRect.right - r.right) / sRect.width * 100;
      if (marginLeft < 4 || marginRight < 4) {
        results.push({ slide: num, type: 'margin', severity: 'info', message: `余白が不足: 左${marginLeft.toFixed(1)}% 右${marginRight.toFixed(1)}%` });
      }
    });
    // 箇条書き数チェック（5項目以下）
    const bullets = slide.querySelectorAll('.s-bullets li');
    if (bullets.length > 5) {
      results.push({ slide: num, type: 'bullets', severity: 'warning', message: `箇条書きが${bullets.length}項目（推奨5以下）` });
    }
    // 見出し行数チェック
    const title = slide.querySelector('.s-title');
    if (title) {
      const lineH = parseFloat(getComputedStyle(title).lineHeight) || parseFloat(getComputedStyle(title).fontSize) * 1.3;
      if (title.scrollHeight > lineH * 2.5) {
        results.push({ slide: num, type: 'heading', severity: 'warning', message: '見出しが2行を超えています' });
      }
    }
  });
  return results;
}
