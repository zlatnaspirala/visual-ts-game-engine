
if ("serviceWorker" in navigator) {
  // Recommended to register onLoad
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("worker.js");
    console.info("log worker");
  });
} else {
  console.warn("VTSGE: No support for web workers in this browser.");
}
