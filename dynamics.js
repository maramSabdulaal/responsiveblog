
const posts = [
    {
        id: 1,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        genre: "Classics",
        rating: 5,
        color: "#8c2f39",
        blurb: "Sharp wit, slow-burn romance and a heroine who refuses to settle. Still the funniest book about manners ever written."
    },
    {
        id: 2,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        genre: "Fantasy",
        rating: 5,
        color: "#234a3f",
        blurb: "A cozy hero, a grumpy dragon and an adventure that proves courage can come from the smallest places."
    },
    {
        id: 3,
        title: "Little Women",
        author: "Louisa May Alcott",
        genre: "Classics",
        rating: 4,
        color: "#4a5d8f",
        blurb: "Four sisters, big dreams and a lot of heart. Perfect for a rainy afternoon and a warm drink."
    },
    {
        id: 4,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        rating: 4,
        color: "#b5762a",
        blurb: "A short, gentle fable about following your dreams. Easy to read and easy to discuss with friends."
    },
    {
        id: 5,
        title: "Dune",
        author: "Frank Herbert",
        genre: "Sci-Fi",
        rating: 5,
        color: "#6b4a2d",
        blurb: "Politics, prophecy and sand. A dense world that rewards readers who stay with it."
    },
    {
        id: 6,
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry",
        genre: "Fiction",
        rating: 5,
        color: "#3a7f8f",
        blurb: "A tiny story with big ideas about friendship and growing up. Read it again at every age."
    }
];

const grid = document.getElementById("post-grid");
const filtersBox = document.getElementById("filters");
const searchInput = document.getElementById("search");
const empty = document.getElementById("empty");
const shelfList = document.getElementById("shelf-list");
const shelfEmpty = document.getElementById("shelf-empty");

let activeGenre = "All";
const shelf = new Set();

["All", ...new Set(posts.map(post => post.genre))].forEach(genre => {
    const button = document.createElement("button");

    button.textContent = genre;
    button.setAttribute("aria-pressed", String(genre === "All"));

    button.addEventListener("click", () => {
        activeGenre = genre;

        filtersBox.querySelectorAll("button").forEach(filterButton => {
            filterButton.setAttribute(
                "aria-pressed",
                String(filterButton === button)
            );
        });

        renderPosts();
    });

    filtersBox.appendChild(button);
});

function renderPosts() {
    const query = searchInput.value.trim().toLowerCase();

    const shown = posts.filter(post =>
        (activeGenre === "All" || post.genre === activeGenre) &&
        (post.title + " " + post.author).toLowerCase().includes(query)
    );

    grid.innerHTML = "";

    shown.forEach(post => {
        const card = document.createElement("article");
        const isSaved = shelf.has(post.id);

        card.className = "card";

        card.innerHTML = `
            <div class="cover" style="background:${post.color}">
                ${post.title}
            </div>
            <div class="card-body">
                <p class="meta">
                    ${post.author} &middot; ${post.genre} &middot;
                    <span class="stars" aria-label="${post.rating} out of 5 stars">
                        ${"★".repeat(post.rating)}${"☆".repeat(5 - post.rating)}
                    </span>
                </p>
                <h3>${post.title}</h3>
                <p>${post.blurb}</p>
                <button class="save" aria-pressed="${isSaved}">
                    ${isSaved ? "On your shelf" : "Save to shelf"}
                </button>
            </div>
        `;

        card.querySelector(".save").addEventListener("click", () => {
            toggleShelf(post.id);
        });

        grid.appendChild(card);
    });

    empty.hidden = shown.length > 0;
}

function toggleShelf(id) {
    if (shelf.has(id)) {
        shelf.delete(id);
    } else {
        shelf.add(id);
    }

    renderPosts();
    renderShelf();
}

function renderShelf() {
    shelfList.innerHTML = "";

    posts.filter(post => shelf.has(post.id)).forEach(post => {
        const listItem = document.createElement("li");
        const spine = document.createElement("button");

        spine.className = "spine";
        spine.style.background = post.color;
        spine.textContent = post.title;
        spine.title = "Remove " + post.title;
        spine.setAttribute("aria-label", "Remove " + post.title + " from shelf");

        spine.addEventListener("click", () => {
            toggleShelf(post.id);
        });

        listItem.appendChild(spine);
        shelfList.appendChild(listItem);
    });

    shelfEmpty.hidden = shelf.size > 0;
}

searchInput.addEventListener("input", renderPosts);

const form = document.getElementById("signup");
const msg = document.getElementById("signup-msg");

form.addEventListener("submit", event => {
    event.preventDefault();

    const email = form.email.value.trim();

    if (/^\S+@\S+\.\S+$/.test(email)) {
        msg.textContent = "Welcome to the club! Check your inbox soon.";
        form.reset();
    } else {
        msg.textContent = "Please enter a valid email address.";
    }
});

document.getElementById("year").textContent = new Date().getFullYear();

renderPosts();
renderShelf();
