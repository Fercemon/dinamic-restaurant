function openNav() { //open nav on mobile version
    document.querySelector(".mobile-nav").style.width = "30%";
    document.querySelector("body").style.marginLeft = "30%";
}

function closeNav() { //close nav on mobile version
    document.querySelector(".mobile-nav").style.width = "0";
    document.querySelector("body").style.marginLeft = "0";
}





//we set all the const we need in the global scope
let productlist_link = "http://kea-alt-del.dk/t5/api/productlist"; //link where we are gonna get the data from with all the products
const catLink = "http://kea-alt-del.dk/t5/api/categories"; // link where we get the categories of the prducts from
let imge_path = "https://kea-alt-del.dk/t5/site/imgs/small/"; //link where we are gonna get the imgs from
let singleProduct_link = "http://kea-alt-del.dk/t5/api/product"; //link where we are gonna get the data from for a single item
const main = document.querySelector("main"); //get the main section
const nav = document.querySelector(".nav-menu"); //get the menu nav
//to get our template with its content, don't forget to write content at the end otherwise it won't work
let template = document.querySelector("#myTemp").content;
// to get the description and fetch the data for a single item
const pLink = "http://kea-alt-del.dk/t5/api/product?id="; //link
const description = document.querySelector(".description");


//fetching the data from the categories link
fetch(catLink).then(result => result.json()).then(data => createCats(data));


//Defining the function to creat the categories
function createCats(categories) {
    categories.forEach(category => { //defining the function to run for each category
        const section = document.createElement("section"); //creat a section for each category
        const h2 = document.createElement("h2"); //create a h2 for

        section.id = category;
        h2.textContent = category;
        section.appendChild(h2);
        main.appendChild(section);

        const a = document.createElement("a");
        a.textContent = category;
        a.href = "#";
        a.addEventListener("click", e =>{
            e.preventDefault();
            filter(category);
        });

        nav.appendChild(a);
    })
    // to fetch the data from the link to our website. It takes the data from the link transform it to json object and make it readable for javaScript
    fetch(productlist_link).then(e => e.json()).then(data => show(data));
}


//functions to move de sections to the left and right

function moveLeft() {
    document.querySelector("article").classList.add(moveL);
}

function moveRight() {
    document.querySelector("article").classList.add(moveR);
}


//navigation to filter the menu depends of the category

const all = document.querySelector("nav a"); //get all a in nav-menu
all.addEventListener("click", () => filter("all")); //onclick call the fuction filter

function filter(category) {
    document.querySelectorAll("main section").forEach(section => {
        if (section.id == category || category == "all") {
            section.style.display = "block";
            section.style.display = "grid";
        } else {
            section.style.display = "none";
        }
    })
}




//when we already got the data, with the function show()we specify what to do what the data
function show(data) {

    //WE ALWAYS HAVE TO USE FOR EACH WHEN WORKING WITH ARRAYS
    // ELEMENT => IS THE FASTER WAY TO SET THE FUNCTION WE WANT TO USE FOR OUR DATA
    data.forEach(element => {

        const section = document.querySelector("#" + element.category);
        //WE CLONE THE CONTENT OF THE TEMPLATE
        const clone = template.cloneNode(true);
        const moreBtn = clone.querySelector(".btn");

        clone.querySelector("h1").textContent = element.name; //SET THE NAME OF THE PRODUCT IN THE H1
        clone.querySelector("img").src = imge_path + element.image + "-sm.jpg"; //SET THE CORRECT IMAGE
        clone.querySelector("h2 span").textContent = element.price; //SET THE PRICE OF THE PRODUCT IN THE H2


        moreBtn.textContent = "+"; //SET THE + SYMBOL IN THE A

        // IF WE HAVE DISCOUNT OR IN OTHER WORDS, IF THE DISCOUNT IS MORE THAN 0 DO SOMTHING
        if (element.discount) {

            let discountPrice = element.price * ((100 - element.discount) / 100); //SET THE PRICE MULTIPLY BY THE DISCOUNT IN % GETTIN THE NEW PRICE AFTER APPLY THE DISCOUNT
            let newPrice = discountPrice.toFixed(2); // TO GET ONLY 2 DECIMALS
            clone.querySelector("h2 span").textContent = newPrice; // SET THE NEW PRICE IN SPAN
            clone.querySelector("del").textContent = element.price; //SET THE ORIGINAL PRICE IN THE DEL ELEMENT
            clone.querySelector("del").style.color = "red"; // CHANFE THE COLOR OF THE DEL ELEMENT TO RED

            //IF THE DISCOUNT IS NOT MORE THAN 0 DO SOMETHING
        } else {
            clone.querySelector("del").remove(); //REMOVE THE DEL ELEMENT
        }


        if(!element.vegetarian){
            clone.querySelector(".fa-carrot").remove();
        }

        if(!element.alcohol){
            clone.querySelector(".fa-glass-martini").remove();
        }

        if(element.soldout){
           const article = clone.querySelector("article");
            article.classList.add("soldout");
            const message = document.createElement("p");
            message.textContent = "Sold out";
            message.classList.add("message");
            article.appendChild(message);

        }



        section.appendChild(clone);


        //onclick on + btn get overlay with the correct prduct id
        moreBtn.addEventListener("click", () => {
            fetch(pLink + element.id).then(e => e.json()).then(data => showDetails(data));
        });

    });

}


description.addEventListener("click", () => description.style.display = "none");



function showDetails(product) {

    description.querySelector(".description-name").textContent = product.name;
    description.querySelector(".description-img").src = imge_path + product.image + "-sm.jpg";
    description.querySelector(".description-description").textContent = product.longdescription;
    description.querySelector("h2 span").textContent = product.price;

if(product.discount) {
    description.querySelector("h2 span").textContent = product.price - (product.price * product.discount/100);

    description.querySelector("h2 del").textContent = product.price;
    description.querySelector("h2 del").style.color = "red";

}else {
    document.querySelector(".discount").style.display = "none";
}


    if(!product.vegetarian){
            description.querySelector(".fa-carrot").style.display = "none";
        }

        if(!product.alcohol){
            description.querySelector(".fa-glass-martini").style.display = "none";
        }


    description.style.display = "block";

}





//to close the full description of the product
function closeDescription() {
    document.querySelector(".description").style.display = "none";
    document.querySelector(".discount").style.display = "block";
    document.querySelector(".fa-glass-martini").style.display = "block";
    document.querySelector(".fa-carrot").style.display = "block";
}
