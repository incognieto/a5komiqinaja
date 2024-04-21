$(document).ready(function () {
    $.getJSON('output.json', function (data) {
      $('#scrap').DataTable({
        data: data,
        columns: [
          { data: 'rank' },
          { data: 'title' },
          { data: 'publishTime' },
          { data: 'authors', render: function (data) { return data.join(', '); } },
          { data: 'status' },
          { data: 'type', render: function (data) { return data.join(', '); } },
          { data: 'rating' },
          { data: 'genre', render: function (data) { return data.join(', '); } },
          { data: 'characters', render: function (data) { return data.join(', '); } },
          { data: 'sinopsis' }
        ],
        "order": [[0, "asc"]]
      });
    });
  });
  