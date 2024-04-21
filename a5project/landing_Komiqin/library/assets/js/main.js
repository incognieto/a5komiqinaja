const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
    
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

// Remove menu mobile
const navLinks = document.querySelectorAll('.nav__link');

function linkAction() {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.remove('show-menu');
}

navLinks.forEach(link => {
    link.addEventListener('click', linkAction);
});

// Scroll sections active link
function scrollHeader() {
    const header = document.getElementById('header');
    if (this.scrollY >= 50) {
        header.classList.add('scroll-header');
    } else {
        header.classList.remove('scroll-header');
    }
}

window.addEventListener('scroll', scrollHeader);

// Scroll sections active link
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav__menu a[href*=${sectionId}]`).classList.add('active-link');
        } else {
            document.querySelector(`.nav__menu a[href*=${sectionId}]`).classList.remove('active-link');
        }
    });
}

window.addEventListener('scroll', scrollActive);

// Grap data!
fetch('../../data/manga/outputScrap/output.json')
    .then(response => response.json())
    .then(data => {
        const content = document.getElementById('animeon');
        for (let i = 0; i < 100; i++) {
            content.innerHTML += `
                <div class="anime__img">
                    <a href="detail.html?id=${data[i].id}">
                        <div class="image__emision">
                            <img loading="lazy" src="${data[i].image_path}" alt="${data[i].title} Poster">
                        </div>
                        <div class="anime__img-info">
                            <h3>${data[i].title}</h3>
                            <p>${data[i].type}</p>
                        </div>
                    </a>
                </div>
            `;
        }
    })
    .catch(err => console.error(err));

fetch('../../data/manga/outputScrap/output.json')
    .then(response => response.json())
    .then(data => {
        const content = document.getElementById('animetop');
        for (let i = 0; i < 10; i++) {
            content.innerHTML += `
                <div class="anime__top swiper-slide">
                    <a href="detail.html?id=${data[i].id}">
                        <div class="anime__top-img">
                            <img loading="lazy" src="${data[i].image_path}" alt="${data[i].title} Poster" class="popular__img">
                        </div>
                        <div class="popular__anime-title">
                            <h2>${data[i].title}</h2>
                            <p>#${data[i].rank}</p>
                        </div>
                        <div class="popular__anime-subtitle">
                            <h3>${data[i].status}</h3>
                            <p>∙</p>
                            <p>${data[i].type}</p>
                        </div>
                        <p class="popular-anime-description">
                            ${data[i].sinopsis}
                        </p>
                    </a>
                </div>
            `;
        }
    })
    .catch(err => console.error(err));

// Initialize current page
var currentPage = 1;
var animePerPage = 100; // Change this to adjust the number of anime per page
var totalAnime = 0; // Variable to store the total number of anime

// Function to display anime for a given page
function displayAnime(page) {
    fetch('../../data/manga/outputScrap/output.json')
        .then(response => response.json())
        .then(data => {
            totalAnime = data.length;
            var startIndex = (page - 1) * animePerPage;
            var endIndex = Math.min(startIndex + animePerPage, totalAnime);
            var content = '';

            for (let i = startIndex; i < endIndex; i++) {
                content += `
                    <div class="anime__img">
                        <a href="detail.html?id=${data[i].id}">
                            <div class="image__emision">
                                <img loading="lazy" src="${data[i].image_path}" alt="${data[i].title} Poster">
                            </div>
                            <div class="anime__img-info">
                                <h3>${data[i].title}</h3>
                                <p>${data[i].type}</p>
                            </div>
                        </a>
                    </div>
                `;
            }

            const animeContainer = document.getElementById('animeon');
            animeContainer.innerHTML = content;

            updatePagination();
        })
        .catch(err => console.error(err));
}

// Function to update pagination based on current page and total anime
function updatePagination() {
    var totalPages = Math.ceil(totalAnime / animePerPage);
    var pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        var listItem = document.createElement('li');
        listItem.classList.add('page-item');
        if (i === currentPage) {
            listItem.classList.add('active');
        }
        var link = document.createElement('a');
        link.classList.add('page-link');
        link.href = '#';
        link.textContent = i;
        listItem.appendChild(link);
        pagination.appendChild(listItem);
    }
}

// Event listener for page number
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('page-link')) {
        currentPage = parseInt(event.target.textContent);
        displayAnime(currentPage);
    }
});

// Initial display of anime
displayAnime(currentPage);