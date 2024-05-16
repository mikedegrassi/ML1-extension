document.getElementById('addPanelButton').addEventListener('click', function() {
    event.preventDefault()

    const inputArea = document.getElementById('inputArea');
    const panelNumber = document.querySelectorAll('#inputArea .panel').length + 1;
    const panelGroup = document.createElement('div');
    panelGroup.classList.add('panel');
    panelGroup.setAttribute('data-panel-number', panelNumber);

    // Title Label and Input
    const titleLabel = document.createElement('label');
    const titleId = 'title' + panelNumber;
    titleLabel.setAttribute('for', titleId);
    titleLabel.textContent = `Title for Panel ${panelNumber}`;
    const titleInput = document.createElement('input');
    titleInput.setAttribute('id', titleId);
    titleInput.type = 'text';
    titleInput.name =  `panels[${panelNumber - 1}][title]`;

    // Description Label and Textarea
    const descriptionLabel = document.createElement('label');
    const descriptionId = 'description' + panelNumber;
    descriptionLabel.setAttribute('for', descriptionId);
    descriptionLabel.textContent = `Description for Panel ${panelNumber}`;
    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.setAttribute('id', descriptionId);
    descriptionTextarea.rows = 4;
    descriptionTextarea.name = `panels[${panelNumber - 1}][description]`;

    panelGroup.appendChild(titleLabel);
    panelGroup.appendChild(titleInput);
    panelGroup.appendChild(descriptionLabel);
    panelGroup.appendChild(descriptionTextarea);

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        inputArea.removeChild(panelGroup);
        updatePanelNumbers();
    };
    panelGroup.appendChild(deleteButton);

    inputArea.appendChild(panelGroup);
});

function updatePanelNumbers() {
    const panels = document.querySelectorAll('#inputArea .panel');
    panels.forEach((panel, index) => {
        const newIndex = index + 1;
        panel.querySelector('label[for^="title"]').textContent = `Title for Panel ${newIndex}`;
        panel.querySelector('label[for^="description"]').textContent = `Description for Panel ${newIndex}`;

        const titleInput = panel.querySelector('input[type="text"]');
        const descriptionTextarea = panel.querySelector('textarea');

        const titleId = 'title' + newIndex;
        const descriptionId = 'description' + newIndex;

        panel.querySelector('label[for^="title"]').setAttribute('for', titleId);
        titleInput.setAttribute('id', titleId);

        panel.querySelector('label[for^="description"]').setAttribute('for', descriptionId);
        descriptionTextarea.setAttribute('id', descriptionId);

        panel.setAttribute('data-panel-number', newIndex);
    });
}

const availableTags = ["Nieuws", "Educatie", "Technologie", "Sport", "Kunst", "Wetenschap", "Verkeer"];
const selectedTags = new Set(); // Houdt geselecteerde tags bij

document.getElementById('tagSearchInput').addEventListener('input', function() {
    const searchQuery = this.value.toLowerCase();
    const filteredTags = availableTags.filter(tag => tag.toLowerCase().includes(searchQuery));

    const filteredTagsContainer = document.getElementById('filteredTags');
    filteredTagsContainer.innerHTML = ''; // Reset de lijst

    filteredTags.forEach(tag => {
        if (!selectedTags.has(tag)) { // Toon alleen niet-geselecteerde tags
            const tagElement = document.createElement('div');
            tagElement.textContent = tag;
            tagElement.className = 'filteredTag';
            tagElement.addEventListener('click', () => selectTag(tag));
            filteredTagsContainer.appendChild(tagElement);
        }
    });
});

function selectTag(tag) {
    selectedTags.add(tag);
    updateSelectedTagsDisplay();
    document.getElementById('tagSearchInput').value = ''; // Reset zoekveld
    document.getElementById('filteredTags').innerHTML = ''; // Verberg gefilterde tags
}

function updateSelectedTagsDisplay() {
    const selectedTagsContainer = document.getElementById('selectedTags');
    selectedTagsContainer.innerHTML = ''; // Reset de weergave

    selectedTags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.textContent = tag;
        tagElement.className = 'selectedTag';
        const removeBtn = document.createElement('span');
        removeBtn.textContent = ' x';
        removeBtn.className = 'remove-tag';
        removeBtn.addEventListener('click', () => {
            selectedTags.delete(tag);
            updateSelectedTagsDisplay();
        });
        tagElement.appendChild(removeBtn);
        selectedTagsContainer.appendChild(tagElement);
    });
}

document.getElementById('showExampleButton').addEventListener('click', function() {
    console.log(window.location.href);
    window.location.href = 'example.html';
});





