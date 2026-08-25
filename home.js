async function applyColorsToEnrollmentCard(enrollmentCard)
{
    const enrollmentCardShadowRoot = await awaitShadowRoot(enrollmentCard);

    const d2lCard = await awaitElementExists(enrollmentCardShadowRoot, "d2l-card");
    const courseNameElement = d2lCard.querySelector(".d2l-organization-name");

    const courseName = (await waitForTextContent(courseNameElement)).trim();

    addElementToColorUpdater(courseName, d2lCard, "backgroundColor");
    addElementToColorUpdater(courseName, courseNameElement, "color");
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
    const myCourses = await awaitElementExists(document, "d2l-my-courses-v2");
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

addColorsToPanels();
