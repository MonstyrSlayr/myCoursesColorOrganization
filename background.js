browser.action.onClicked.addListener(() =>
{
    browser.windows.create({
        type: "popup",
        url: "popup/index.html",
        width: 500,
        height: 650
    });
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) =>
{
    if (message.action === "fetchData")
    {
        fetch(message.url)
            .then(response => response.text())
            .then(data => sendResponse({ success: true, data: data }))
            .catch(error => sendResponse({ success: false, error: error.message }));

        return true;
    }
});
