/* ============================================
   MAIN
   Собирает бегущую ленту компаний из LEDGER_ITEMS
   (см. data/content.js). Список дублируется дважды,
   чтобы анимация зацикливалась без видимого шва.
   ============================================ */

function buildLedger() {
  const track = document.getElementById('ledger-track');
  if (!track || typeof LEDGER_ITEMS === 'undefined') return;

  const renderOnce = () =>
    LEDGER_ITEMS.map(
      (name) => `<span class="ledger__item"><span class="dot">●</span>${name}</span>`
    ).join('');

  track.innerHTML = renderOnce() + renderOnce();
}

document.addEventListener('DOMContentLoaded', buildLedger);
