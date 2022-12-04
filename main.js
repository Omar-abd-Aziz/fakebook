

//////////////////////*start firebase*////////////////////////////


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


let UserData;

async function getUserData(){
    await getDoc(doc(db, "accounts", `${docId}`)).then(e=>{
        UserData = e.data()
        UserData.password='';
        UserData.email='';
        document.querySelectorAll('.main-person-name').forEach(element=>{
          element.innerHTML=e.data().username;
        });
    
        document.querySelectorAll('.main-person-img').forEach(element=>{
          element.src=e.data().personImg;
        });
    });
}


/* start get user doc */
let docId=localStorage.getItem("doc-id");
if(docId!==null&&docId!==''){
    document.querySelector('.profile-btn').dataset.personid=docId;
    getUserData();
} else {
  location.href="./login/login.html"
}

/////////////////////* end firebase *////////////////////////////





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
function getPosts() {
    getCit(db, 'posts').then(async (e) => {
        AllPosts = e;
    })
}
/* end get posts */





/* start btn for dark theam */
var darkButton = document.querySelector(".darkTheme");

darkButton.onclick = function(){
    darkButton.classList.toggle("button-Active");
    document.body.classList.toggle("dark-color")
};
/* end btn for dark theam */



/* start staties */
let statusBtnRight = document.querySelector(".btn-right")
let statusBtnLeft = document.querySelector(".btn-left")

cheekStatiesBtn(statusBtnLeft)

statusBtnLeft.addEventListener('click',()=>{
   document.querySelector(".stories-dad").scrollLeft-= 150;
   cheekStatiesBtn(statusBtnLeft)
})

statusBtnRight.addEventListener('click',()=>{
    document.querySelector(".stories-dad").scrollLeft+= 150;
    cheekStatiesBtn(statusBtnLeft)
})


function cheekStatiesBtn(statusBtnLeft){
    if(document.querySelector(".stories-dad").scrollLeft>1){
        statusBtnLeft.style.display='block'
    } else{
        statusBtnLeft.style.display='none'
    }
}


/* end staties */

/* start profile btn */

window.onclick=(e)=>{
    if(e.target.classList.value.includes("profile-btn")){
        location.href='./profile.html'+'?PersonId='+e.target.dataset.personid;
    }

}

/* end profile btn */




/* start close and open post div btn */

document.querySelector('#close-post-div').addEventListener('click',()=>{
    document.querySelector('.create-post-dad').style.display='none'
})

document.querySelector('.createPost').addEventListener('click',()=>{
    document.querySelector('.create-post-dad').style.display='block'
})

/* end close and open post div btn */




let PostImgSrc;

/*  start function to upload img */
async function uploadImage() {

    const ref = firebase.storage().ref();
    const file =  document.querySelector("#PostInput").files[0];
    const name = +new Date() + "-" + file.name;
    const metadata = {
      contentType: file.type
    };
  
    const task = ref.child(name).put(file, metadata);
    task
    .then(async snapshot => snapshot.ref.getDownloadURL())
    .then(async url => {
        PostImgSrc=url
        document.querySelector(".loaderDad").style.display="none"
    })
    .catch(console.error);
    
  }
  /*  end function to upload img */








/* start Post Btn */

document.querySelector('.ImBtnForPost').addEventListener('click',()=>{
    document.querySelector("#PostInput").click();
})



document.querySelector('#PostInput').addEventListener('change',()=>{
    uploadImage()
    document.querySelector(".loaderDad").style.display="block"
})

let textImg=''
document.querySelector('#Post-Btn').addEventListener('click',async ()=>{
    let text = document.querySelector('#Post-Input').value

    
    textImg=PostImgSrc;

    if(text!==''||textImg!==''){
        let personId = localStorage.getItem('doc-id')

        await getDoc(doc(db, "accounts", personId)).then(e=>{
            

            addDoc(collection(db,"posts"),{
                text: `${text}`,
                textImg: `${textImg}`,
                textTime: Date.now(),
                personId: e.data().id,
                personName: e.data().username,
                personImg: e.data().personImg,
            });


            document.querySelector('#Post-Input').value=''
            document.querySelector('.create-post-dad').style.display='none'
            
        })

        
    }
    
})



/* end Post Btn */