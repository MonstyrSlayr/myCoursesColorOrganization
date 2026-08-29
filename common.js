const debugAwait = false;

// TODO: rework these do they use observers instead of polling, if possible
async function awaitElementExists(parent, query, pollInterval = 100, timeout = null)
{
    return new Promise((resolve, reject) =>
    {
        let daInterval;

        function daThing()
        {
            const d2lTabPanel = parent.querySelector(query);

            if (d2lTabPanel != null && d2lTabPanel != undefined)
            {
                clearInterval(daInterval);
                resolve(d2lTabPanel);
            }
            else if (debugAwait)
            {
                console.log("awaiting " + parent.tagName + "'s child " + query);
            }
        }

        daThing();

        daInterval = setInterval(daThing, pollInterval);

        if (timeout != null)
        {
            setTimeout(() =>
            {
                clearInterval(daInterval);
                reject(null);
            }, timeout);
        }
    });
}

async function awaitShadowRoot(parent, pollInterval = 100)
{
    return new Promise((resolve, reject) =>
    {
        let daInterval;

        function daThing()
        {
            const shadowRoot = parent.shadowRoot;

            if (shadowRoot != null && shadowRoot != undefined)
            {
                clearInterval(daInterval);
                resolve(shadowRoot);
            }
            else if (debugAwait)
            {
                console.log("awaiting " + parent.tagName + " shadowRoot");
            }
        }

        daThing();
        
        daInterval = setInterval(daThing, pollInterval);
    });
}

async function awaitNonBlankDocument(parent, pollInterval = 100)
{
    return new Promise((resolve, reject) =>
    {
        let daInterval;

        function daThing()
        {
            const daDocument = parent.contentDocument || parent.contentWindow;

            if (daDocument != null && daDocument != undefined)
            {
                const daLink = parent.contentWindow.location.href;

                if (daLink != "about:blank")
                {
                    clearInterval(daInterval);
                    resolve(daDocument);
                }
            }
            else if (debugAwait)
            {
                console.log("awaiting " + parent.tagName + " iframe link");
            }
        }

        daThing();
        
        daInterval = setInterval(daThing, pollInterval);
    });
}

function waitForTextContent(element)
{
    return new Promise((resolve, reject) =>
    {
        if (element && element.textContent.trim() !== '')
        {
            return resolve(element.textContent);
        }

        const observer = new MutationObserver(() =>
        {
            if (element && element.textContent.trim() !== '')
            {
                observer.disconnect();
                resolve(element.textContent);
            }
        });

        observer.observe(element || document.body,
        {
            childList: true,
            subtree: true,
            characterData: true
        });
    });
}

const colorData = {};
const settings = {};

async function getColors()
{
    const daReturnData = (await browser.storage.local.get(["colorData"]))["colorData"] || {};

    Object.entries(daReturnData).forEach((daThing) =>
    {
        colorData[daThing[0]] = daThing[1];
    });
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

getColors();
getSettings();

function invertColor(hex, bw)
{
    if (hex.indexOf("#") === 0)
    {
        hex = hex.slice(1);
    }

    if (hex.length === 3)
    {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    if (hex.length !== 6)
    {
        throw new Error("Invalid HEX color.");
    }

    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    
    if (bw)
    {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? "#000000"
            : "#FFFFFF";
    }
    
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);

    return "#" + padZero(r) + padZero(g) + padZero(b);
}

class ColorUpdater
{
    style;
    courseName;
    elements;

    constructor(courseName, style)
    {
        this.courseName = courseName;
        this.style = style;
        this.elements = [];
    }

    async updateColor()
    {
        let daColor;

        if (Object.hasOwn(colorData, this.courseName))
        {
            switch (this.style)
            {
                default:
                    daColor = colorData[this.courseName];
                    break;
                
                case "color":
                    daColor = invertColor(colorData[this.courseName], true);
                    break;
            }
        }
        else
        {
            switch (this.style)
            {
                default:
                    daColor = "#ffffff";
                    break;
                
                case "color":
                    daColor = "#000000";
                    break;
            }
        }

        for (const el of this.elements)
        {
            switch (this.style)
            {
                default:
                    el.style[this.style] = daColor;
                    break;
                case "value":
                    el[this.style] = daColor;
            }
        }
    }
}

const colorUpdaters = [];

function addElementToColorUpdater(courseName, element, style)
{
    let daUpdater = colorUpdaters.find(updater => updater.courseName == courseName && updater.style == style);
    if (daUpdater == null || daUpdater == undefined)
    {
        daUpdater = new ColorUpdater(courseName, style);
        colorUpdaters.push(daUpdater);
    }
    daUpdater.elements.push(element);
}

function updateCourseElements(courseName)
{
    for (const updater of colorUpdaters.filter(updater => updater.courseName == courseName))
    {
        updater.updateColor();
    }
}

async function saveColorData()
{
    await browser.storage.local.set({ colorData: colorData });
}

async function saveSettings()
{
    await browser.storage.local.set({ settings: settings });
}
