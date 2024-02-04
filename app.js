const form = document.querySelector("#search__form");
const showsDisplay = document.querySelector(".shows__display");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
        document.querySelector(".shows__display").textContent = "";
        const query = form.elements.search__text.value;
        const config = { params: { q: query } }
        const shows = await axios.get(`https://api.tvmaze.com/search/shows`, config);
        form.elements.search__text.value = "";

        for (const each of shows.data) {
            const { name, image, id } = each.show;

            const div = document.createElement("div");
            div.classList.add("show__div");
            showsDisplay.append(div);

            const p = document.createElement("p");
            p.textContent = name;
            p.classList.add("show__name");
            p.setAttribute("id", id);
            div.append(p);

            const img = document.createElement("img");
            img.classList.add("show__image")
            if (image) {
                const imgs = Object.values(image);
                img.src = imgs[imgs.length - 1];
            }
            else {
                img.src = "images/unavailable.jpg"
                img.classList.add("unavailable")
            }

            const footer = document.createElement("p");
            footer.classList.add("show__footer");
            div.append(footer);

            const info = document.createElement("span");
            info.classList.add("show__info");
            info.textContent = "More information";

            div.append(img)
            div.append(footer);
            footer.appendChild(info)

            info.addEventListener("click", () => showDetails(id))
        }
        return query;
    } catch (e) {
        console.log("Something went wrong :(")
        console.log(e);
    }
})

const showDetails = async (showId) => {
    try {

        const req = await axios.get(`https://api.tvmaze.com/shows/${showId}`);
        const show = await req.data;

        const background = document.createElement("div");
        background.classList.add("details__background");

        const container = document.createElement("div");
        container.classList.add("details__container");

        const img = document.createElement("img");
        img.classList.add("details__img");
        if (show.image) {
            const imgs = Object.values(show.image);
            img.src = imgs[imgs.length - 1];
        }
        else {
            img.src = "images/unavailable.jpg"
            img.classList.add("unavailable")
        }

        const details__description = document.createElement("div");
        details__description.classList.add("details__description");

        background.addEventListener("click", (e) => {
            e.target.classList.contains("details__background") && e.target.remove();
        })

        document.querySelector("main").append(background);
        background.append(container);
        container.append(img);
        container.append(details__description);

        if (show.name) {
            const name = document.createElement("p");
            name.classList.add("details__name");
            name.textContent = `${show.name}`;
            details__description.append(name);
        }

        if (show.language) {
            const language = document.createElement("p");
            language.textContent = `Language: ${show.language}`;
            details__description.append(language);
        }

        if (show.premiered) {
            const premiered = document.createElement("p");
            premiered.textContent = `Premier date: ${show.premiered}`;
            details__description.append(premiered);
            if (show.ended) {
                const ended = document.createElement("p");
                ended.textContent = `End date: ${show.ended}`;
                details__description.append(ended);
            }
        }

        if (show.genres.length) {
            const genres = document.createElement("p");
            genres.textContent = `Genre: ${show.genres.join(", ")}`;
            details__description.append(genres);
        }

        if (show.url) {
            const url = document.createElement("p");
            url.innerHTML = `See more on TVmaze: <a href=${show.url} target="_blank">Click here</a>`;
            url.classList.add("details__link");
            details__description.append(url);
        }

        if (show.officialSite) {
            const website = document.createElement("p");
            website.classList.add("details__link");
            website.innerHTML = `Official Website: <a href=${show.officialSite} target="_blank">Click here</a>`;
            details__description.append(website);
        }

        if (show.summary) {
            const summary = document.createElement("div");
            summary.classList.add("details__summary");
            summary.innerHTML = `${show.summary}`;
            container.append(summary);
        }

    } catch (error) {
        console.log("Something went wrong :(")
        console.log(e);
    }
}
