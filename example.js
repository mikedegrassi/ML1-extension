window.onload = async function () {
    fetch('/get-article-data')
        .then(response => response.json())
        .then(data => {
            // Toon de data
            document.getElementById('article-title-example').textContent = data['article-title'];
            document.getElementById('title-description-example').textContent = data['title-description'];
            document.getElementById('article-url-example').textContent = data['article-url'];
            document.getElementById('tag1-example').textContent = data['tag1'];
            document.getElementById('tag2-example').textContent = data['tag2'];
            document.getElementById('article-platform-example').textContent = data['article-platform'];

            // Creëer verborgen inputs voor elke waarde
            createHiddenInput('article-title', data['article-title']);
            createHiddenInput('title-description', data['title-description']);
            createHiddenInput('article-url', data['article-url']);
            createHiddenInput('tag1', data['tag1']);
            createHiddenInput('tag2', data['tag2']);
            createHiddenInput('article-platform', data['article-platform']);

            const panels = data.panels;
            for (let index = 0; index < panels.length; index++) {
                createPanel(panels[index], index + 1);
            }
        });
};

function createHiddenInput(name, value) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', name);
    input.setAttribute('value', value);

    const form = document.getElementById('articleForm');
    form.appendChild(input);
}

async function createPanel(panelData, panelNumber) {
    const inputArea = document.getElementById('inputArea');

    const panelContainer = document.createElement('div');
    panelContainer.classList.add('panel-container');

    const panelGroup = document.createElement('div');
    panelGroup.classList.add('panel');
    panelGroup.setAttribute('data-panel-number', panelNumber);

    // Titel
    const titleLabel = document.createElement('label');
    const titleId = 'title' + panelNumber;
    titleLabel.setAttribute('for', titleId);
    titleLabel.textContent = `Title for Panel ${panelNumber}:`;

    const titleText = document.createElement('div');
    titleText.setAttribute('id', titleId + '-text');
    titleText.classList.add('input-replacement');
    titleText.textContent = panelData.title || '';

    // Verborgen input voor de titel
    const titleHiddenInput = document.createElement('input');
    titleHiddenInput.setAttribute('type', 'hidden');
    titleHiddenInput.setAttribute('name', `panels[${panelNumber - 1}][title]`);
    titleHiddenInput.value = panelData.title || '';

    // Beschrijving
    const descriptionLabel = document.createElement('label');
    const descriptionId = 'description' + panelNumber;
    descriptionLabel.setAttribute('for', descriptionId);
    descriptionLabel.textContent = `Description for Panel ${panelNumber}:`;

    const descriptionText = document.createElement('div');
    descriptionText.setAttribute('id', descriptionId + '-text');
    descriptionText.classList.add('input-replacement');
    descriptionText.textContent = panelData.description || '';

    // Verborgen input voor de beschrijving
    const descriptionHiddenInput = document.createElement('input');
    descriptionHiddenInput.setAttribute('type', 'hidden');
    descriptionHiddenInput.setAttribute('name', `panels[${panelNumber - 1}][description]`);
    descriptionHiddenInput.value = panelData.description || '';

    // Verborgen input voor de afbeelding URL
    const imageInput = document.createElement('input');
    imageInput.setAttribute('type', 'hidden');
    imageInput.setAttribute('name', `panels[${panelNumber - 1}][img]`);
    imageInput.value = panelData.img || '';

    // Verborgen input voor het gewicht (panelNumber)
    const weightInput = document.createElement('input');
    weightInput.setAttribute('type', 'hidden');
    weightInput.setAttribute('name', `panels[${panelNumber - 1}][weight]`);
    weightInput.value = panelNumber; // Gebruik panelNumber als de waarde

    // Afbeelding
    const img = document.createElement('img');
    img.src = panelData.imageUrl;
    img.style.display = 'flex';
    img.style.maxWidth = '100%';
    img.style.borderRadius = '5px';

    panelGroup.appendChild(titleLabel);
    panelGroup.appendChild(titleText);
    panelGroup.appendChild(titleHiddenInput);
    panelGroup.appendChild(descriptionLabel);
    panelGroup.appendChild(descriptionText);
    panelGroup.appendChild(descriptionHiddenInput);
    panelGroup.appendChild(imageInput);
    panelGroup.appendChild(weightInput);

    panelContainer.appendChild(panelGroup);
    panelContainer.appendChild(img);

    inputArea.appendChild(panelContainer);
}

document.getElementById('previousPageButton').addEventListener('click', function () {
    window.location.href = 'index.html';
});
