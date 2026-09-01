browser.action.onClicked.addListener(() =>
{
    browser.windows.create({
        type: "popup",
        url: "popup/index.html",
        width: 500,
        height: 650
    });
});
