/**
 * 1. FONCTION COMMUNE
 * Cette fonction va chercher le fichier JSON et le transforme en objet utilisable.
 */
async function chargerArticles() {
    // fetch() demande au navigateur d'aller chercher le fichier
    const reponse = await fetch('articles.json'); 
    // .json() traduit le texte brut du fichier en une liste d'objets JS
    const articles = await reponse.json(); 
    return articles; // On renvoie la liste
}

/**
 * 2. LOGIQUE PAGE ACCUEIL (index.html)
 */
// On vérifie si l'élément 'liste-articles' existe sur la page actuelle
if (document.getElementById('liste-articles')) {
    // On appelle notre fonction de chargement
    chargerArticles().then(articles => {
        const conteneur = document.getElementById('liste-articles');
        conteneur.innerHTML = ''; // On efface le message "Chargement..."

        // Pour chaque article trouvé dans le JSON...
        articles.forEach(art => {
            const div = document.createElement('div'); // On crée un bloc <div>
            div.className = 'article-preview'; // On lui donne la classe CSS
            // On écrit le HTML à l'intérieur du bloc avec les données de l'article
            div.innerHTML = `
                <h2>${art.titre}</h2>
                <p>${art.date}</p>
                <p>${art.resume}</p>
                <a href="article.html?id=${art.id}">Lire la suite</a>
            `;
            // On ajoute ce bloc dans la zone principale du HTML
            conteneur.appendChild(div);
        });
    });
}

/**
 * 3. LOGIQUE PAGE ARTICLE (article.html)
 */
// On vérifie si on est sur la page de lecture
if (document.getElementById('art-titre')) {
    // On récupère l'ID passé dans l'URL (ex: ?id=mon-premier-article)
    const params = new URLSearchParams(window.location.search);
    const idArticle = params.get('id');

    chargerArticles().then(articles => {
        // On cherche dans la liste l'article qui a le même ID que celui de l'URL
        const article = articles.find(a => a.id === idArticle);

        if (article) {
            // On remplit les balises vides avec les vraies infos
            document.title = article.titre; // Change le nom de l'onglet
            document.getElementById('art-titre').innerText = article.titre;
            document.getElementById('art-date').innerText = article.date;
            // .innerHTML car le contenu peut contenir des balises <p> ou <b>
            document.getElementById('art-contenu').innerHTML = article.contenu;
        } else {
            // Si l'ID dans l'URL est faux ou inexistant
            document.getElementById('art-contenu').innerText = "Article introuvable.";
        }
    });
}