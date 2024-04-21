$(document).ready(function() {
    $.getJSON('output.json', function(data) {
        var mangaList = $('#mangaList');

        // Ambil hanya 8 data pertama
        var limitedData = data.slice(0, 8);

        $.each(limitedData, function(index, manga) {
            var movieListItem = $('<li>'); // <li> tag untuk setiap data
            var movieCard = $('<div>').addClass('movie-card');
            
            // Buat link dengan href yang sesuai
            var movieLink = $('<a>').attr('href', 'detail.html?id=' + manga.id);
            
            var figure = $('<figure>').addClass('card-banner');
            var img = $('<img>').attr('src', manga.image_path).attr('alt', manga.title);

            figure.append(img);
            movieLink.append(figure);
            movieCard.append(movieLink);

            var titleWrapper = $('<div>').addClass('title-wrapper');
            var titleLink = $('<a>').attr('href', 'detail.html?id=' + manga.id);
            var title = $('<h3>').addClass('card-title').text(manga.title);
            var time = $('<time>').attr('datetime', manga.type).text(manga.type);

            titleLink.append(title);
            titleWrapper.append(titleLink);
            titleWrapper.append(time);
            movieCard.append(titleWrapper);

            var cardMeta = $('<div>').addClass('card-meta');
            var badge = $('<div>').addClass('badge badge-outline').text(manga.status);
            var rating = $('<div>').addClass('rating').html('<ion-icon name="star"></ion-icon><data>' + manga.rating + '</data>');

            cardMeta.append(badge);
            cardMeta.append(rating);
            movieCard.append(cardMeta);

            movieListItem.append(movieCard); // Masukkan movie card ke dalam <li>
            mangaList.append(movieListItem); // Masukkan <li> ke dalam list
        });
    });
});
