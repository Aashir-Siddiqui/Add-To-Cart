let productsData = []
let label = document.getElementById('label')
let shoppingCart = document.getElementById('shopping-cart')
let basket = JSON.parse(localStorage.getItem("data")) || []

fetch('https://fakestoreapi.com/products')
    .then(data => data.json())
    .then((data) => {
        productsData = data;
        generateCartItems();
    })
    .catch((err) => {
        console.log(err)
    })

let generateCartItems = () => {
    if (basket.length !== 0) {
        shoppingCart.innerHTML = basket.map((x) => {
            let { id, item } = x
            let search = productsData.find((y) => y.id === id) || {}
            return `
                <div class="cart-items">
                    <img width="100%" height="250px" height="250px" src=${search.image} alt="">
                        <div class="details">

                            <div class="title-price-x">
                                <div class="title-price">
                                    <div class="cart-item-price">$ ${search.price}</div>
                                </div>
                                <h4>${search.title}</h4>
                                <p>${search.description}</p>
                            </div>
                            <div class="buttons">
                                <button onclick="decrement(${id})"><i class="fa-solid fa-minus"></i></button>
                                <div id=${id} class="quantity">${item}</div>
                                <button onclick="increment(${id})"><i class="fa-solid fa-plus"></i></button>
                            </div>
                            <div class="rating">
                                <p><i class="bi bi-star-fill"></i> ${search.rating.rate}</p>
                            </div>

                            <div class="cartItemBottom">
                                <h2>$ ${(item * search.price).toFixed(2)}</h2>
                                <i onclick="removeItem(${id})" class="fa-solid fa-xmark"></i>
                            </div>
                        </div>
                </div>`
        }).join("")
    } else {
        shoppingCart.innerHTML = ``
        label.innerHTML = `
            <h1>Cart is Empty</h1>
            <a href="index.html" class="home-btn finalBtn">Back to home</a>
            `
    }
    TotalAmount();

    addReadMoreFunctionality()
}

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
    generateCartItems()
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
    generateCartItems()
    localStorage.setItem("data", JSON.stringify(basket))
}

let update = (id) => {
    let search = basket.find((x) => x.id === id)
    if (!search) return;
    if (search === undefined) {
        basket.push({
            id: selectedItem,
            item: 1,
        })
    }
    document.getElementById(id).innerHTML = search.item
    calculation()
    TotalAmount()
}

let calculation = () => {
    let cartIcon = document.getElementById('cartAmount')
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0)
}
calculation()

let removeItem = (id) => {
    let selectedItem = id;
    basket = basket.filter((x) => x.id !== selectedItem);
    calculation()
    generateCartItems();
    TotalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
    basket = [];
    calculation()
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket
            .map((x) => {
                let product = productsData.find(p => p.id === x.id) || { price: 0 };
                return x.item * product.price;
            })
            .reduce((x, y) => x + y, 0);

        label.innerHTML = `
            <h1>Total Bill : $ ${amount.toFixed(2)}</h1>
            <div class="final-btns">
                <button class="checkout finalBtn">Checkout</button>
                <button onclick="clearCart()" class="removeAll finalBtn">Clear Cart</button>
            </div>`;
    } else {
        label.innerHTML = `
            <h1>Cart is Empty</h1>
            <a href="index.html" class="home-btn finalBtn">Back to home</a>`;
    }
};

TotalAmount();