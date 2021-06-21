/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict;';

  const select = {
    templateOf: {
      books: '#template-book',
    },
    containerOf: {
      books: '.books-list',
      image: '.book__image',
      filters: '.filters',
    },
    image: {
      imageId: 'data-id',
      favoriteAndBook: 'book__image favorite',
      favorite: 'favorite',
      image: 'book__image',
    }

  };
  const templates = {
    book: Handlebars.compile(document.querySelector(select.templateOf.books).innerHTML)
  };

  const filters = [];
  const favoriteBooks = [];

  const render = function(){
    // pobranie danych z data.js
    const data = dataSource.books;
    // petla po danych
    for(const dataBook of data){
      // wygenerowanie kodu HTML i wstrzykniecie go do szablonu
      const generateHTML = templates.book(dataBook);
      const element = utils.createDOMFromHTML(generateHTML);
      // odnalezienie wrapera, gdzie bedzie wrzucany kod
      const booksContainer = document.querySelector(select.containerOf.books);
      // dodanie kodu
      booksContainer.appendChild(element);
    }
  };


  const initAction = function(){
    // wybranie wszystkich obrazkow z klasa .book__image
    const element = document.querySelector(select.containerOf.books);
    const filterElement = document.querySelector(select.containerOf.filters);

    // dodanie nasluchiwania na podwojne klikniecie na caly kontener - event delegation

    element.addEventListener('dblclick', function(e){
      e.preventDefault();
      const item  = e.target.offsetParent;

      if(item.classList.contains(select.image.image)){

        // czy ok
        const bookId = item.getAttribute(select.image.imageId);
        // element klikniety, czy juz zawiera klase .favorite
        const clicked = item.className == select.image.favoriteAndBook;
        // sprawdzanie warunku, jak TAK to usuwanie, NIE - dodanie
        if(!clicked){
          favoriteBooks.push(bookId);
          item.classList.add(select.image.favorite);
        } else {
          // usuniecie klasy .favorite oraz id z tablicy
          const indexItem = favoriteBooks.indexOf(bookId);
          favoriteBooks.splice(indexItem,1);
          item.classList.remove(select.image.favorite);
        }
      }
    });


    filterElement.addEventListener('click', function(e){
      e.preventDefault();
      const item = e.target;

      if(item.tagName === 'INPUT' && item.type === 'checkbox' && item.name === 'filter'){
        console.log('value checkobx: ', item.value);
        const boxValue = item.value;

        if(item.checked){
          //item.checked = true;
          filters.push(boxValue);
        }else{
          //item.checked = false;
          const boxIndex = filters.indexOf(boxValue);
          filters.splice(boxIndex, 1);
        }
        console.log(filters);

      }

    });



  };




  render();
  initAction();
  console.log(favoriteBooks);

}
