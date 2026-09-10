async function applyColorsToEnrollmentCard(enrollmentCard)
{
    if (!settings["Apply to Cards"]) return;

    const enrollmentCardShadowRoot = await awaitShadowRoot(enrollmentCard);

    const d2lCard = await awaitElementExists(enrollmentCardShadowRoot, "d2l-card");
    const courseNameElement = d2lCard.querySelector(".d2l-organization-name");
    const courseMeta =  await awaitElementExists(d2lCard, "d2l-card-content-meta");

    const courseName = (await waitForTextContent(courseNameElement)).trim();

    addElementToColorUpdater(courseName, d2lCard, "backgroundColor");
    addElementToColorUpdater(courseName, courseNameElement, "color");
    addElementToColorUpdater(courseName, courseMeta, "tungstenCorundum");
    updateCourseElements(courseName);

    try
    {
        const daFooterLink = await awaitElementExists(d2lCard, "d2l-card-footer-link", 100, 1000);
        if (daFooterLink != null && daFooterLink != undefined)
        {
            const daFooterLinkShadowRoot = await awaitShadowRoot(daFooterLink);

            const countBadgeIcon = await awaitElementExists(daFooterLinkShadowRoot, "d2l-count-badge-icon");
            const countBadgeIconShadowRoot = await awaitShadowRoot(countBadgeIcon);

            const daIcon = await awaitElementExists(countBadgeIconShadowRoot, "d2l-icon");
            addElementToColorUpdater(courseName, daIcon, "tungstenCorundum");
        }
    }
    catch (error)
    {
        console.error("yo this is the only way anything is going to work");
    }

    updateCourseElements(courseName);

    const dropdownMore = await awaitElementExists(d2lCard, "d2l-dropdown-more");
    const dropdownMenu = await awaitElementExists(dropdownMore, "d2l-dropdown-menu");
    const dropdownFinalMenu = await awaitElementExists(dropdownMenu, "d2l-menu");

    const colorPickerMenuItem = document.createElement("d2l-menu-item");
    colorPickerMenuItem.role = "menuitem";
    colorPickerMenuItem.tabIndex = "-1";
    colorPickerMenuItem.ariaDisabled = false;
    colorPickerMenuItem.ariaLabel = "Change Color";
    colorPickerMenuItem.ariaHasPopup = false;
    addElementToColorUpdater(courseName, colorPickerMenuItem, "backgroundColor");
    dropdownFinalMenu.appendChild(colorPickerMenuItem);

        const colorPickerMenuItemText = await awaitElementExists(colorPickerMenuItem.shadowRoot, ".d2l-menu-item-text");
        colorPickerMenuItemText.textContent = "Change Color";
        addElementToColorUpdater(courseName, colorPickerMenuItemText, "color");

        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        addElementToColorUpdater(courseName, colorPicker, "value");
        updateCourseElements(courseName);

        colorPicker.addEventListener("input", () =>
        {
            colorData[courseName] = colorPicker.value;
            updateCourseElements(courseName);
            saveColorData();
        });

        colorPickerMenuItem.shadowRoot.appendChild(colorPicker);
}

async function applyColorsToPanelChildren(parentTabs, skipContent)
{
    // ids that start with panel
    // await one exists so yeah yeah yada a
    await awaitElementExists(parentTabs, "d2l-tab-panel");

    // all tab panels please
    await Promise.allSettled(
        [...parentTabs.querySelectorAll("d2l-tab-panel")].map(async (tabPanel) =>
        {
            // all-tabs skips these
            const myCoursesContent = skipContent ? null : await awaitElementExists(tabPanel, "d2l-my-courses-content-v2", 1000);
            const myCoursesContentShadowRoot = skipContent ? null : await awaitShadowRoot(myCoursesContent);

            const cardGrid = skipContent ? await awaitElementExists(tabPanel, "d2l-my-courses-card-grid-v2") : await awaitElementExists(myCoursesContentShadowRoot, "d2l-my-courses-card-grid-v2");
            const cardGridShadowRoot = await awaitShadowRoot(cardGrid);

            const courseCardGrid = await awaitElementExists(cardGridShadowRoot, ".course-card-grid");

            for (const enrollmentCard of courseCardGrid.querySelectorAll("d2l-my-courses-enrollment-card"))
            {
                applyColorsToEnrollmentCard(enrollmentCard, colorData);
            }

            const newChildGridObserver = new MutationObserver((mutations) =>
            {
                mutations.forEach((mutation) =>
                {
                    mutation.addedNodes.forEach((node) =>
                    {
                        if (node.nodeType === Node.ELEMENT_NODE && node.matches(".course-card-grid"))
                        {
                            for (const enrollmentCard of node.querySelectorAll("d2l-my-courses-enrollment-card"))
                            {
                                applyColorsToEnrollmentCard(enrollmentCard, colorData);
                            }
                        }
                    });
                });
            });

            newChildGridObserver.observe(cardGridShadowRoot,
            {
                childList: true,
                subtree: true
            });
        })
    );
}

async function addColorsToPanels()
{
    const myCourses = await awaitElementExists(document.body, "d2l-my-courses-v2");
    const myCoursesShadowRoot = await awaitShadowRoot(myCourses);

    const myCoursesContainer = await awaitElementExists(myCoursesShadowRoot, "d2l-my-courses-container-v2");
    const myCoursesContainerShadowRoot = await awaitShadowRoot(myCoursesContainer);

    const d2lTabs = await awaitElementExists(myCoursesContainerShadowRoot, "d2l-tabs");
    applyColorsToPanelChildren(d2lTabs, false);

    const allCourses = await awaitElementExists(myCoursesContainerShadowRoot, "d2l-all-courses-v2");
    const allCoursesShadowRoot = await awaitShadowRoot(allCourses);

    const dialogFullscreen = await awaitElementExists(allCoursesShadowRoot, "d2l-dialog-fullscreen");
    const dialogSubDiv = await awaitElementExists(dialogFullscreen, "div");

    // const allCoursesD2lTabs = await awaitElementExists(dialogSubDiv, "d2l-tabs");
    // applyColorsToPanelChildren(allCoursesD2lTabs, colorData, true);

    const firstDialogObserver = new MutationObserver((mutations) =>
    {
        mutations.forEach((mutation) =>
        {
            mutation.addedNodes.forEach((node) =>
            {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches("d2l-tabs"))
                {
                    firstDialogObserver.disconnect();
                    applyColorsToPanelChildren(node, true);
                }
            });
        });
    });

    firstDialogObserver.observe(dialogSubDiv,
    {
        childList: true,
        subtree: true
    });
}

async function colorWorkToDo()
{
    if (!settings["Apply to Assignments"]) return;

    const workToDo = await awaitElementExists(document.body, "d2l-w2d-work-to-do");
    const workToDoShadowRoot = await awaitShadowRoot(workToDo);

    const daCollections = await awaitElementExists(workToDoShadowRoot, "d2l-w2d-collections");
    const daCollectionsShadowRoot = await awaitShadowRoot(daCollections);

    const daList = await awaitElementExists(daCollectionsShadowRoot, "d2l-w2d-list", undefined, undefined, true);
    const daListShadowRoot = await awaitShadowRoot(daList);

    const daListReal = await awaitElementExists(daListShadowRoot, "d2l-list");

    await Promise.allSettled(
        [...daListReal.children].map(async (litem) =>
        {
            const lagowRoog = await awaitShadowRoot(litem);

            const gennie = await awaitElementExists(lagowRoog, "d2l-list-item-generic-layout");
            const genniesAnchor = await awaitElementExists(gennie, "a");

            const attrList = await awaitElementExists(genniesAnchor, "d2l-w2d-attribute-list");
            const courseName = attrList.querySelectorAll("span")[1].textContent;

            addElementToColorUpdater(courseName, litem, "backgroundColor");
            
            const activityIcon = genniesAnchor.querySelector("d2l-activity-icon");
            addElementToColorUpdater(courseName, activityIcon, "tungstenCorundum");

            const listItemContent = genniesAnchor.querySelector("d2l-list-item-content");
            addElementToColorUpdater(courseName, listItemContent.children[0], "color");
            addElementToColorUpdater(courseName, listItemContent.children[1], "tungstenCorundum");

            updateCourseElements(courseName);
        })
    );
}

function getBrowserName()
{
    const userAgent = navigator.userAgent;

    if (userAgent.includes("Firefox"))
    {
        return "Firefox";
    }
    else if (userAgent.includes("Edg"))
    {
        return "Edge";
    }
    else if (userAgent.includes("Chrome"))
    {
        return "Chrome";
    }
    else if (userAgent.includes("Safari"))
    {
        return "Safari";
    }
    return "Unknown";
}

async function leaveAReviewIfItMatters()
{
    if (!settings["Show Review"]) return;

    const daLink = getBrowserName() == "Firefox" ? "https://addons.mozilla.org/en-US/firefox/addon/my-courses-color-organization/" : "https://chromewebstore.google.com/detail/my-courses-color-organiza/ebpcoafnjjigafbnhlgbdihikbomiain";
    const htmlBlockContent = `
        <a href="${daLink}" target="_blank"><h2>If you're enjoying MyCourses Color Organization, I would love if you left a review!</h2></a>
    `;

    const hometown = document.body.querySelector(".homepage-col-8");

    const reviewDiv = document.createElement("div");
    reviewDiv.role = "region";
    reviewDiv.classList.add("d2l-widget");
    reviewDiv.classList.add("d2l-tile");
    reviewDiv.classList.add("d2l-widget-padding-full");
    reviewDiv.classList.add("d2l-custom-widget");
    hometown.insertBefore(reviewDiv, hometown.children[1]);

        const reviewExpiCola = document.createElement("d2l-expand-collapse-content");
        reviewExpiCola.setAttribute("expanded", "");
        reviewExpiCola.classList.add("d2l-widget-content");
        reviewDiv.appendChild(reviewExpiCola);

            const reviewContentPadding = document.createElement("div");
            reviewContentPadding.classList.add("d2l-widget-content-padding");
            reviewExpiCola.appendChild(reviewContentPadding);

                const randomDiv = document.createElement("div");
                randomDiv.style.display = "flex";
                randomDiv.style.flexDirection = "row";
                randomDiv.style.justifyContent = "space-between";
                randomDiv.style.alignItems = "start";
                reviewContentPadding.appendChild(randomDiv);

                    const reviewHtmlBlock = document.createElement("d2l-html-block");
                    reviewHtmlBlock.setAttribute("html", htmlBlockContent);
                    randomDiv.appendChild(reviewHtmlBlock);

                    const daButton = document.createElement("a");
                    daButton.style.aspectRatio = "1 / 1";
                    daButton.classList.add("d2l-imagelink");
                    daButton.href = "javascript:void(0);";
                    daButton.role = "button";
                    randomDiv.appendChild(daButton);

                        const daButtonIcon = document.createElement("d2l-icon");
                        daButtonIcon.setAttribute("icon", "tier1:close-small");
                        daButton.appendChild(daButtonIcon);
                    
                    daButton.addEventListener("click", () =>
                    {
                        settings["Show Review"] = false;
                        reviewDiv.style.display = "none";
                        saveSettings();
                    });
}

Promise.allSettled(
[
    addColorsToPanels(),
    colorWorkToDo(),
    leaveAReviewIfItMatters()
]);
