const settings = {};

async function saveSettings()
{
    await browser.storage.local.set({ settings: settings });
}

async function getSettings()
{
    const daReturnData = (await browser.storage.local.get(["settings"]))["settings"] || {};

    // populate settings
    const defaultSettings = {
        "Apply to Cards": true,
        "Apply to Course List": true,
        "Apply to Notifications": true,
        "Apply to Course Header": true,
        "Apply to Course Widgets": true,
    }

    Object.entries(defaultSettings).forEach((daSetting) =>
    {
        if (!Object.hasOwn(daReturnData, daSetting[0]))
        {
            settings[daSetting[0]] = daSetting[1];
        }
        else
        {
            settings[daSetting[0]] = daReturnData[daSetting[0]];
        }
    });

    saveSettings();
}

const reloadSpoiler = document.getElementById("reloadSpoiler");

getSettings().then(() =>
{
    function createSettingMenuItem(text)
    {
        const colorPickerMenuItem = document.createElement("div");
        colorPickerMenuItem.classList.add("setting");
        colorPickerMenuItem.ariaDisabled = false;
        colorPickerMenuItem.ariaLabel = text;
        colorPickerMenuItem.ariaHasPopup = false;

            const colorPickerMenuItemText = document.createElement("label");
            colorPickerMenuItemText.textContent = text;
            colorPickerMenuItemText.htmlFor = "checkbox" + text;
            colorPickerMenuItem.appendChild(colorPickerMenuItemText);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "checkbox" + text;
            checkbox.checked = settings[text];

            checkbox.addEventListener("input", () =>
            {
                settings[text] = checkbox.checked;
                saveSettings();
                reloadSpoiler.style.display = "block";
            });

            colorPickerMenuItem.appendChild(checkbox);

        return colorPickerMenuItem;
    }

    const daSettingsMenu = document.getElementById("settingsMenu");
    daSettingsMenu.appendChild(createSettingMenuItem("Apply to Cards"));
    daSettingsMenu.appendChild(createSettingMenuItem("Apply to Course List"));
    daSettingsMenu.appendChild(createSettingMenuItem("Apply to Notifications"));
    daSettingsMenu.appendChild(createSettingMenuItem("Apply to Course Header"));
    daSettingsMenu.appendChild(createSettingMenuItem("Apply to Course Widgets"));
});

document.getElementById("exportJson").addEventListener("click", () =>
{
    browser.storage.local.get(["colorData"]).then((data) =>
    {
        const colorData = {};
        const daReturnData = data["colorData"] || {};

        Object.entries(daReturnData).forEach((daThing) =>
        {
            colorData[daThing[0]] = daThing[1];
        });

        const blob = new Blob([JSON.stringify(colorData)], { type: "application/json" });
        const blobUrl = URL.createObjectURL(blob);
        
        const daA = document.createElement("a");
        daA.href = blobUrl;
        daA.download = "myCoursesColorData.json";
        
        document.body.appendChild(daA);
        daA.click();
        
        document.body.removeChild(daA);
        URL.revokeObjectURL(blobUrl);
    });
});

document.getElementById("importJson").addEventListener("click", () =>
{
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.multiple = false;
    fileInput.accept = ".json";
        
    document.body.appendChild(fileInput);
    fileInput.click();

    fileInput.addEventListener("change", () =>
    {
        const daFile = Array.from(fileInput.files)[0];
        if (!daFile) return;

        // NO VERIFICATION fuck it we ball
        const reader = new FileReader();

        reader.onload = function(e)
        {
            try
            {
                const contents = e.target.result;
                const jsonObject = JSON.parse(contents);

                browser.storage.local.get(["colorData"]).then((data) =>
                {
                    // by doing this, colors that aren't in the file will not be overridden
                    const colorData = {};
                    const daReturnData = data["colorData"] || {};

                    Object.entries(daReturnData).forEach((daThing) =>
                    {
                        colorData[daThing[0]] = daThing[1];
                    });

                    Object.entries(jsonObject).forEach((daThing) =>
                    {
                        colorData[daThing[0]] = daThing[1];
                    });

                    browser.storage.local.set({ colorData: colorData }).then(() =>
                    {
                        reloadSpoiler.style.display = "block";
                    });
                });
            }
            catch (error)
            {
                console.error("oops!", error);
            }
        };

        reader.readAsText(daFile);
    });
    
    document.body.removeChild(fileInput);
});
