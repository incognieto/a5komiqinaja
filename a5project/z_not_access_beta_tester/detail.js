// Function to fetch and display manga details
function displayMangaDetails(mangaId) {
    // Fetch manga details based on mangaId
    fetch(`output.json`)
        .then(response => response.json())
        .then(data => {
            const manga = data.find(item => item.id === mangaId);

            // Check if manga is found
            if (manga) {
                // Update manga title
                document.querySelector('.manga-title').innerHTML = `
                    <h1 class="h1 detail-title">${manga.title}</h1>
                `;

                // Update manga synopsis
                document.querySelector('.manga-sinopsis').innerHTML = `
                    <p class='storyline'>${manga.sinopsis}</p>
                `;

                // Update manga image
                document.getElementById('mangaImage').innerHTML = `
                    <img src="${manga.image_path}" alt="${manga.title} Poster" style="height: auto; width: auto;">
                `;

                // Update manga Type
                document.querySelector('.manga-type').innerHTML = `
                    <p class='detail-subtitle'>${manga.type}</p>
                `;

                //Update manga Rating
                document.querySelector('.manga-rating').innerHTML = `
                    <div class='badge badge-fill'>${manga.rating}</div>
                `;

                //Update manga Status
                document.querySelector('.manga-status').innerHTML = `
                    <div class='badge badge-outline'>${manga.status}</div>
                `;

                // Update manga genres
                const genreWrapper = document.getElementById('manga-genre');
                genreWrapper.innerHTML = manga.genre.map(genre => `<a href="#">${genre}</a>`).join(', ');

                //Update manga publishTime
                document.querySelector('.manga-date').innerHTML = `
                    <p>${manga.publishTime}</p>
                `;

                //Update manga Authors
                document.querySelector('.manga-authors').innerHTML = `
                    <p>${manga.authors}</p>
                `;

                // Update download link
                document.getElementById('downloadLink').setAttribute('href', manga.image_path);
            } else {
                // If manga is not found, display an error message
                document.querySelector('.manga-title').innerHTML = '<p>Manga not found</p>';
                document.querySelector('.manga-sinopsis').innerHTML = '<p>Manga not found</p>';
                document.querySelector('.manga-type').innerHTML = '<p>Manga not found</p>';
                document.querySelector('.manga-rating').innerHTML = '<p>Manga not found</p>';
                document.querySelector('.manga-status').innerHTML = '<p>Manga not found</p>';
                document.querySelector('.manga-date').innerHTML = '<p>Manga not found</p>';
                document.querySelector('.manga-authors').innerHTML = '<p>Manga not found</p>';
                genreWrapper.innerHTML = '<p>Manga not found</p>';
                document.getElementById('mangaImage').innerHTML = '';
                document.getElementById('downloadLink').setAttribute('href', '#');
            }
        })
        .catch(err => {
            console.error(err);
            document.querySelector('.manga-title').innerHTML = '<p>Failed to load manga details</p>';
            document.querySelector('.manga-sinopsis').innerHTML = '<p>Failed to load manga details</p>';
            document.querySelector('.manga-type').innerHTML = '<p>Failed to load manga details</p>';
            document.querySelector('.manga-rating').innerHTML = '<p>Failed to load manga details</p>';
            document.querySelector('.manga-status').innerHTML = '<p>Failed to load manga details</p>';
            document.querySelector('.manga-authors').innerHTML = '<p>Failed to load manga details</p>';
            document.querySelector('.manga-date').innerHTML = '<p>Failed to load manga details</p>';
            genreWrapper.innerHTML = '<p>Failed to load manga details</p>';
            document.getElementById('mangaImage').innerHTML = '';
            document.getElementById('downloadLink').setAttribute('href', '#');
        });
}

// Call the function when the page loads to get mangaId from URL
window.onload = function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mangaId = urlParams.get('id');

    // Call the function to display manga details
    displayMangaDetails(mangaId);
};
