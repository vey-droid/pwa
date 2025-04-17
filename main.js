if ('serviceWorker' in navigator && 'SyncManager' in window) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js')
        .then(reg => {
          console.log('Service Worker registered!', reg);
  
          // Register sync event if sync is supported
          if ('sync' in reg) {
            reg.sync.register('sync-order') // Register background sync with tag 'sync-order'
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
  