/**
 * Firebase Messaging Service Worker
 * ----------------------------------
 * Handles background push notifications when the app is not in focus.
 * This file MUST be at the root of the public directory.
 */

/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBnwb6mxzoM1r1bBchLCrdiuCGQ91kpJ9o",
  authDomain: "liebherr-task-tracker.firebaseapp.com",
  databaseURL: "https://liebherr-task-tracker-default-rtdb.firebaseio.com",
  projectId: "liebherr-task-tracker",
  storageBucket: "liebherr-task-tracker.firebasestorage.app",
  messagingSenderId: "816042448668",
  appId: "1:816042448668:web:2a634879c94189109f8cd9",
  measurementId: "G-Q97FNCPDP4",
});

// Get messaging instance
const messaging = firebase.messaging();

/**
 * Handle background messages
 * This fires when the app tab is not active/focused
 */
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);

  const notificationTitle = payload.notification?.title || payload.data?.title || "Liebherr Task Tracker";
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.message || "You have a new notification",
    icon: "/favicon.ico",
    badge: "/favicon.ico",
    tag: "liebherr-notification",
    data: payload.data,
    vibrate: [100, 50, 100],
    actions: [
      { action: "open", title: "Open App" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

/**
 * Handle notification click — open the app when user clicks the notification
 */
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked:", event);
  event.notification.close();

  // Focus existing window or open new one
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
