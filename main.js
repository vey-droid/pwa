let deferredPrompt;

if ('serviceWorker' in navigator && 'SyncManager' in window) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('Service Worker registered!', reg);

        if ('sync' in reg) {
          reg.sync.register('sync-order')
            .then(() => {
              console.log('Sync event registered');
            })
            .catch(err => {
              console.error('Sync registration failed:', err);
            });
        }
      })
      .catch(err => {
        console.error('Service Worker registration failed:', err);
      });
  });
} else {
  console.error('Service Worker or SyncManager not supported.');
}

// ADD TO HOME SCREEN SETUP
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault(); // Stop automatic prompt
  deferredPrompt = e;

  const installBtn = document.createElement('button');
  installBtn.textContent = '📲 Install App';
  installBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;padding:10px 20px;background:#4CAF50;color:white;border:none;border-radius:5px;z-index:1000;';
  document.body.appendChild(installBtn);

  installBtn.addEventListener('click', () => {
    installBtn.remove(); // Hide the button
    deferredPrompt.prompt(); // Show prompt

    deferredPrompt.userChoice.then(choice => {
      if (choice.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
