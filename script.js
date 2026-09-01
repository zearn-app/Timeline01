/*
  ILAI HANDMADES DEMO
  ------------------------------------------------
  EDIT THESE VALUES when the real business details
  are available.
*/
const CONFIG = {
  WHATSAPP_NUMBER: "", // Example: "919876543210" — do NOT add + or spaces
  INSTAGRAM_URL: "https://instagram.com/ilai_handmades",
  YOUTUBE_URL: ""
};

const products = [
  {id:1,name:"Handmade Earrings",category:"Handmade Jewellery",description:"A beautiful demo piece for the handmade jewellery collection.",image:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=82",price:null,available:true,featured:true,newArrival:true},
  {id:2,name:"Pearl Jewellery",category:"Imitation Jewellery",description:"An elegant pearl-inspired demo design for special moments.",image:"https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=800&q=82",price:null,available:true,featured:true,newArrival:false},
  {id:3,name:"Floral Jewellery",category:"Handmade Jewellery",description:"A soft floral-inspired demo piece with a handcrafted feel.",image:"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=82",price:null,available:true,featured:true,newArrival:true},
  {id:4,name:"Statement Earrings",category:"Imitation Jewellery",description:"A statement demo style designed to elevate an occasion look.",image:"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=82",price:null,available:true,featured:true,newArrival:false},
  {id:5,name:"Custom Gift Box",category:"Customised Gifts",description:"A demo gift-box concept that can be personalised for your occasion.",image:"https://images.unsplash.com/photo-1513885535751-8b9238bd345a?auto=format&fit=crop&w=800&q=82",price:null,available:true,featured:true,newArrival:true},
  {id:6,name:"Return Gift Set",category:"Return Gifts",description:"A demo return-gift set suitable for celebrations and events.",image:"https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=82",price:null,available:true,featured:true,newArrival:false},
  {id:7,name:"Handmade Bracelet",category:"Handmade Jewellery",description:"A simple handcrafted bracelet concept for the catalogue.",image:"https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=800&q=82",price:null,available:true,featured:false,newArrival:true},
  {id:8,name:"Customised Gift",category:"Special Occasion Gifts",description:"A flexible demo concept for birthdays, weddings and meaningful occasions.",image:"https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&w=800&q=82",price:null,available:true,featured:false,newArrival:true}
];

let cart = JSON.parse(localStorage.getItem("ilaiCart") || "[]");
let activeFilter = "";
let searchTerm = "";

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

function saveCart(){ localStorage.setItem("ilaiCart", JSON.stringify(cart)); }
function priceText(p){ return p.price ? `₹${Number(p.price).toLocaleString("en-IN")}` : "Price on Request"; }

function renderProducts(){
  const grid = $("#productGrid");
  const empty = $("#emptyState");
  const term = searchTerm.toLowerCase().trim();

  const filtered = products.filter(p => {
    const categoryMatch = !activeFilter || p.category === activeFilter || (activeFilter === "New Arrivals" && p.newArrival);
    const searchMatch = !term || `${p.name} ${p.category} ${p.description}`.toLowerCase().includes(term);
    return p.available && categoryMatch && searchMatch;
  });

  grid.innerHTML = filtered.map(p => `
    <article class="product-card">
      <button class="product-image" data-product="${p.id}" aria-label="View ${p.name}">
        <img loading="lazy" src="${p.image}" alt="${p.name}">
      </button>
      <div class="product-info">
        <small>${p.category}</small>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="product-bottom">
          <span class="price">${priceText(p)}</span>
          <div class="card-actions">
            <button class="small-btn" data-product="${p.id}">View</button>
            <button class="small-btn dark" data-add="${p.id}">Add</button>
          </div>
        </div>
      </div>
    </article>`).join("");

  empty.style.display = filtered.length ? "none" : "block";
}

function renderNewProducts(){
  $("#newProducts").innerHTML = products.filter(p => p.newArrival).map(p => `
    <article class="mini-product">
      <img loading="lazy" src="${p.image}" alt="${p.name}">
      <div><h3>${p.name}</h3><p>${priceText(p)}</p>
      <button data-product="${p.id}">View Product →</button></div>
    </article>`).join("");
}

function openProduct(id){
  const p = products.find(x => x.id === Number(id));
  if(!p) return;
  $("#modalContent").innerHTML = `
    <div class="modal-product">
      <img src="${p.image}" alt="${p.name}">
      <div class="modal-info">
        <span class="eyebrow">${p.category}</span>
        <h2>${p.name}</h2>
        <p>${p.description}</p>
        <div class="options"><b>Price:</b> ${priceText(p)}<br><b>Availability:</b> Available for enquiry</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn btn-dark" data-add="${p.id}">Add to Enquiry Cart</button>
          <button class="btn btn-outline" data-product-whatsapp="${p.id}">Order on WhatsApp</button>
        </div>
      </div>
    </div>`;
  $("#productModal").classList.add("open");
  $("#overlay").classList.add("show");
}

function addToCart(id){
  const p = products.find(x => x.id === Number(id));
  if(!p) return;
  const existing = cart.find(x => x.id === p.id);
  if(existing) existing.qty++;
  else cart.push({id:p.id,qty:1});
  saveCart(); renderCart(); updateCartCount();
  showToast("Added to enquiry cart");
}

function removeFromCart(id){ cart = cart.filter(x => x.id !== Number(id)); saveCart(); renderCart(); updateCartCount(); }
function changeQty(id,delta){
  const item = cart.find(x => x.id === Number(id));
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id); else { saveCart(); renderCart(); }
}

function renderCart(){
  const box = $("#cartItems");
  if(!cart.length){
    box.innerHTML = `<div style="text-align:center;padding:70px 10px;color:#788078"><div style="font-size:35px">🛍</div><h3 style="font-family:'Playfair Display';margin:10px">Your enquiry cart is empty</h3><p style="font-size:11px">Add products you'd like to enquire about.</p></div>`;
    return;
  }
  box.innerHTML = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `<div class="cart-item">
      <img src="${p.image}" alt="${p.name}">
      <div><h4>${p.name}</h4><p>${priceText(p)}</p>
      <div class="qty"><button data-minus="${p.id}">−</button><b>${item.qty}</b><button data-plus="${p.id}">+</button></div></div>
      <button class="remove" data-remove="${p.id}">Remove</button>
    </div>`;
  }).join("");
}

function updateCartCount(){ $("#cartCount").textContent = cart.reduce((a,b)=>a+b.qty,0); }

function getWhatsAppUrl(message){
  if(!CONFIG.WHATSAPP_NUMBER){
    alert("Demo setup: Please add the real WhatsApp number to CONFIG.WHATSAPP_NUMBER in script.js.");
    return null;
  }
  return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message){
  const url = getWhatsAppUrl(message);
  if(url) window.open(url,"_blank","noopener");
}

function productMessage(p){
  return `Hi Ilai Handmades,\nI'm interested in ${p.name}.\nPlease share the details and availability.`;
}

function cartMessage(){
  const lines = cart.map(item => {
    const p = products.find(x => x.id === item.id);
    return `• ${p.name} × ${item.qty} — ${priceText(p)}`;
  });
  return `Hi Ilai Handmades,\nI'd like to enquire about these products:\n\n${lines.join("\n")}\n\nPlease share availability and final pricing.\nThank you!`;
}

function showToast(text){
  const t=document.createElement("div");
  t.textContent=text;
  t.style.cssText="position:fixed;left:50%;bottom:78px;transform:translateX(-50%);z-index:120;background:#2d352e;color:#fff;padding:10px 16px;border-radius:30px;font-size:11px;box-shadow:0 8px 25px #0003";
  document.body.appendChild(t); setTimeout(()=>t.remove(),1800);
}

function closePanels(){
  $("#cartDrawer").classList.remove("open");
  $("#productModal").classList.remove("open");
  $("#overlay").classList.remove("show");
}

document.addEventListener("click", e => {
  const productBtn = e.target.closest("[data-product]");
  if(productBtn) openProduct(productBtn.dataset.product);

  const addBtn = e.target.closest("[data-add]");
  if(addBtn) addToCart(addBtn.dataset.add);

  const removeBtn = e.target.closest("[data-remove]");
  if(removeBtn) removeFromCart(removeBtn.dataset.remove);

  const plus = e.target.closest("[data-plus]");
  if(plus) changeQty(plus.dataset.plus,1);

  const minus = e.target.closest("[data-minus]");
  if(minus) changeQty(minus.dataset.minus,-1);

  const wp = e.target.closest(".whatsapp-action");
  if(wp) openWhatsApp(wp.dataset.message);

  const pwp = e.target.closest("[data-product-whatsapp]");
  if(pwp){
    const p=products.find(x=>x.id===Number(pwp.dataset.product));
    if(p) openWhatsApp(productMessage(p));
  }

  const cat = e.target.closest("[data-filter]");
  if(cat){
    activeFilter = cat.dataset.filter;
    searchTerm = "";
    $("#searchInput").value = "";
    renderProducts();
    $("#jewellery").scrollIntoView({behavior:"smooth"});
  }

  const scrollFilter = e.target.closest("[data-scroll-filter]");
  if(scrollFilter){
    activeFilter = scrollFilter.dataset.scrollFilter;
    searchTerm = "";
    $("#searchInput").value = "";
    renderProducts();
    $("#jewellery").scrollIntoView({behavior:"smooth"});
  }
});

$("#searchBtn").addEventListener("click",()=>{
  $("#searchWrap").scrollIntoView({behavior:"smooth",block:"center"});
  setTimeout(()=>$("#searchInput").focus(),350);
});
$("#searchInput").addEventListener("input",e=>{searchTerm=e.target.value;renderProducts()});
$("#resetFilter").addEventListener("click",()=>{activeFilter="";searchTerm="";$("#searchInput").value="";renderProducts()});

$("#cartBtn").addEventListener("click",()=>{renderCart();$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")});
$("#cartClose").addEventListener("click",closePanels);
$("#overlay").addEventListener("click",closePanels);
$("#modalClose").addEventListener("click",closePanels);

$("#cartWhatsapp").addEventListener("click",()=>{
  if(!cart.length){showToast("Add a product first");return}
  openWhatsApp(cartMessage());
});

$("#menuBtn").addEventListener("click",()=>$("#mobileMenu").classList.add("open"));
$("#mobileClose").addEventListener("click",()=>$("#mobileMenu").classList.remove("open"));
$$(".mobile-menu a").forEach(a=>a.addEventListener("click",()=>$("#mobileMenu").classList.remove("open")));

$("#wishlistBtn").addEventListener("click",()=>showToast("Wishlist is ready for future product management"));

window.addEventListener("scroll",()=>{
  $("#navbar").classList.toggle("scrolled",window.scrollY>30);
  $("#backTop").classList.toggle("show",window.scrollY>500);
});
$("#backTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add("visible")});
},{threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));

renderProducts();
renderNewProducts();
renderCart();
updateCartCount();
