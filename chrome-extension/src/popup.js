// IOTA Chrome Extension - Firebase Auth Flow (Manifest V3)
// We use the Identity Toolkit REST API directly to bypass the need for massive JS bundlers in the extension boilerplate.

const API_KEY = "AIzaSyAqQUi-K8uRE0RrgMwjHmzBxGnVey46Ilk";

document.addEventListener("DOMContentLoaded", async () => {
  const connectBtn = document.getElementById("connect-btn");
  const statusText = document.getElementById("status-text");
  const uidText = document.getElementById("uid-text");

  // Check if already authenticated
  chrome.storage.local.get(["firebaseAuthToken", "firebaseUid"], (result) => {
    if (result.firebaseAuthToken && result.firebaseUid) {
      updateUIConnected(result.firebaseUid);
    }
  });

  connectBtn.addEventListener("click", async () => {
    statusText.innerText = "Connecting...";
    connectBtn.innerText = "Authenticating...";
    connectBtn.disabled = true;

    try {
      // 1. Hit the Firebase Identity Toolkit REST API for Anonymous Auth
      // This immediately mints a valid Google-signed JWT token!
      const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnSecureToken: true })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Auth failed");
      }

      // 2. Extract Token and UID
      const idToken = data.idToken;
      const localId = data.localId; // The unique Firebase UID

      // 3. Save to Chrome local storage so content.js can grab it
      chrome.storage.local.set({
        firebaseAuthToken: idToken,
        firebaseUid: localId
      }, () => {
        updateUIConnected(localId);
      });

    } catch (error) {
      console.error("Firebase Auth Error:", error);
      statusText.innerText = "Error: Ensure Anonymous Auth is enabled in Firebase Console";
      statusText.style.color = "red";
      connectBtn.innerText = "Try Again";
      connectBtn.disabled = false;
    }
  });

  function updateUIConnected(uid) {
    statusText.innerText = "Connected & Secured";
    statusText.style.color = "#ffffff";
    connectBtn.innerText = "Wallet Active";
    connectBtn.style.backgroundColor = "#ffffff";
    connectBtn.style.color = "#000000";
    connectBtn.style.pointerEvents = "none";
    uidText.innerText = `UID: ${uid.substring(0, 8)}...`;
  }
});
