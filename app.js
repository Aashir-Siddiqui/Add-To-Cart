let shop = document.getElementById('shop')
let basket = JSON.parse(localStorage.getItem("data")) || []

fetch('https://fakestoreapi.com/products')
    .then(data => data.json())
    .then((data) => {
        let generateShop = () => {
            return shop.innerHTML = data.map((x) => {
                let { id, title, price, description, image, rating } = x
                let search = basket.find((x) => x.id === id) || []
                return `
                <div id=product-id-${id} class="items">
                    <img width="100%" height="250px" src=${image} alt="">
                    <div class="details">
                        <h5>${title}</h5>
                        <p>${description}</p>
                        <div class="price">
                            <h2>$${price}</h2>
                            <div class="buttons">
                                <button onclick="decrement(${id})"><i class="fa-solid fa-minus"></i></button>
                                <div id=${id} class="quantity">${search.item === undefined ? 0 : search.item}</div>
                                <button onclick="increment(${id})"><i class="fa-solid fa-plus"></i></button>
                            </div>
                        </div>
                    </div>
                    <div class="rating">
                        <p><i class="bi bi-star-fill"></i> ${rating.rate}</p>
                    </div>
                </div>`
            }).join("")
        }
        generateShop()

        addReadMoreFunctionality()
    })
    .catch((err) => {
        console.log(err)
    })

function addReadMoreFunctionality() {
    document.querySelectorAll('.details p').forEach(p => {
        const readMoreLink = document.createElement('a');
        readMoreLink.classList.add('read-more-link');
        readMoreLink.textContent = 'Read More';
        p.insertAdjacentElement('afterend', readMoreLink);

        readMoreLink.addEventListener('click', function (e) {
            e.preventDefault();
            p.classList.toggle('expanded');
            this.textContent = p.classList.contains('expanded') ? 'Read Less' : 'Read More';
        });
    });
}

let increment = (id) => {
    let selectedItem = id
    let search = basket.find((x) => x.id === selectedItem)
    if (search === undefined) {
        basket.push({
            id: selectedItem,
            item: 1,
        })
    }
    else {
        search.item += 1
    }
    update(selectedItem)
    localStorage.setItem("data", JSON.stringify(basket))
}

let decrement = (id) => {
    let selectedItem = id
    let search = basket.find((x) => x.id === selectedItem)
    if (search === undefined) return;
    else if (search.item === 0) return;
    else {
        search.item -= 1
    }
    update(selectedItem)
    basket = basket.filter((x) => x.item !== 0)
    localStorage.setItem("data", JSON.stringify(basket))
}

let update = (id) => {
    let search = basket.find((x) => x.id === id)
    if (search === undefined) {
        basket.push({
            id: selectedItem,
            item: 1,
        })
    }
    document.getElementById(id).innerHTML = search.item
    calculation()
}

let calculation = () => {
    let cartIcon = document.getElementById('cartAmount')
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0)
}
calculation()