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



  class BookList{
    constructor(){
      const thisBook = this;
      thisBook.initData();
      thisBook.render();
      thisBook.getElements();
      thisBook.initAction();
    }

    getElements(){
      const thisBook = this;

      thisBook.dom = {};
      thisBook.dom.bookImage = document.querySelector(select.containerOf.books);
      thisBook.dom.filterElement = document.querySelector(select.containerOf.filters);
      thisBook.dom.image = document.querySelectorAll(select.containerOf.image);
    }

    initData(){
      const thisBook = this;
      thisBook.data = dataSource.books;
      thisBook.filters = [];
      thisBook.favoriteBooks = [];
    }

    render(){
      const thisBook = this;
      // petla po danych
      for(const dataBook of thisBook.data){
        const rating = dataBook.rating,
          ratingBgc = thisBook.determineRatingBgc(rating),
          ratingWidth = rating * 10;

        dataBook.ratingWidth = ratingWidth;
        dataBook.ratingBgc = ratingBgc;
        // wygenerowanie kodu HTML i wstrzykniecie go do szablonu
        const generateHTML = templates.book(dataBook);
        thisBook.element = utils.createDOMFromHTML(generateHTML);
        // odnalezienie wrapera, gdzie bedzie wrzucany kod
        const booksContainer = document.querySelector(select.containerOf.books);
        // dodanie kodu
        booksContainer.appendChild(thisBook.element);
      }
    }


    initAction(){
      const thisBook = this;
      // wybranie wszystkich obrazkow z klasa .book__image
      const element = thisBook.dom.bookImage;
      // wybranie sekcji z formularzem .filters
      const filterElement = thisBook.dom.filterElement;

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
            thisBook.favoriteBooks.push(bookId);
            item.classList.add(select.image.favorite);
          } else {
            // usuniecie klasy .favorite oraz id z tablicy
            const indexItem = thisBook.favoriteBooks.indexOf(bookId);
            thisBook.favoriteBooks.splice(indexItem,1);
            item.classList.remove(select.image.favorite);
          }
        }
      });

      filterElement.addEventListener('click', function(e){
        const item = e.target;

        // sprawdzenie jaki element został kliknięty
        if(item.tagName === 'INPUT' && item.type === 'checkbox' && item.name === 'filter'){
          const boxValue = item.value;
          // sprawdzenie czy checkbox zaznaczony
          if(item.checked){
            thisBook.filters.push(boxValue);

          }else{
            const boxIndex = thisBook.filters.indexOf(boxValue);
            thisBook.filters.splice(boxIndex, 1);
          }
          thisBook.hideBook(thisBook.filters);
        }

      });



    }

    hideBook(filters){
      const thisBook = this;
      const element = thisBook.dom.image;
      // petla po ksiazkach
      for(const bookData of thisBook.data){
        let toShow = false;
        // gdy tablica jest pusta - wszytkie ksiazki widoczne
        if(filters.length === 0){
          for(const elementItem of element){
            elementItem.classList.remove('hidden');
          }
        }
        // petla po filtrze
        for(const filterItem of filters){
          // sprawdzenie czy ksiazka dla odpowiedniego filtru ma true
          if(bookData.details[filterItem]) {
            toShow = true;
            //break;
          }
          // petla po elementach DOM z .book__image
          for(const elementItem of element){
            // pobranie id ksiazki z DOM
            const elementItemId = parseInt(elementItem.getAttribute(select.image.imageId)),
              bookId = bookData.id;
            // dodanie/usuniecie klasy .hidden z DOM'a odpowiadajacego id ksiazki
            if(elementItemId === bookId){
              if(toShow === false){
                elementItem.classList.add('hidden');
              }else if(toShow === true){
                elementItem.classList.remove('hidden');
              }
            }
          }
        }
      }
    }

    determineRatingBgc(rating){
      let background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';

      if(rating < 6) {
        background = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      }else if(rating >= 6 && rating < 8) {
        background = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      }else if(rating >= 8 && rating < 9) {
        background = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      }else if(rating >= 9) {
        background = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return background;
    }



  }

  const app = new BookList();
  console.log(app);
}
