
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";


/* ================= FIREBASE CONFIG ================= */
const firebaseConfig = {
  apiKey: "AIzaSyAaidcD5gxQhjCLl8dn8q0-J5uSvoF5WcM",
  authDomain: "vtk-project-1de73.firebaseapp.com",
  projectId: "vtk-project-1de73",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


/* ================= STATE ================= */
let msgCount = 0;
let allProducts = [];


/* ================= AUTH PROTECTION ================= */
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.body.style.display = "block";
    show("dashboard");
    initRealtime();
  } else {
    window.location.href = "login.html";
  }
});


/* ================= NAVIGATION ================= */
window.show = function (id) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");

  if (id === "messages") {
    msgCount = 0;
    updateMsgDot();
  }
};


/* ================= INIT REALTIME ================= */
function initRealtime() {
  listenOrders();
  listenProducts();
  listenMessages();
}


/* ================= DASHBOARD ================= */
function updateDashboard(orders) {
  let revenue = 0;
  let paid = 0;
  let delivered = 0;

  orders.forEach(o => {
    const amount = Number(o.amount || 0);

    if (o.status === "paid") {
      revenue += amount;
      paid++;
    }

    if (o.status === "delivered") {
      delivered++;
    }
  });

  document.getElementById("totalRevenue").textContent = revenue;
  document.getElementById("totalOrders").textContent = orders.length;
  document.getElementById("paidOrders").textContent = paid;
  document.getElementById("deliveredOrders").textContent = delivered;
}


/* ================= ORDERS ================= */
function listenOrders() {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snap) => {
    const list = document.getElementById("ordersList");
    list.innerHTML = "";

    const orders = [];

    snap.forEach(docSnap => {
      const o = docSnap.data();
      orders.push(o);

      const div = document.createElement("div");
      div.className = "card order-card";

      div.innerHTML = `
        <div class="order-header">
          <h3>${o.name || "Customer"}</h3>
          <span class="status ${o.status}">${o.status}</span>
        </div>

        <p>Email: ${o.email}</p>
        <p>Phone: ${o.phone}</p>
        <p>Amount: ₦${o.amount}</p>

        <div class="order-actions">
          <button onclick="updateStatus('${docSnap.id}','paid')">Paid</button>
          <button onclick="updateStatus('${docSnap.id}','processing')">Processing</button>
          <button onclick="updateStatus('${docSnap.id}','delivered')">Delivered</button>
          <button onclick="updateStatus('${docSnap.id}','cancelled')">Cancel</button>
        </div>
      `;

      list.appendChild(div);
    });

    updateDashboard(orders);
  });
}


/* ================= UPDATE ORDER STATUS ================= */
window.updateStatus = async function (id, status) {
  await updateDoc(doc(db, "orders", id), {
    status,
    updatedAt: Date.now()
  });
};


/* ================= PRODUCTS ================= */

function listenProducts() {
  onSnapshot(collection(db, "products"), (snap) => {
    const list = document.getElementById("productList");

    if (!list) {
      console.error("productList not found in HTML");
      return;
    }

    list.innerHTML = "";

    allProducts = [];

    snap.forEach(docSnap => {
      const p = docSnap.data();
      p.id = docSnap.id;
      allProducts.push(p);

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <img src="${p.images?.[0] || p.image || ''}" 
        style="width:100%;height:150px;object-fit:cover;border-radius:10px;margin-bottom:10px;">

        <h3>${p.name || "No name"}</h3>
        <p>₦${p.price || 0}</p>
        <p>${p.desc || ""}</p>

        <button onclick="saveProduct('${p.id}')">Save</button>
        <button onclick="deleteProduct('${p.id}')">Delete</button>
      `;

      list.appendChild(div);
    });
  });
}

/* ================= ADD PRODUCT ================= */

window.addProduct = async function () {

  const name = document.getElementById("pname").value;
  const price = document.getElementById("pprice").value;
  const desc = document.getElementById("pdesc").value;

  if (!name || !price) {
    alert("Fill required fields");
    return;
  }

  await addDoc(collection(db, "products"), {
    name,
    price: Number(price),
    desc,
    images: ["", "", ""], // keeps structure consistent
    createdAt: Date.now()
  });

  alert("Product added");
};

/* ================= SAVE / UPDATE PRODUCT ================= */
window.saveProduct = async function (id) {

  const name = document.getElementById(`name-${id}`).value;
  const price = document.getElementById(`price-${id}`).value;
  const desc = document.getElementById(`desc-${id}`).value;

  const img1 = document.getElementById(`img1-${id}`).value;
  const img2 = document.getElementById(`img2-${id}`).value;
  const img3 = document.getElementById(`img3-${id}`).value;

  await updateDoc(doc(db, "products", id), {
    name,
    price: Number(price),
    desc,
    images: [img1, img2, img3],
    updatedAt: Date.now()
  });

  alert("Updated successfully");
};


/* ================= DELETE PRODUCT ================= */
window.deleteProduct = async function (id) {
  await deleteDoc(doc(db, "products", id));
  alert("Deleted");
};


/* ================= MESSAGES ================= */
function listenMessages() {
  onSnapshot(collection(db, "contactMessages"), (snap) => {
    const list = document.getElementById("messagesList");
    list.innerHTML = "";

    msgCount = snap.size;
    updateMsgDot();

    snap.forEach(docSnap => {
      const m = docSnap.data();

      const div = document.createElement("div");
      div.className = "card";

      div.innerHTML = `
        <h3>${m.name}</h3>
        <p>${m.email}</p>
        <p>${m.phone}</p>
        <p>${m.message}</p>
      `;

      list.appendChild(div);
    });
  });
}


/* ================= MESSAGE DOT ================= */
function updateMsgDot() {
  const dot = document.getElementById("msgDot");
  if (!dot) return;

  dot.style.display = msgCount > 0 ? "inline-block" : "none";
}


/* ================= LOGOUT ================= */
window.logout = function () {
  signOut(auth);
};