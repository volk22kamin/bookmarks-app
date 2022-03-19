const addBookmark = document.getElementById('button');
const modalContainer = document.getElementById('mc');
const closeIcon = document.getElementById('close-modal');
const websiteEl = document.getElementById('website-name');
const websiteURLEl = document.getElementById('website-url');
const bookmarkForm = document.getElementById('form');
const bookmarkContainer = document.getElementById('bookmarks-container');
let bookmarks = [];


//validating input is inserted
function notEmptyString(nameValue, urlValue){
    if(!nameValue || !urlValue){
        websiteURLEl.style.borderColor = 'red';
        websiteEl.style.borderColor = 'red';
        return false;
    } else {
        websiteURLEl.style.borderColor = '#1b6380';
        websiteEl.style.borderColor = '#1b6380';
        return true;
    }
}

// validating regex
function validate(nameValue, urlValue){
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(notEmptyString){
        if(urlValue.match(regex)){
            websiteURLEl.style.borderColor = '#1b6380';
            return true;
        } else {
            websiteURLEl.style.borderColor = 'red';
            return false;
        }
    } else {
        return false;
    }
    
}


// deleting bookamrk
function deleteBookmark(url){
    bookmarks.forEach((bookmark, i) =>{
        if(bookmark.url === url){
            bookmarks.splice(i,1);
        }
    });
    // update the local storage
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
}

// creating the bookmarks
function buildBookmarks(){
    bookmarkContainer.textContent = '';
    bookmarks.forEach((bookmark)=>{
        const {name, url} = bookmark;
        // item
        const item = document.createElement('div');
        item.classList.add('item');
        // i / closeIcon
        const close = document.createElement('i');
        close.classList.add('fa-solid', 'fa-times');
        close.setAttribute('title', 'Delete Bookmark');
        close.setAttribute('onclick', `deleteBookmark('${url}')`);
        // name
        const linkInfo = document.createElement('div');
        linkInfo.classList.add('name'); 
        // favicon / img
        const favicon = document.createElement('img');
        favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
        favicon.setAttribute('alt', 'favicon');
        //a / link
        const a = document.createElement('a');
        a.setAttribute('href', `${url}`);
        a.textContent = name;
        a.setAttribute('target', '_blank');
        // appending
        linkInfo.append(favicon,a);
        item.append(close,linkInfo);
        bookmarkContainer.appendChild(item);

    });
}

// fetching the bookmarks from the local storage
function fetchBookmarks(){
    if(localStorage.getItem('bookmarks')){
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        bookmarks = [
            {
                name: 'google',
                url: 'https://google.com',
            },
        ];
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// open/close the modal
function showModal(){
    modalContainer.classList.add('show-modal');
    websiteEl.focus();
}
function closeModal(){
    modalContainer.classList.remove('show-modal');
}

function storeBookmark(e){
    e.preventDefault();
    const nameValue = websiteEl.value;
    let urlValue = websiteURLEl.value;

    if(!urlValue.includes('http://','https://')){
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)){
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    closeModal();

}

//calling the function
addBookmark.addEventListener('click', showModal);
closeIcon.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    e.target === modalContainer ? closeModal(): false;
});

bookmarkForm.addEventListener('submit', storeBookmark);

//on load
fetchBookmarks();
