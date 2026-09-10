async function argBargarg()
{
    if (!settings["Apply to Course Widgets"]) return;

    const titleContainer = document.querySelector(".d2l-navigation-s-title-container");

    const daLink = titleContainer.querySelector("a");
    const courseName = daLink.textContent.split(" (")[0].trim();

    await Promise.allSettled(
        [...document.body.querySelectorAll(".d2l-widget")].map(async (widget) =>
        {
            addElementToColorUpdater(courseName, widget, "backgroundColor");

            const widgetHeader = widget.querySelector(".d2l-widget-header");
            addElementToColorUpdater(courseName, widgetHeader, "color");

            const dropdownMenu = widgetHeader.querySelector("d2l-dropdown-context-menu");
            const dropdownMenuShadowRoot = await awaitShadowRoot(dropdownMenu);

            const daButtonIcon = dropdownMenuShadowRoot.querySelector("d2l-button-icon");
            const daButtonIconShadowRoot = await awaitShadowRoot(daButtonIcon);

            const dropdownArrow = daButtonIconShadowRoot.querySelector("d2l-icon");
            addElementToColorUpdater(courseName, dropdownArrow, "tungstenCorundum");

            updateCourseElements(courseName);

            function getThem(thelememnt)
            {
                const textSelector = "p, h1, strong, d2l-w2d-work-to-do, .d2l-textblock, div";
                
                for (const textie of thelememnt.querySelectorAll(textSelector))
                {
                    addElementToColorUpdater(courseName, textie, "color");
                }

                for (const anchor of thelememnt.querySelectorAll("a"))
                {
                    addElementToColorUpdater(courseName, anchor, "interactiveAccent");
                }

                updateCourseElements(courseName);
            }
            
            getThem(widget);

            async function doQuickEvals()
            {
                const quickEval = await awaitElementExists(widget, "d2l-quick-eval-widget", 100, 1001);

                if (quickEval != null)
                {
                    for (const bigBlock of widget.querySelectorAll("d2l-quick-eval-widget"))
                    {
                        const bigBlockShadowRoot = await awaitShadowRoot(bigBlock);
                        await awaitElementExists(bigBlockShadowRoot, "d2l-link");

                        getThem(bigBlockShadowRoot);

                        await awaitElementExists(bigBlockShadowRoot, "d2l-work-to-do-activity-list-item-basic");
                        for (const litem of bigBlockShadowRoot.querySelectorAll("d2l-work-to-do-activity-list-item-basic"))
                        {
                            const lagowRoog = await awaitShadowRoot(litem);

                            const gennie = await awaitElementExists(lagowRoog, "d2l-list-item-generic-layout");
                            const genniesAnchor = await awaitElementExists(gennie, "a");
                            
                            const thisThing = await awaitElementExists(genniesAnchor, ".d2l-activity-name-container");
                            addElementToColorUpdater(courseName, thisThing, "interactiveAccent");

                            const dateThing = await awaitElementExists(genniesAnchor, "d2l-activity-date");
                            addElementToColorUpdater(courseName, dateThing, "tungstenCorundum");

                            const submissionIcon = await awaitElementExists(genniesAnchor, "d2l-quick-eval-widget-submission-icon");
                            const submissionIconShadowRoot = await awaitShadowRoot(submissionIcon);
                            const actualIcon = await awaitElementExists(submissionIconShadowRoot, "d2l-icon");
                            addElementToColorUpdater(courseName, actualIcon, "tungstenCorundum");
                        }

                        for (const d2lLink of bigBlockShadowRoot.querySelectorAll("d2l-link"))
                        {
                            const linkShadowRoot = await awaitShadowRoot(d2lLink);
                            addElementToColorUpdater(courseName, linkShadowRoot.querySelector("a"), "interactiveAccent");
                        }

                        updateCourseElements(courseName);
                    }
                }
            }

            async function doContentPadding()
            {
                const contentPaddingReal = await awaitElementExists(widget, ".d2l-widget-content-padding", 100, 1000);

                if (contentPaddingReal != null)
                {
                    for (const contentPadding of widget.querySelectorAll(".d2l-widget-content-padding"))
                    {
                        await awaitElementNotExists(contentPadding, ".d2l-loading");

                        getThem(contentPadding);

                        const widgetContentHtmlBlock = await awaitElementExists(contentPadding, "d2l-html-block", 100, 1000);

                        if (widgetContentHtmlBlock != null)
                        {
                            for (const bigBlock of contentPadding.querySelectorAll("d2l-html-block"))
                            {
                                const bigBlockShadowRoot = await awaitShadowRoot(bigBlock);

                                getThem(bigBlockShadowRoot);
                            }
                        }

                        for (const dropdownMenuCool of contentPadding.querySelectorAll("d2l-dropdown-context-menu"))
                        {
                            const dropdownMenuShadowRootCool = await awaitShadowRoot(dropdownMenuCool);

                            const daButtonIconCool = dropdownMenuShadowRootCool.querySelector("d2l-button-icon");
                            const daButtonIconShadowRootCool = await awaitShadowRoot(daButtonIconCool);

                            const dropdownArrowCool = daButtonIconShadowRootCool.querySelector("d2l-icon");
                            addElementToColorUpdater(courseName, dropdownArrowCool, "tungstenCorundum");
                        }

                        for (const d2lIcon of contentPadding.querySelectorAll("d2l-icon"))
                        {
                            addElementToColorUpdater(courseName, d2lIcon, "tungstenCorundum");
                        }

                        updateCourseElements(courseName);
                    }
                }
            }

            async function doHtmlBlocks()
            {
                const widgetHtmlBlock = await awaitElementExists(widget, "d2l-html-block", 100, 1000);

                if (widgetHtmlBlock != null)
                {
                    getThem(widgetHtmlBlock);

                    const widgetHtmlBlockShadowRoot = await awaitShadowRoot(widgetHtmlBlock);
                    for (const textie of widgetHtmlBlockShadowRoot.querySelectorAll(textSelector))
                    {
                        addElementToColorUpdater(courseName, textie, "color");
                    }

                    for (const anchor of widgetHtmlBlockShadowRoot.querySelectorAll("a"))
                    {
                        addElementToColorUpdater(courseName, anchor, "interactiveAccent");
                    }

                    updateCourseElements(courseName);
                }
            }

            async function doInstructorBlock()
            {
                const widgetInstructorBlock = await awaitElementExists(widget, "#instructors-container > div", 100, 1000);
                if (widgetInstructorBlock != null)
                {
                    getThem(widgetInstructorBlock);
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

                            const myListieHuh = await awaitElementExists(beeCoc, "li", 100, 1000);
                            if (myListieHuh != null)
                            {
                                for (const myListie of beeCoc.querySelectorAll("li"))
                                {
                                    const daAnchor = myListie.querySelector("a");
                                    addElementToColorUpdater(courseName, daAnchor, "interactiveAccent");

                                    for (const daImgThatShouldReallyBeAnSvg of daAnchor.querySelectorAll("img"))
                                    {
                                        if (daImgThatShouldReallyBeAnSvg.src.endsWith(".svg"))
                                        {
                                            const yeahWeDidIt = await imgToSvg(daImgThatShouldReallyBeAnSvg);

                                            if (yeahWeDidIt)
                                            {
                                                addElementToColorUpdater(courseName, yeahWeDidIt, "tungstenCorundum");

                                                updateCourseElements(courseName);
                                            }
                                        }
                                    }
                                }
                            }

                            updateCourseElements(courseName);

                            const suttyButtyHuh = await awaitElementExists(beeCoc, "d2l-button-subtle", 100, 1000);
                            if (suttyButtyHuh != null)
                            {
                                for (const suttyButty of daIframeDocBody.querySelectorAll("d2l-button-subtle"))
                                {
                                    const suttyButtyShadowRoot = await awaitShadowRoot(suttyButty);
                                    const daButton = suttyButtyShadowRoot.querySelector("button");

                                    const daSpan = daButton.querySelector(".d2l-button-subtle-content");
                                    addElementToColorUpdater(courseName, daSpan, "interactiveAccent");

                                    const daIcon = daButton.querySelector(".property-icon");
                                    addElementToColorUpdater(courseName, daIcon, "interactiveAccent");
                                }
                            }

                            updateCourseElements(courseName);
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
                doQuickEvals(),
                doContentPadding(),
                doHtmlBlocks(),
                doInstructorBlock(),
                doIframes()
            ]);
        })
    );
}

argBargarg();
