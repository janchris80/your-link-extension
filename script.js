'use strict';

document.addEventListener('DOMContentLoaded', function () {
    const listEl = document.getElementById('ul-el');
    const saveBtn = document.getElementById('save-btn');

    let linksFromLocalStorage = JSON.parse(localStorage.getItem('links'));
    let links = [];

    if (linksFromLocalStorage) {
        links = linksFromLocalStorage;
        renderLinks();
    }
    links = unique(links);

    function unique(arr) {
        let result = [];
        for (let str of arr) {
            let isUnique = true;
            for (let el of result) {
                if (str[0] === el[0]) {
                    isUnique = false;
                    break;
                }
            }
            if (isUnique) {
                result.push(str);
            }
        }
        return result;
    }

    function renderLinks() {
        let listItems = '';
        links = unique(links);
        for (let i = links.length - 1; i >= 0; i--) {
            console.log(links[i][0]);
            listItems += `
            <li>
            <a
            href = "${links[i][0]}" target = "_blank"> <span class= "title">${links[i][2]}</span>
            <span class = "url"> ${links[i][0]}</span>
            </a>
            </li>
        `;
        }
        listEl.innerHTML = listItems;
    }

    async function loaded() {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            let url = tabs[0].url;
            let webTitle = tabs[0].title;
            const regex = /^https:\/\/([\w.-]+)\/([\w-]+)-episode-(\d+)\.html$/;
            const match = regex.exec(url);

            if (match !== null) {

                const domain = match[1];
                const title = match[2];
                const episodeNumber = match[3];
                if (domain.includes('watchasian')) {

                    console.log(url); // "https://www1.watchasian.id/may-i-help-you-2022-episode-9.html"
                    console.log(domain); // "www1.watchasian.id"
                    console.log(webTitle); // "Watch May I Help You (2022) Episode 9 Online With English sub,FullHD | Dramacool"
                    console.log(title); // "may-i-help-you-2022"
                    console.log(episodeNumber); // "9"
                    console.log(tabs); // "9"

                    const index = links.findIndex(elem => elem[2] === title); // find the item with title
                    if (index !== -1) {
                        links.splice(index, 1);
                    }

                    links.push([url, webTitle, title, episodeNumber]);

                    localStorage.setItem('links', JSON.stringify(links));
                    // Save links to links.json file
                    // saveLinksToFileNew(links);
                } else {
                    console.log('domain has changed');
                }
            } else {
                console.log("No match found.");
            }

            renderLinks();
        });
    }

    loaded();

    // chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
    //     // Check if the page has finished loading
    //     if (changeInfo.status === 'complete') {
    //         // Do something here
    //         console.log('Page finished loading:', tab.url);
    //         console.log(tabId, changeInfo, tab);
    //         await loaded();
    //     }

    //     await loaded();
    // });


    // Function to save links to links.json file
    function saveLinksToFileNew(links) {
        const data = JSON.stringify(links, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'links.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    saveBtn.addEventListener('click', async () => {
        const linksFromLocalStorage = JSON.parse(localStorage.getItem('links'));
        // const fileHandle = await window.showSaveFilePicker();
        // const writable = await fileHandle.createWritable();
        // await writable.write(JSON.stringify(linksFromLocalStorage));
        // await writable.close();

        saveLinksToFile(linksFromLocalStorage)
    });

    async function saveLinksToFile(links) {
        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: 'links.json',
                types: [
                    {
                        description: 'JSON Files',
                        accept: {
                            'application/json': ['.json'],
                        },
                    },
                ],
            });

            const writable = await fileHandle.createWritable();
            await writable.write(JSON.stringify(links, null, 2));
            await writable.close();
            console.log('Links saved to file.');
        } catch (error) {
            console.error(error);
        }
    }
});