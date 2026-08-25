async function doDaMagic()
{
    async function courseListShenanigans()
    {
        const courseMenu = document.querySelector(".d2l-navigation-s-course-menu");

        const navDropDownButton = courseMenu.querySelector("d2l-labs-navigation-dropdown-button-icon");

        const dropDownContent = navDropDownButton.querySelector("d2l-dropdown-content");

        const courseSelectorWrapper = await awaitElementExists(dropDownContent, ".d2l-courseselector-wrapper");
        
        const vuiList = courseSelectorWrapper.querySelector(".vui-list");

        for (const daLi of [...vuiList.querySelectorAll("li")])
        {
            const daLink = daLi.querySelector("a");
            const dashie = " - ";
            const courseArray = daLink.textContent.trim().split(dashie);
            let courseName = "";
            for (let i = 0; i < courseArray.length - 1; i++)
            {
                courseName += courseArray[i] + dashie;
            }
            courseName = courseName.substring(0, courseName.length - dashie.length);

            addElementToColorUpdater(courseName, daLi, "backgroundColor");
            updateCourseElements(courseName);

            const courseSelectorItem = daLi.querySelector(".d2l-course-selector-item");

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

                courseSelectorItem.appendChild(colorPicker);
        }
    }

    async function notificationsShenanigans()
    {
        const noties = document.querySelectorAll(".d2l-navigation-s-notification");
        const notieMenu = noties[noties.length - 1];

        const vuiList = await awaitElementExists(notieMenu, ".vui-list");

        function bumpMyLi(daLi)
        {
            const daLink = daLi.querySelector(".vui-emphasis");
            const dashie = " - ";
            const courseArray = daLink.textContent.trim().split(dashie);
            let courseName = "";
            for (let i = 1; i < courseArray.length; i++)
            {
                courseName += courseArray[i] + dashie;
            }
            courseName = courseName.substring(0, courseName.length - dashie.length);

            addElementToColorUpdater(courseName, daLi, "backgroundColor");
            addElementToColorUpdater(courseName, daLink, "color");
            updateCourseElements(courseName);
        }

        for (const daLi of [...vuiList.querySelectorAll(".d2l-datalist-item")])
        {
            bumpMyLi(daLi);
        }

        const newChildObserver = new MutationObserver((mutations) =>
        {
            mutations.forEach((mutation) =>
            {
                mutation.addedNodes.forEach((node) =>
                {
                    if (node.nodeType === Node.ELEMENT_NODE && node.matches(".d2l-datalist-item"))
                    {
                        bumpMyLi(node);
                    }
                });
            });
        });

        newChildObserver.observe(vuiList,
        {
            childList: true,
            subtree: true
        });
    }

    Promise.allSettled([
        courseListShenanigans(),
        notificationsShenanigans()
    ]);
}

async function doDaMagicMobile()
{
    const mobileMenuWhatever = document.querySelector(".d2l-navigation-s-mobile-menu-content");

    const courseMenu = await awaitElementExists(mobileMenuWhatever, ".d2l-navigation-s-mobile-menu-course-menu");
    
    const vuiList = await awaitElementExists(courseMenu, ".vui-list");

    await awaitElementExists(vuiList, "li");

    for (const daLi of [...vuiList.querySelectorAll("li")])
    {
        const daLink = daLi.querySelector("a");
        const dashie = " - ";
        const courseArray = daLink.textContent.trim().split(dashie);
        let courseName = "";
        for (let i = 0; i < courseArray.length - 1; i++)
        {
            courseName += courseArray[i] + dashie;
        }
        courseName = courseName.substring(0, courseName.length - dashie.length);

        addElementToColorUpdater(courseName, daLi, "backgroundColor");
        updateCourseElements(courseName);

        const courseSelectorItem = daLi.querySelector(".d2l-course-selector-item");

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

            courseSelectorItem.appendChild(colorPicker);
    }
}

async function doAllMagic()
{
    return await Promise.all([
        doDaMagic(),
        doDaMagicMobile()
    ]);
}

doAllMagic();
