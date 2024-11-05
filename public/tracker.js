(function () {
  // Create tracker object
  window.ViewTracker = {
    init: function (config) {
      this.apiKey = config.apiKey;
      this.apiUrl = config.apiUrl || "https://your-analytics-app.com"; // Replace with your domain
    },

    track: async function () {
      try {
        const response = await fetch(`${this.apiUrl}/api/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            websiteId: this.apiKey,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to track view");
        }

        return await response.json();
      } catch (error) {
        console.error("Error tracking view:", error);
      }
    },
  };

  // Auto-track page view when script loads
  if (document.readyState === "complete") {
    ViewTracker.track();
  } else {
    window.addEventListener("load", function () {
      ViewTracker.track();
    });
  }
})();
