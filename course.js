async function suckItBaby()
{
    const titleContainer = document.querySelector(".d2l-navigation-s-title-container");
    const navBarHeader = document.querySelector("d2l-labs-navigation-main-header");

    const daLink = titleContainer.querySelector("a");
    const courseName = daLink.textContent.trim();

    addElementToColorUpdater(courseName, navBarHeader, "backgroundColor");
    addElementToColorUpdater(courseName, navBarHeader.querySelector("a"), "color");

    for (const d2lIconButton of navBarHeader.querySelectorAll("d2l-labs-navigation-link-icon, d2l-labs-navigation-dropdown-button-icon"))
    {
        const d2lIconButtonShadowRoot = await awaitShadowRoot(d2lIconButton);
        const d2lIcon = await awaitElementExists(d2lIconButtonShadowRoot, "d2l-icon");
        addElementToColorUpdater(courseName, d2lIcon, "color");
    }

    const daHeaderRight = navBarHeader.querySelector(".d2l-labs-navigation-header-right");

        const newSeparator = document.createElement("d2l-page-header-separator");
        daHeaderRight.prepend(newSeparator);

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

        daHeaderRight.prepend(colorPicker);
}

suckItBaby();
