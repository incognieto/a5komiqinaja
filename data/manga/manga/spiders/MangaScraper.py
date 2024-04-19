import scrapy
from scrapy import Request
import os
import urllib.request

class MangaSpider(scrapy.Spider):
    name = "manga-spider"
    start_urls = ["https://myanimelist.net/topmanga.php"]

    def parse(self, response):
        for manga in response.css("tr.ranking-list"):
            rank = manga.css("span.lightLink.top-anime-rank-text::text").get()
            title = manga.css("a.hoverinfo_trigger.fs14.fw-b::text").get()
            link = manga.css("a.hoverinfo_trigger.fs14.fw-b::attr(href)").get()
            rating = manga.css("span.text.on.score-label::text").get()

            yield Request(
                url=link,
                callback=self.intoData,
                meta={"rank": rank, "title": title, "rating": rating},
            )

        next_page = response.css("a.link-blue-box.next::attr(href)").get()
        if next_page is not None:
            next_page_url = "https://myanimelist.net/topmanga.php" + next_page
            yield response.follow(next_page_url, callback=self.parse)

    def intoData(self, response):
        rank = response.meta["rank"]
        title = response.meta["title"]
        rating = response.meta["rating"]

        # Membersihkan judul dari karakter yang tidak valid
        clean_title = title.replace(":", "")

        # Mendapatkan sinopsis
        sinopsis = "".join(response.css("[itemprop='description']::text").getall())

        # Mendapatkan genre
        genre = response.css("span[itemprop='genre']::text").getall()

        item = {
            "rank": rank,
            "title": title,
            "rating": rating,
            "genre": genre,
            "sinopsis": sinopsis
        }
        # ------------------------ (!) Jangan coba coba menggenerate Gambar kalau Laptop mu tidak mau nge lag ---------------------------

        # image_url = response.css("img::attr(data-src)").get()

        # # Path lengkap untuk penyimpanan gambar dalam folder "cover"
        # directory = "../outputScrap/cover"
        # if not os.path.exists(directory):
        #     os.makedirs(directory)
        # image_name = f"{directory}/{clean_title}.jpg"

        # # Menyimpan gambar ke dalam sistem file
        # with open(image_name, "wb") as f:
        #     f.write(urllib.request.urlopen(image_url).read())

        # # Menambahkan keterangan gambar ke dalam item
        # item["image_path"] = image_name

        # --------------------------------------------------------------------------------------------------------------------------------

        yield item

