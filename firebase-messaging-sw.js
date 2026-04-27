// firebase-messaging-sw.js
// IMPORTANT: Place this file in the SAME FOLDER as gym-firebase.html
// This enables background push notifications when the browser tab is closed

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDVPaaRLbEv796fxoId0jtXtV1JhrpFdE0",
  authDomain: "abc-gym-4dc17.firebaseapp.com",
  projectId: "abc-gym-4dc17",
  storageBucket: "abc-gym-4dc17.firebasestorage.app",
  messagingSenderId: "377757615025",
  appId: "1:377757615025:web:62ad568230488a82d57390"
});

const messaging = firebase.messaging();

// Handle background messages (tab closed / minimized)
messaging.onBackgroundMessage(function(payload) {
  const title   = (payload.notification && payload.notification.title) || 'ABC 3.0 Gym';
  const body    = (payload.notification && payload.notification.body)  || 'New message from your gym';
  const options = {
    body: body,
    icon: '/icon.png',
    badge: '/icon.png',
    tag: 'abc-gym',
    vibrate: [200, 100, 200],
    requireInteraction: false
  };
  return self.registration.showNotification(title, options);
});

// Click notification → open or focus the app
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) return list[i].focus();
      }
      return clients.openWindow('/');
    })
  );
});
