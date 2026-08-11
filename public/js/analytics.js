(function () {
  "use strict";

  var meta = document.querySelector('meta[name="google-analytics-id"]');
  var measurementId = meta && meta.getAttribute("content");
  var productionHost = meta && meta.getAttribute("data-host");
  if (!measurementId || !/^G-[A-Z0-9]{6,20}$/.test(measurementId)) return;
  var isProduction = !productionHost || window.location.hostname === productionHost;
  var storageKey = "utilitas:analytics-consent:" + measurementId;
  var panel = document.querySelector("[data-analytics-consent]");
  var settings = document.querySelector("[data-analytics-settings]");
  var allowButton = document.querySelector("[data-analytics-allow]");
  var denyButton = document.querySelector("[data-analytics-deny]");
  var status = document.querySelector("[data-analytics-status]");
  var loaded = false;
  function readChoice() { try { return window.localStorage.getItem(storageKey); } catch { return null; } }
  function writeChoice(value) { try { window.localStorage.setItem(storageKey, value); } catch {} }
  function safeReferrer() { if (!document.referrer) return ""; try { return new URL(document.referrer).origin; } catch { return ""; } }
  function pageData() { return { page_location: window.location.origin + window.location.pathname, page_referrer: safeReferrer(), page_title: document.title }; }
  function gtag() { window.dataLayer.push(arguments); }
  function loadAnalytics() {
    if (loaded || !isProduction || navigator.globalPrivacyControl === true) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    gtag("consent", "default", { ad_personalization: "denied", ad_storage: "denied", ad_user_data: "denied", analytics_storage: "denied", wait_for_update: 500 });
    gtag("set", "ads_data_redaction", true);
    gtag("set", "url_passthrough", false);
    gtag("consent", "update", { analytics_storage: "granted" });
    gtag("js", new Date());
    gtag("config", measurementId, Object.assign({ allow_ad_personalization_signals: false, allow_google_signals: false }, pageData()));
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }
  function closePanel() { if (panel) panel.hidden = true; if (settings) settings.hidden = false; }
  function choose(value) { var previous = readChoice(); writeChoice(value); closePanel(); if (value === "granted") loadAnalytics(); else if (loaded && previous === "granted") { gtag("consent", "update", { analytics_storage: "denied" }); window.location.reload(); } }
  function openPanel() { if (!panel) return; panel.hidden = false; if (settings) settings.hidden = true; if (allowButton) allowButton.focus(); }
  if (navigator.globalPrivacyControl === true) { writeChoice("denied"); if (allowButton) allowButton.disabled = true; if (status) status.textContent = "Global Privacy Control is active, so analytics remains off."; }
  if (allowButton) allowButton.addEventListener("click", function () { choose("granted"); });
  if (denyButton) denyButton.addEventListener("click", function () { choose("denied"); });
  if (settings) settings.addEventListener("click", openPanel);
  if (readChoice() === "granted" && navigator.globalPrivacyControl !== true) { closePanel(); loadAnalytics(); } else if (readChoice()) closePanel(); else if (panel) panel.hidden = false;
})();
