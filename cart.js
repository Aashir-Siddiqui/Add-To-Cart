let label = document.getElementById('label')
let shoppingCart = document.getElementById('shopping-cart')

let basket = JSON.parse(localStorage.getItem("Data")) || []

fetch('https://fakestoreapi.com/products')
    .then(data => data.json())
    .then((data) => {

        let generateCartItems = () => {
            if (basket.length !== 0) {
                return shoppingCart.innerHTML = basket.map((x) => {
                    let { id, item } = x
                    let search = data.find((y) => y.id === id) || []
                    return `
                    <div class="cart-items">
                        <img width="100%" height="250px" height="250px" src=${search.image} alt="">

                        <div class="details">
                            <div class="title-price-x">
                                <h4 class="title-price">
                                    <p>${search.title}</p>
                                    
                                </h4>
                                <p class="cart-item-price">$ ${search.price}</p>
                            </div>

                            <div class="buttons">
                                <button onclick="decrement(${id})"><i class="bi bi-dash-lg"></i></button>
                                <div id=${id} class="quantity">${item}</div>
                                <button onclick="increment(${id})"><i class="bi bi-plus-lg"></i></button>
                            </div>

                            <h3>$ ${item * search.price}</h3>
                            <i onclick="removeItem(${id})" class="bi bi-x-lg"></i>
                            </div>
                        </div>
                    </div>
                    `
                }).join("")
            }
            else {
                shoppingCart.innerHTML = ``
                label.innerHTML = `
                <h2>Cart is Empty</h2>
                <a href="index.html" class="home-btn">Back to home
                </a>
                `
            }
        }
        generateCartItems()

    })
    .catch((err) => {
        console.log(err)
    })


let calculation = () => {
    let cartIcon = document.getElementById('cartAmount')
    cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0)
}
calculation()


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
    // console.log(basket)
    update(selectedItem)
    localStorage.setItem("Data", JSON.stringify(basket))
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
    // console.log(basket)
    localStorage.setItem("Data", JSON.stringify(basket))
}

let update = (id) => {
    let search = basket.find((x) => x.id === id)
    if (search === undefined) {
        basket.push({
            id: selectedItem,
            item: 1,
        })
    }
    // console.log(search.item)
    document.getElementById(id).innerHTML = search.item
    calculation()
}

let removeItem = (id) => {
    let selectedItem = id;
    // console.log(selectedItem.id);
    basket = basket.filter((x) => x.id !== selectedItem.id);
    generateCartItems();
    TotalAmount();
    localStorage.setItem("data", JSON.stringify(basket));
};

let clearCart = () => {
    basket = [];
    generateCartItems();
    localStorage.setItem("data", JSON.stringify(basket));
};

let TotalAmount = () => {
    if (basket.length !== 0) {
        let amount = basket
            .map((x) => {
                let { item, id } = x;
                let search = basket.find((y) => y.id === id) || [];

                return item * search.price;
            })
            .reduce((x, y) => x + y, 0);
        // console.log(amount);
        label.innerHTML = `
      <h2>Total Bill : $ ${amount}</h2>
      <button class="checkout">Checkout</button>
      <button onclick="clearCart()" class="removeAll">Clear Cart</button>
      `;
    } else return;
};

TotalAmount();