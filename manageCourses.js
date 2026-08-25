let tBody = document.querySelector("tbody");

function colorDaRow(daRow)
{
    const courseName = daRow.querySelector("a").textContent;
    
    addElementToColorUpdater(courseName, daRow, "backgroundColor");
    addElementToColorUpdater(courseName, daRow, "color");
    updateCourseElements(courseName);
}

for (const daRow of tBody.querySelectorAll(".d2l-grid-row"))
{
    colorDaRow(daRow);
}

const observer = new MutationObserver((mutations) =>
{
    for (const mutation of mutations)
    {
        if (mutation.type === "childList" && mutation.removedNodes.length > 0)
        {
            for (const removedNode of mutation.removedNodes)
            {
                if (removedNode === tBody || removedNode.contains(tBody))
                {
                    tBody = document.querySelector("tbody");

                    for (const daRow of tBody.querySelectorAll(".d2l-grid-row"))
                    {
                        colorDaRow(daRow);
                    }

                    return;
                }
            }
        }
    }
});

// so stupid
observer.observe(document.body,
{
    childList: true,
    subtree: true
});
