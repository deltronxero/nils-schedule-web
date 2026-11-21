self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let title = "Nil's Scheduler";
  let body = 'You have a new schedule update.';
  let url = './';
  let tag = 'nils-schedule-update';

  if (event.data) {
    try {
      const data = event.data.json();
      if (data && typeof data === 'object') {
        if (typeof data.title === 'string' && data.title.trim()) title = data.title.trim();
        if (typeof data.body === 'string' && data.body.trim()) body = data.body.trim();
        if (typeof data.url === 'string' && data.url.trim()) url = data.url.trim();
        if (typeof data.tag === 'string' && data.tag.trim()) tag = data.tag.trim();
      }
    } catch {
      const text = event.data.text();
      if (text && text.trim()) body = text.trim();
    }
  }

  event.waitUntil(
    self.registration
      .showNotification(title, {
        body,
        icon: './app_logo.png',
        badge: './app_logo.png',
        tag,
        renotify: true,
        data: { url },
      })
      .catch(() => self.registration.showNotification(title, { body }))
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification?.data?.url || './';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      if (clients.length > 0) {
        return clients[0].focus();
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
