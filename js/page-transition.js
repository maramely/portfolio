/* ============================================
   PAGE TRANSITIONS — the browser's own View
   Transitions between this site's pages (opt-in
   and timing in css/style.css). Loaded in <head>
   so the 'pagereveal' handler is in place before
   the new page's first frame.

   - The header gets its own snapshot only during
     a transition, so it is swapped at once instead
     of fading with the content. Not kept on: a
     view-transition-name would cut the header's
     glass bar off from the page behind it.
   - Back / forward: no transition, the scroll
     restore in js/main.js stays as it is.
   - The new page's first frame waits until it is
     parsed (<link rel="expect"> in <head>); in that
     frame js/main.js takes html.is-booting off, so
     the page never fades in from an empty background.
   Browsers without View Transitions: nothing here
   runs, links work as before.
   ============================================ */

(function () {
  if (!('PageRevealEvent' in window)) return;

  var NAME = 'site-header';
  var header = function () { return document.querySelector('.nav'); };
  var ignore = function () {};

  function isTraverse(activation) {
    if (activation) return activation.navigationType === 'traverse';
    var nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    return !!nav && nav.type === 'back_forward';
  }

  function skip(transition) {
    transition.ready.catch(ignore); // a skipped transition rejects 'ready'
    transition.skipTransition();
  }

  function name(nav, transition) {
    transition.ready.catch(ignore);
    if (!nav) return;
    nav.style.viewTransitionName = NAME;
    transition.finished.finally(function () { nav.style.viewTransitionName = ''; });
  }

  // the page being left
  window.addEventListener('pageswap', function (e) {
    if (!e.viewTransition) return;
    if (isTraverse(e.activation)) return skip(e.viewTransition);
    name(header(), e.viewTransition);
  });

  // the page being shown
  window.addEventListener('pagereveal', function (e) {
    // a page back from the back / forward cache may still carry the name
    var nav = header();
    if (nav) nav.style.viewTransitionName = '';
    if (!e.viewTransition) return;
    // still parsing (the expect link timed out): js/main.js hasn't shown
    // the page yet, so it would fade in from nothing — load it the usual way
    if (isTraverse(window.navigation && navigation.activation) || document.readyState === 'loading') {
      return skip(e.viewTransition);
    }
    name(nav, e.viewTransition);
  });
})();
