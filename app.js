let shop = document.getElementById('shop')
let basket = JSON.parse(localStorage.getItem("data")) || []
let selectedCategories = [];

fetch('https://fakestoreapi.com/products')
    .then(data => data.json())
    .then((data) => {
        let allCategory = [];
        let CategoryList = document.querySelector('.CategoryList');

        let generateShop = (allCheckCategory = []) => {
            CategoryList.innerHTML = '';
            allCategory = [];

            data.forEach((x) => {
                if (!allCategory.includes(x.category)) {
                    allCategory.push(x.category);
                    const isChecked = allCheckCategory.includes(x.category) ? 'checked' : '';
                    CategoryList.innerHTML += `
                        <label><input type="checkbox" onchange="categoryFilter()" value="${x.category}" ${isChecked}>${x.category}</label>`;
                }
            });

            shop.innerHTML = data.map((x) => {
                let { id, category, title, price, description, image, rating } = x;
                let search = basket.find((x) => x.id === id) || [];

                if (allCheckCategory.length === 0 || allCheckCategory.includes(category)) {
                    return `
                <div id=product-id-${id} class="items">
                    <img width="100%" height="250px" src=${image} alt="">
                    <div class="details">
                        <h5>${category}</h5>
                        <h4>${title}</h4>
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
                </div>`;
                }
            }).join("");

            addReadMoreFunctionality();

        };

        generateShop();

        window.categoryFilter = () => {
            let checkInput = document.querySelectorAll(".CategoryList input[type='checkbox']");
            let checkData = [];
            selectedCategories = [];
            checkInput.forEach((e) => {
                if (e.checked) {
                    checkData.push(e.value);
                }
            });
            generateShop(checkData);
        };
    })
    .catch((err) => {
        console.log(err);
    });
    
const dropdownButton = document.querySelector('.dropdown-button');
const dropdownButtonIcon = document.querySelector('.dropdown-button i');
const dropdownContent = document.querySelector('.dropdown-content');

dropdownButton.addEventListener('click', function () {
    if (dropdownContent.style.display === 'block') {
        dropdownButtonIcon.style.transform = 'rotate(0deg)';
        dropdownContent.style.display = 'none';
    } else {
        dropdownButtonIcon.style.transform = 'rotate(180deg)';
        dropdownContent.style.display = 'block';
    }
});

document.addEventListener('click', function (event) {
    if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
        dropdownContent.style.display = 'none';
        dropdownButtonIcon.style.transform = 'rotate(0deg)';
    }
});

document.addEventListener('click', function (event) {
    if (!dropdownButton.contains(event.target) && !dropdownContent.contains(event.target)) {
        dropdownContent.style.display = 'none';
    }
});

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