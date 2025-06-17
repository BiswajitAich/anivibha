export const initializeConsoleProtection = (): void => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // Disable right-click
  document.addEventListener('contextmenu', (e: MouseEvent) => {
    e.preventDefault();
  });

  // Block key combinations
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const ctrl = e.ctrlKey;
    const shift = e.shiftKey;

    const blocked =
      e.keyCode === 123 || // F12
      (ctrl && shift && key === 'i') || // DevTools
      (ctrl && shift && key === 'c') || // Inspect
      (ctrl && key === 'u') || // View source
      (ctrl && key === 's'); // Save

    if (blocked) {
      e.preventDefault();
    }
  });

  // Detect DevTools opening
  const threshold = 160;
  let devtools = { open: false, orientation: null };

  if (
    window.outerHeight - window.innerHeight > threshold ||
    window.outerWidth - window.innerWidth > threshold
  ) {
    window.location.href = '/home';
  }

  setInterval(() => {
    if (
      window.outerHeight - window.innerHeight > threshold ||
      window.outerWidth - window.innerWidth > threshold
    ) {
      if (!devtools.open) {
        devtools.open = true;
        window.location.href = '/home';
      }
    } else {
      devtools.open = false;
    }
  }, 500);

  // Override console methods in production
  if (process.env.NODE_ENV === 'production') {
    const noop = (): void => { };
    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;
    console.trace = noop;
    console.table = noop;
    console.clear = noop;
  }

  // Observe for unauthorized scripts
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === Node.ELEMENT_NODE &&
            (node as HTMLElement).tagName === 'SCRIPT'
          ) {
            const script = node as HTMLScriptElement;
            if (!script.src && !script.dataset.allowed) {
              script.remove();
              console.warn('Unauthorized script injection blocked');
              window.location.href = '/home';
            }
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};
