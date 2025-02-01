import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, startAfter } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzcQqYtEQ3z5OkSKqEMJVWMXt_PPt3-7M",
  authDomain: "thahonfeel.firebaseapp.com",
  projectId: "thahonfeel",
  storageBucket: "thahonfeel.firebasestorage.app",
  messagingSenderId: "158125876658",
  appId: "1:158125876658:web:ff1823a28f557458f030ab",
  measurementId: "G-VC8ZMKP2R2"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);


const contentsCol = collection(db, 'contents');

let lastVisible = null;
let isEndOfData = false;

async function submitcontent(e) {
  e.preventDefault();

  const userName = document.getElementById('userName').value;
  const usercontent = document.getElementById('usercontent').value;

  const docRef = await addDoc(contentsCol, {
    name: userName,
    content: usercontent,
    timestamp: new Date().toISOString()
  });

  document.getElementById('contentForm').reset();
}

async function displaycontents(nextPage = false) {
  const contentList = document.getElementById('contentList');
  if (!nextPage) {
    contentList.innerHTML = '';
    lastVisible = null;
    isEndOfData = false;
  }

  let q = query(contentsCol, orderBy("timestamp", "desc"), limit(10));
  if (nextPage && lastVisible) {
    q = query(contentsCol, orderBy("timestamp", "desc"), startAfter(lastVisible), limit(10));
  }

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const content = doc.data();

    const li = document.createElement('li');
    li.textContent = content.name + ': ' + content.content;
    contentList.appendChild(li);
  });

  lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
  if (querySnapshot.docs.length < 10) {
    isEndOfData = true;
  }
}

function nextPage() {
  if (isEndOfData) {
    displaycontents(false);
  } else {
    displaycontents(true);
  }
}

document.getElementById('contentForm').addEventListener('submit', submitcontent);

displaycontents();
