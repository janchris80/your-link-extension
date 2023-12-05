const whitelist = ["watchasian"];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo?.status === 'complete') {

    const url = new URL(tab.url);
    const domain = url.hostname;

    const found = whitelist.some(r => domain.includes(r))
    if (found) {
      const userId = 1; // Replace with actual logic to get user ID
      const isCompleted = false; // Or whatever your logic determines
      const isEnable = true; // Or whatever your logic determines

      saveVisitedUrl(tab.url, userId, isCompleted, isEnable);
    }
  }

  function saveVisitedUrl(url, userId, isCompleted, isEnable) {
    const apiURL = 'http://127.0.0.1:8001/api/v1/public/visited-websites';

    fetch(apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Include any other headers your API requires
      },
      body: JSON.stringify({
        userId: userId,
        url: url,
        isCompleted: isCompleted,
        isEnable: isEnable
      })
    })
      .then(response => response.json())
      .then(data => console.log('Success:', data))
      .catch((error) => console.error('Error:', error));
  }
});
