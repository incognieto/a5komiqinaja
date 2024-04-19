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
        # clean_title = title.replace(":", "")

        # Mendapatkan sinopsis
        sinopsis = "".join(response.css("[itemprop='description']::text").getall())

        # Mendapatkan genre
        genre = response.css("span[itemprop='genre']::text").getall()

        # Mendapatkan karakter
        characters = []
        character_images = {}
        for character in response.css("div.detail-characters-list a"):
            character_name = character.css("::text").get().strip()
            if character_name:
                characters.append(character_name)
                image_url = character.css("img::attr(data-src)").get()
                character_images[character_name] = image_url

        # Mendapatkan status
        status = response.css("div.spaceit_pad")
        statusIndex = 0
        for i in range(len(status)):
            if status[i].css("span::text").get()=="Status:":
                statusIndex = i

        # Mendapatkan publish time
        publishTime = response.css("div.spaceit_pad")
        publishTimeIndex = 0
        for i in range(len(publishTime)):
            if publishTime[i].css("span::text").get()=="Published:":
                publishTimeIndex = i

        # Mendapatkan Author
        authors = response.css("div.spaceit_pad")
        authorsIndex = 0
        for i in range(len(authors)):
            if authors[i].css("span::text").get()=="Authors:":
                authorsIndex = i

        # Mendapatkan Type
        type = response.css("div.spaceit_pad")
        typeIndex = 0
        for i in range(len(type)):
            if type[i].css("span::text").get()=="Type:":
                typeIndex = i
        
        # ______________Cover Generator @nieto______________

        image_url = response.css("img::attr(data-src)").get() # Penyimpanan gambar

        file_name = image_url.split("/")[-1]  # Extracting image file name from URL
        image_id = file_name.split(".")[0]  # Extracting ID from file name

        directory = "../outputScrap/cover" # Complete path for image storage in the "cover" folder
        if not os.path.exists(directory):
            os.makedirs(directory)
        image_path = f"{directory}/{file_name}"

        with open(image_path, "wb") as f: # Saving image to the file system
            f.write(urllib.request.urlopen(image_url).read())


        # ______________Scrap Item______________
        item = {
            "rank": rank,  # ranking manga
            "id": image_id,  # ID from image file name
            "title": title,  # judul manga
            "publishTime": publishTime[publishTimeIndex].css("div.spaceit_pad").css("div.spaceit_pad::text").get(), # published time manga
            "authors": response.css("div.spaceit_pad")[authorsIndex].css("a::text").getall(), # author manga
            "status": status[statusIndex].css("div.spaceit_pad").css("div.spaceit_pad::text").get(), # status manga
            "type": response.css("div.spaceit_pad")[typeIndex].css("a::text").getall(), # jenis manga
            "rating": rating,  # rating manga
            "genre": genre,  # genre manga
            "characters": characters,  # karakter manga
            "sinopsis": sinopsis,  # sinopsis manga
            "image_path": image_path,
        }

        yield item

