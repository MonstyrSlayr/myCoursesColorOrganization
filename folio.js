async function colorPortfolioCourseCard(portfolioCourseCard)
{
    const portfolioCourseCardShadowRoot = await awaitShadowRoot(portfolioCourseCard);

    const d2lCard = await awaitElementExists(portfolioCourseCardShadowRoot, "d2l-card");
    const courseName = d2lCard.getAttribute("text");

    addElementToColorUpdater(courseName, d2lCard, "backgroundColor");
    updateCourseElements(courseName);

    const courseCardContent = await awaitElementExists(d2lCard, "d2l-portfolio-course-card-content");
    const courseCardContentShadowRoot = await awaitShadowRoot(courseCardContent);

    const courseNameDiv = await awaitElementExists(courseCardContentShadowRoot, ".course-name");
    addElementToColorUpdater(courseName, courseNameDiv, "color");
    updateCourseElements(courseName);

    const d2lFooter = await awaitElementExists(d2lCard, ".d2l-user-card-footer");

    for (const footerLink of d2lFooter.querySelectorAll("d2l-card-footer-link"))
    {
        const footerLinkShadowRoot = await awaitShadowRoot(footerLink);

        const countBadgeIcon = await awaitElementExists(footerLinkShadowRoot, "d2l-count-badge-icon");
        const countBadgeIconShadowRoot = await awaitShadowRoot(countBadgeIcon);

        const d2lIcon = await awaitElementExists(countBadgeIconShadowRoot, "d2l-icon");
        addElementToColorUpdater(courseName, d2lIcon, "tungstenCorundum");
    }
    
    updateCourseElements(courseName);
}

async function doThingToMattePortfolios(studentPortfolioShadowRoot, mama)
{
    let courseName = await getCourseNameFromHeader(studentPortfolioShadowRoot);

    const portfolioClassList = await awaitElementExists(mama, "d2l-portfolio-class-evidence-student");
    const portfolioClassListShadowRoot = await awaitShadowRoot(portfolioClassList);

    const portfolioEvidenceList = await awaitElementExists(portfolioClassListShadowRoot, "d2l-portfolio-evidence-list-wrapper-student");
    const portfolioEvidenceListShadowRoot = await awaitShadowRoot(portfolioEvidenceList);

    const evidenceListReal = await awaitElementExists(portfolioEvidenceListShadowRoot, "portfolio-evidence-list");
    const evidenceListRealShadowRoot = await awaitShadowRoot(evidenceListReal);

    const evidenceContainer = await awaitElementExists(evidenceListRealShadowRoot, ".evidence-container");

    await Promise.allSettled(
        [...evidenceContainer.querySelectorAll("d2l-portfolio-evidence-tile")].map(async (evidenceTile) =>
        {
            let myOwnPersonalCourseName = courseName;
            if (myOwnPersonalCourseName == null) return;

            const evidenceTileShadowRoot = await awaitShadowRoot(evidenceTile);

            const evidenceTileInternalOrgans = await awaitElementExists(evidenceTileShadowRoot, "d2l-evidence-tile", undefined, undefined, true);
            const evidenceTileInternalOrgansShadowRoot = await awaitShadowRoot(evidenceTileInternalOrgans);

            const d2lCard = await awaitElementExists(evidenceTileInternalOrgansShadowRoot, "d2l-card");

            addElementToColorUpdater(myOwnPersonalCourseName, d2lCard, "backgroundColor");
            updateCourseElements(myOwnPersonalCourseName);

            const courseCardContent = await awaitElementExists(d2lCard, "d2l-evidence-tile-inner-content");
            const courseCardContentShadowRoot = await awaitShadowRoot(courseCardContent);

            const courseNameDiv = await awaitElementExists(courseCardContentShadowRoot, "h3");
            addElementToColorUpdater(myOwnPersonalCourseName, courseNameDiv, "color");

            const notCourseNameDiv = await awaitElementExists(courseCardContentShadowRoot, ".date-captured");
            addElementToColorUpdater(myOwnPersonalCourseName, notCourseNameDiv, "tungstenCorundum");

            updateCourseElements(myOwnPersonalCourseName);

            const evidenceTileFooter = await awaitElementExists(d2lCard, "d2l-evidence-tile-footer");
            const evidenceTileFooterShadowRoot = await awaitShadowRoot(evidenceTileFooter);

            const innerBar = await awaitElementExists(evidenceTileFooterShadowRoot, ".inner-notification-bar");

            for (const lilButton of innerBar.querySelectorAll("d2l-button-subtle"))
            {
                const d2lIcon = await awaitElementExists(lilButton, "d2l-icon");
                addElementToColorUpdater(myOwnPersonalCourseName, d2lIcon, "tungstenCorundum");
            }
            
            updateCourseElements(myOwnPersonalCourseName);
        })
    );
}

async function doThingToMixedPortfolios(mama)
{
    const portfolioCourseList = await awaitElementExists(mama, "d2l-portfolio-course-list-learner");
    const portfolioCourseListShadowRoot = await awaitShadowRoot(portfolioCourseList);

    await (awaitElementExists(portfolioCourseListShadowRoot, "d2l-portfolio-course-card") || awaitElementExists(portfolioCourseListShadowRoot, "d2l-portfolio-course-list-item"));

    for (const portfolioCourseCard of portfolioCourseListShadowRoot.querySelectorAll("d2l-portfolio-course-card, d2l-portfolio-course-list-item"))
    {
        colorPortfolioCourseCard(portfolioCourseCard);
    }

    const newChildGridObserver = new MutationObserver((mutations) =>
    {
        mutations.forEach((mutation) =>
        {
            mutation.addedNodes.forEach((node) =>
            {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches("d2l-portfolio-course-card, d2l-portfolio-course-list-item"))
                {
                    colorPortfolioCourseCard(node);
                }
            });
        });
    });

    newChildGridObserver.observe(portfolioCourseListShadowRoot,
    {
        childList: true,
        subtree: true
    });

    const mainPageWidth = portfolioCourseListShadowRoot.querySelector(".main");

    const newChildGromObserver = new MutationObserver((mutations) =>
    {
        mutations.forEach((mutation) =>
        {
            mutation.addedNodes.forEach((node) =>
            {
                if (node.nodeType === Node.ELEMENT_NODE && node.matches(".grid-container"))
                {
                    for (const portfolioCourseCard of portfolioCourseListShadowRoot.querySelectorAll("d2l-portfolio-course-card"))
                    {
                        colorPortfolioCourseCard(portfolioCourseCard);
                    }
                }
            });
        });
    });

    newChildGromObserver.observe(mainPageWidth,
    {
        childList: true,
        subtree: true
    });
}

async function getCourseNameFromHeader(studentPortfolioShadowRoot)
{
    const portfolioHeader = await awaitElementExists(studentPortfolioShadowRoot, "d2l-portfolio-header-nav-student");
    const portfolioHeaderShadowRoot = await awaitShadowRoot(portfolioHeader);

    const pureHeader = await awaitElementExists(portfolioHeaderShadowRoot, "d2l-portfolio-header-student");
    const pureHeaderShadowRoot = await awaitShadowRoot(pureHeader);

    try
    {
        const entryNavigator = await awaitElementExists(pureHeaderShadowRoot, "d2l-portfolio-entity-navigator", 100, 1000);
        const entryNavigatorShadowRoot = await awaitShadowRoot(entryNavigator);

        const entitySelectorWrapper = await awaitElementExists(entryNavigatorShadowRoot, "d2l-folio-entity-selector-wrapper");
        const entitySelectorWrapperShadowRoot = await awaitShadowRoot(entitySelectorWrapper);

        const entitySelector = await awaitElementExists(entitySelectorWrapperShadowRoot, "d2l-folio-entity-selector");
        const entitySelectorShadowRoot = await awaitShadowRoot(entitySelector);

        const daDropdown = await awaitElementExists(entitySelectorShadowRoot, "d2l-dropdown");

        const daEntity = await awaitElementExists(daDropdown, "d2l-folio-entity-selector-entity");
        const daEntityShadowRoot = await awaitShadowRoot(daEntity);

        const daSpan = await awaitElementExists(daEntityShadowRoot, "span");
        return daSpan.textContent;
    }
    catch (error)
    {
        return null;
    }
}

async function doAwesomeFolioAppStuff(folioApp)
{
    const studentPortfolio = await awaitElementExists(folioApp, "student-portfolio");
    const studentPortfolioShadowRoot = await awaitShadowRoot(studentPortfolio);

    const portfolioCentral = await awaitElementExists(studentPortfolioShadowRoot, "d2l-portfolio-central-nav-main-student");
    const portfolioCentralShadowRoot = await awaitShadowRoot(portfolioCentral);

    const mamaPortfolios = await awaitElementExists(portfolioCentralShadowRoot, ".portfolios");

    const newChildGridObserver = new MutationObserver((mutations) =>
    {
        mutations.forEach((mutation) =>
        {
            mutation.addedNodes.forEach((node) =>
            {
                if (node.nodeType === Node.ELEMENT_NODE)
                {
                    if (node.matches("d2l-portfolio-course-list-learner"))
                    {
                        doThingToMixedPortfolios(mamaPortfolios);
                    }
                    else if (node.matches("d2l-portfolio-class-evidence-student"))
                    {
                        doThingToMattePortfolios(studentPortfolioShadowRoot, mamaPortfolios);
                    }
                }
            });
        });
    });

    newChildGridObserver.observe(mamaPortfolios,
    {
        childList: true,
        subtree: true
    });

    await Promise.allSettled(
        doThingToMixedPortfolios(mamaPortfolios),
        doThingToMattePortfolios(studentPortfolioShadowRoot, mamaPortfolios),
    );
}

async function doPortfolioMagic()
{
    if (!settings["Apply to Portfolio Cards"]) return;

    const folioLit = await awaitElementExists(document.body, "folio-lit");
    const folioLitShadowRoot = await awaitShadowRoot(folioLit);

    const folioApp = await awaitElementExists(folioLitShadowRoot, "folio-app");

    const newChildGridObserver = new MutationObserver((mutations) =>
    {
        mutations.forEach((mutation) =>
        {
            mutation.addedNodes.forEach((node) =>
            {
                if (node.nodeType === Node.ELEMENT_NODE)
                {
                    if (node.matches("student-portfolio"))
                    {
                        doAwesomeFolioAppStuff(folioApp);
                    }
                }
            });
        });
    });

    newChildGridObserver.observe(folioApp,
    {
        childList: true,
        subtree: true
    });

    await doAwesomeFolioAppStuff(folioApp);
}

doPortfolioMagic();
