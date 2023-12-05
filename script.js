'use strict';

document.addEventListener('DOMContentLoaded', async function () {
    const listEl = document.getElementById('ul-el');
    let listItems = '';

    let linksFromLocalStorage = await fetchData();

    const regex = /^https:\/\/([\w.-]+)\/([\w-]+)-episode-(\d+)\.html$/;

    linksFromLocalStorage.map((link) => {
        const match = regex.exec(link.url);
        console.log(match);

        listItems += `
            <li class="list-group-item">
                <div class="card" id="${match[2]}">
                    <div class="card-body">
                        <h5 class="card-title">${match[2]}</h5>
                        <h6 class="card-subtitle mb-2 text-body-secondary">Episode ${match[3]}</h6>
                        <a href="${match[0]}" target="_self" class="card-link">Open URL</a>
                    </div>
                </div>
            </li>
        `;
    });

    listEl.innerHTML = listItems;

    async function fetchData() {
        const apiURL = 'http://127.0.0.1:8001/api/v1/public/visited-websites';

        const data = await fetch(apiURL);
        const json = await data.json();

        return json;
    }
});