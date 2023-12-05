'use strict';

document.addEventListener('DOMContentLoaded', async function () {

    const apiURL = 'https://r4teczx7axxokwllr5wqjaeloe0pkdtk.lambda-url.ap-southeast-1.on.aws/api/v1/public/visited-websites';

    const listEl = document.getElementById('ul-el');
    let listItems = '';
    let linksFromLocalStorage = await fetchData();

    const regex = /^https:\/\/([\w.-]+)\/([\w-]+)-episode-(\d+)\.html$/;

    linksFromLocalStorage.map((link) => {
        console.log(link);
        const match = regex.exec(link.url);

        listItems += `
            <li class="list-group-item">
                <div class="card bg-success-subtle" id="${match[2]}">
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
        const data = await fetch(apiURL);
        const json = await data.json();

        return json;
    }
});