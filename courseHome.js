async function argBargarg()
{
    const titleContainer = document.querySelector(".d2l-navigation-s-title-container");

    const daLink = titleContainer.querySelector("a");
    const courseName = daLink.textContent.split(" (")[0].trim();

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

                    const deeCoc = await awaitElementExists(daIframeDocBody, ".dco_c", 100, 1000);
                    if (deeCoc != null)
                    {
                        for (const beeCoc of daIframeDocBody.querySelectorAll(".dco_c"))
                        {
                            addElementToColorUpdater(courseName, beeCoc, "backgroundColor");
                        }
                    }

                    updateCourseElements(courseName);

                    const trrrr = await awaitElementExists(daIframeDocBody, "tr", 100, 1000);
                    if (trrrr != null)
                    {
                        for (const tr of daIframeDocBody.querySelectorAll("tr"))
                        {
                            addElementToColorUpdater(courseName, tr, "backgroundColor");
                        }
                    }

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

argBargarg();
