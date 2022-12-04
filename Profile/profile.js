

/*1*/
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-app.js';
import { getFirestore, collection, getDocs,getDoc, setDoc, addDoc, doc } from 'https://www.gstatic.com/firebasejs/9.8.2/firebase-firestore.js';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9_NRBMWMhilmQ-rYHu8YXC5aXMucxdWU",
    authDomain: "max-eg.firebaseapp.com",
    projectId: "max-eg",
    storageBucket: "max-eg.appspot.com",
    messagingSenderId: "832213298246",
    appId: "1:832213298246:web:149af181774289bd2eae47",
    measurementId: "G-PR45N85QT2"
};

firebase.initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let X;

async function getCit(db,X) {
  const citiesCol = collection(db,`${X}`);
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  return cityList;
}
/*1*/



/* start get all accounts */
let AllAccounts;
function getCards() {
  getCit(db, 'accounts').then(async (e) => {
    AllAccounts = e;
    // console.log(AllAccounts)
  })
}
/* end get all accounts */




/* start set id on all Posts */
function setIdForAllPosts(){
  getDocs(collection(db,"posts")).then(snap=>{
      snap.docs.forEach(el=>{
          setDoc(doc(db,"posts",el.id), {
              ...el.data(),
              id: el.id,
          })
      })
      getPosts()
  })
}
setIdForAllPosts()
/* end set id on all docs */


/* start get posts */
let AllPosts;
let personPosts;
function getPosts() {

  const url = window.location.href;
  const searchParams = new URL(url).searchParams; 
  const urlSearchParams = new URLSearchParams(searchParams);
  let personid = urlSearchParams.get('PersonId');
  


  getCit(db, 'posts').then(async (e) => {
    AllPosts = e;
    personPosts=AllPosts.filter(e=>e.personId==personid);

    personPosts=personPosts.sort(function(a, b) {
      return a.textTime - b.textTime;
    });
    personPosts=personPosts.reverse();

    showPosts(personPosts);
  })
}
/* end get posts */


function showPosts(personPosts){
  personPosts.forEach(e=>{

    if(e.textImg=="undefined"){
      document.querySelector('.posts-dad').innerHTML+=`
    
      <div class="post-container">
        <div class="post-row">
          <div class="user-profile">
            <img src="images/profile-pic.jpg" class="person-img"/>
            <div>
              <p class="person-name"> </p>
              <span>September 25 2022, 14:55 pm</span>
            </div>
          </div>
          <a href="#"><i class="fa-solid fa-ellipsis-v"></i></a>
        </div>
        <p class="post-text">
          ${e.text}
        </p>
  
        <div class="post-row">
          <div class="activity-icons">
            <div><img src="images/like-blue.png" /> 75k+</div>
            <div><img src="images/comments.png" /> 5k+</div>
            <div><img src="images/share.png" /> 950</div>
          </div>
          <div class="post-profile-icon">
            <img src="images/profile-pic.jpg" class="person-img"/>
            <i class="fa-solid fa-caret-down"></i>
          </div>
        </div>
      </div>
    
    
    `
    } else{

      document.querySelector('.posts-dad').innerHTML+=`
      
        <div class="post-container">
          <div class="post-row">
            <div class="user-profile">
              <img src="images/profile-pic.jpg" class="person-img"/>
              <div>
                <p class="person-name"> </p>
                <span>September 25 2022, 14:55 pm</span>
              </div>
            </div>
            <a href="#"><i class="fa-solid fa-ellipsis-v"></i></a>
          </div>
          <p class="post-text">
            ${e.text}
          </p>
          <img src="${e.textImg}" class="post-img" />
    
          <div class="post-row">
            <div class="activity-icons">
              <div><img src="images/like-blue.png" /> 75k+</div>
              <div><img src="images/comments.png" /> 5k+</div>
              <div><img src="images/share.png" /> 950</div>
            </div>
            <div class="post-profile-icon">
              <img src="images/profile-pic.jpg" class="person-img"/>
              <i class="fa-solid fa-caret-down"></i>
            </div>
          </div>
        </div>
      
      
      `
    }
  })
}



let mainPersonData;

/* start get user doc */
let docId=localStorage.getItem("doc-id");

await getDoc(doc(db, "accounts", docId)).then(e=>{
  mainPersonData=e.data()
  document.querySelector('.main-person-img').src=e.data().personImg
});



if(docId!==null&&docId!==''){

  const url = window.location.href;
  const searchParams = new URL(url).searchParams; 
  const urlSearchParams = new URLSearchParams(searchParams);
  let personid = urlSearchParams.get('PersonId');
  
  if(personid!==''||personid!==undefined)
  {
    await getDoc(doc(db, "accounts", personid)).then(e=>{
      document.querySelectorAll('.person-name').forEach(element=>{
        element.innerHTML=e.data().username
      });

      document.querySelectorAll('.person-img').forEach(element=>{
        element.src=e.data().personImg
      });

    });
  }


  if(personid!==docId)
  {
    document.querySelector('#label-change-person-img').style.display='none'
    document.querySelector('.person-img-notChange').style.display='block'
  }

} else {
  location.href="./login/login.html"
}






/*3*/
async function uploadImage() {

  const ref = firebase.storage().ref();
  const file = document.querySelector("#change-person-img").files[0];
  const name = +new Date() + "-" + file.name;
  const metadata = {
    contentType: file.type
  };

  const task = ref.child(name).put(file, metadata);
  task
  .then(async snapshot => snapshot.ref.getDownloadURL())
  .then(async url => {

    console.log(url);
    document.querySelector('.main-person-img').src=url
    // console.log(mainPersonData);

    /*start post*/
    setDoc(doc(db, "accounts", localStorage.getItem("doc-id")), {
      ...mainPersonData,
      personImg: url,
    });


    // document.querySelector(".loaderDad").style.display="none"
  })
  .catch(console.error);

}
/*3*/





// save img src in local storge

document.querySelector("#change-person-img").addEventListener("change", function () {
  
  // document.querySelector(".loaderDad").style.display="block"
  uploadImage();

})

//end save src in local storge

























// Settings Menu Toggle

let settingsMenuBtn = document.querySelector(".settingsMenuBtn")
let settingsmenu = document.querySelector(".settings-menu");
settingsMenuBtn.addEventListener("click",()=>{
  settingsMenuToggle()
})


function settingsMenuToggle() {
  settingsmenu.classList.toggle("settings-menu-height");
}

// Dark Button Toggle
var darkBtn = document.getElementById("dark-btn");
darkBtn.onclick = function () {
  darkBtn.classList.toggle("dark-btn-on");
  document.body.classList.toggle("dark-theme");

  if (localStorage.getItem("theme") == "light") {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
};

if (localStorage.getItem("theme") == "light") {
  darkBtn.classList.remove("dark-btn-on");
  // darkBtn.body.classList.remove("dark-theme");
} else if (localStorage.getItem("theme") == "dark") {
  darkBtn.classList.add("dark-btn-on");
  document.body.classList.add("dark-theme");
} else {
  localStorage.setItem("theme", "light");
}







window.onclick=(e)=>{
  if(e.target.classList.value.includes("logout")){
    localStorage.setItem("doc-id", "");
    location.href='../login/login.html'
  }
}















