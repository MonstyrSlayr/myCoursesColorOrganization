async function colorLitem(litem)
{
    const lagowRoog = await awaitShadowRoot(litem);

    const gennie = await awaitElementExists(lagowRoog, "d2l-list-item-generic-layout");
    let genniesAnchor;

    try
    {
        genniesAnchor = await awaitElementExists(gennie, "a", 100, 100);
    }
    catch (error)
    {
        genniesAnchor = gennie;
    }

    const attrList = await awaitElementExists(genniesAnchor, "d2l-w2d-attribute-list");
    const courseName = attrList.querySelectorAll("span")[0].textContent;

    addElementToColorUpdater(courseName, litem, "backgroundColor");
    
    const activityIcon = genniesAnchor.querySelector("d2l-activity-icon");
    addElementToColorUpdater(courseName, activityIcon, "tungstenCorundum");

    const listItemContent = genniesAnchor.querySelector("d2l-list-item-content");
    addElementToColorUpdater(courseName, listItemContent.children[0], "color");
    addElementToColorUpdater(courseName, listItemContent.children[1], "tungstenCorundum");
    
    updateCourseElements(courseName);
}

async function awaitNotSkeletonThenBeAwesome(daList)
{
    await awaitElementExists(daList, "*", undefined, undefined, true);

    await Promise.allSettled(
        [...daList.children].map(async (litem) =>
        {
            colorLitem(litem);
        })
    );
}

async function colorList(daList)
{
    const daListShadowRoot = await awaitShadowRoot(daList);

    const daListReal = await awaitElementExists(daListShadowRoot, "d2l-list", 100, 1000);

    await Promise.allSettled(
        [...daListReal.children].map(async (litem) =>
        {
            colorLitem(litem);
        })
    );

    const newChildListObserver = new MutationObserver((mutations) =>
    {
        mutations.forEach((mutation) =>
        {
            mutation.addedNodes.forEach((node) =>
            {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches("d2l-list"))
                {
                    awaitNotSkeletonThenBeAwesome(node);
                }
            });
        });
    });

    newChildListObserver.observe(daListShadowRoot,
    {
        childList: true,
        subtree: false
    });
}

async function doListShenanigan(node)
{
    await awaitElementExists(node, "d2l-w2d-list", undefined, undefined, true);

    Promise.allSettled(
        [...node.querySelectorAll("d2l-w2d-list")].map(async (daList) =>
        {
            await colorList(daList);
        })
    );
}

async function assignments()
{
    if (!settings["Apply to Assignments"]) return;

    const workToDo = await awaitElementExists(document.body, "d2l-w2d-work-to-do");
    const workToDoShadowRoot = await awaitShadowRoot(workToDo);

    const daCollections = await awaitElementExists(workToDoShadowRoot, "d2l-w2d-collections");
    const daCollectionsShadowRoot = await awaitShadowRoot(daCollections);

    await awaitElementExists(daCollectionsShadowRoot, "d2l-w2d-list", undefined, undefined, true);

    await Promise.allSettled(
        [...daCollectionsShadowRoot.querySelectorAll("d2l-w2d-list")].map(async (daList) =>
        {
            await colorList(daList);
        })
    );

    const newChildGridObserver = new MutationObserver((mutations) =>
    {
        mutations.forEach((mutation) =>
        {
            mutation.addedNodes.forEach((node) =>
            {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches("div"))
                {
                    doListShenanigan(node);
                }
            });
        });
    });

    newChildGridObserver.observe(daCollectionsShadowRoot,
    {
        childList: true,
        subtree: true
    });
}

assignments();
