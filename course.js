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

    await Promise.allSettled(
        [...document.body.querySelectorAll(".d2l-widget")].map(async (widget) =>
        {
            addElementToColorUpdater(courseName, widget, "backgroundColor");

            const widgetHeader = widget.querySelector(".d2l-widget-header");
            addElementToColorUpdater(courseName, widgetHeader, "color");

            updateCourseElements(courseName);

            async function doHtmlBlocks()
            {
                const textSelector = "p, h1, strong, d2l-w2d-work-to-do, .d2l-textblock, div";

                for (const textie of widget.querySelectorAll(textSelector))
                {
                    console.log(textie.textContent);
                    addElementToColorUpdater(courseName, textie, "color");
                }

                const widgetHtmlBlock = await awaitElementExists(widget, "d2l-html-block", 100, 1000);

                if (widgetHtmlBlock != null)
                {
                    for (const textie of widgetHtmlBlock.querySelectorAll(textSelector))
                    {
                        addElementToColorUpdater(courseName, textie, "color");
                    }

                    updateCourseElements(courseName);

                    const widgetHtmlBlockShadowRoot = await awaitShadowRoot(widgetHtmlBlock);
                    for (const textie of widgetHtmlBlockShadowRoot.querySelectorAll(textSelector))
                    {
                        addElementToColorUpdater(courseName, textie, "color");
                    }

                    updateCourseElements(courseName);
                }

                const widgetInstructorBlock = await awaitElementExists(widget, "#instructors-container > div", 100, 1000);
                if (widgetInstructorBlock != null)
                {
                    for (const textie of widgetInstructorBlock.querySelectorAll(textSelector))
                    {
                        addElementToColorUpdater(courseName, textie, "color");
                    }
                }
            }

            async function doIframes()
            {
                const daIframe = await awaitElementExists(widget, "iframe", 100, 1000);

                if (daIframe != null)
                {
                    const daIframeDoc = await awaitNonBlankDocument(daIframe);

                    const daIframeDocBody = await awaitElementExists(daIframeDoc, "#d2l_body");

                    const deeCoc = await awaitElementExists(daIframeDocBody, ".dco_c");
                    addElementToColorUpdater(courseName, deeCoc, "backgroundColor");

                    updateCourseElements(courseName);
                }
            }

            await Promise.allSettled(
            [
                doHtmlBlocks(),
                doIframes()
            ]);
        })
    );
}

suckItBaby();
