// Service Worker for ReviseIt push notifications + alarm sound

self.addEventListener('push', function (event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'ReviseIt Reminder';
  const options = {
    body: data.body || 'Time to revise a problem!',
    icon: data.icon || '/logo192.png',
    badge: data.badge || '/logo192.png',
    data: { url: data.url || '/today', sound: data.sound || false },
    vibrate: [200, 100, 200, 100, 200],
    requireInteraction: true,
  };
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          client.navigate(event.notification.data.url || '/today');
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data.url || '/today');
    })
  );
});
