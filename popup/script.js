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
