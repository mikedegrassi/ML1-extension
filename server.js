const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// In een Express route bestand of controller
const { db } = require('./db')// Pas het pad aan naar waar je firebaseConfig.js is opgeslagen
const { collection, addDoc } = require("firebase/firestore");

let articleData = {}; // Tijdelijke opslag voor artikel data

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serveert je HTML, CSS, en JavaScript bestanden

app.use(cors());

// Endpoint om data te ontvangen van index.html
    app.post('/submit-article', async (req, res) => {
    const panels = req.body.panels
    try{

        const imageRequests = panels.map((panel, index) =>
            axios.post('https://api.openai.com/v1/images/generations', {
                model: 'dall-e-3',
                prompt: `${panel.description} in disney style`,
                n: 1,
                size: "1024x1024"
            }, {
                headers: {
                    'Authorization': `Bearer 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`,
                    'Content-Type': 'application/json'
                }
            }).then(async response => {
                const imageUrl = response.data.data[0].url; // Verkrijg de afbeeldings-URL
                const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
                const filename = `panel_image_${index}_${timestamp}.png`;
                const outputPath = path.join(__dirname, '..', 'public', 'images', filename);
                await downloadImage(imageUrl, outputPath); // Geef de unieke bestandsnaam door aan downloadImage
return { ...panel, imageUrl: `/images/${filename}`, img:imageUrl }; // Gebruik de lokale pad voor imageUrl
}).catch(error => {
    console.error('Error met paneel:', panel.description, error.response.data);
    return { ...panel, imageUrl: null }; // Behandel fouten
})
);

const panelsWithImages = await Promise.all(imageRequests);
articleData = { ...req.body, panels: panelsWithImages }; // + img url
res.redirect('/example.html');
} catch (error) {
    console.error('Error:', error);
    res.status(500).send(error);
}
});

async function downloadImage(url, outputPath) {
    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'arraybuffer', // Zorg ervoor dat de data als een buffer wordt ontvangen
        });

        // Gebruik fs.writeFile om de buffer naar een bestand te schrijven
        await fs.promises.writeFile(outputPath, response.data, (err) => {
            if (err) {
                console.error('Fout bij het opslaan van de afbeelding:', err);
                return;
            }
            console.log('Afbeelding succesvol opgeslagen:', outputPath);
        });
    } catch (error) {
        console.error('Fout bij het downloaden van de afbeelding:', error);
    }
}

async function addArticleToFirestore(data) {
    try {
        const articleData = {
            title: data['article-title'] || 'Geen titel', // Default waarde als backup
            description: data['title-description'] || 'Geen beschrijving',
            platform: data['article-platform'] || 'Geen platform',
            url: data['article-url'] || 'Geen URL',
            tag1: [data.tag1 || 'Geen tag'],
            tag2: [data.tag2 || 'Geen tag']// Aannemend dat je altijd twee tags hebt
        };

        // Artikel toevoegen aan Firestore
        const docRef = await addDoc(collection(db, "articles"), articleData);
        console.log("Article written with ID: ", docRef.id);

        // Panels toevoegen met verwijzing naar het artikel
        await addPanelsToFirestore(data.panels, docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

async function addPanelsToFirestore(panels, articleId) {
    try {
        const panelsCollection = collection(db, "panel");

        // Loop door elk panel en voeg toe aan Firestore
        for (const panel of panels) {
            await addDoc(panelsCollection, {
                ...panel,
                articleId // Voeg de FK toe als 'articleId'
            });
        }
    } catch (e) {
        console.error("Error adding panels: ", e);
    }
}

app.post('/send-article', async(req, res) => {
    console.log("heel het artikel:", req.body);
    await addArticleToFirestore(req.body)
    res.redirect('/success.html');
});

// Endpoint om opgeslagen data beschikbaar te maken voor example.html
app.get('/get-article-data', (req, res) => {
    res.json(articleData); // Stuur de opgeslagen data als JSON
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
