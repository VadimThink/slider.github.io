document.addEventListener('DOMContentLoaded', function() { //обрадобчик ДОМ запустится, когда загрузится и документ включая всё ниже написанное 

    let pictures = [
        './images/slideshow/slider/1.jpg',
        './images/slideshow/slider/2.jpg',
        './images/slideshow/slider/3.jpg',
        './images/slideshow/slider/4.jpg',
        './images/slideshow/slider/5.jpg',
        './images/slideshow/slider/6.jpg',
        './images/slideshow/slider/7.jpg'
    ];
          //Переменные
    let lastpic = pictures.length;
    let dir = '';
    let fisrtLoading = 'true';
    let dotsCounter = lastpic;
    let nextpic = pictures[0];

    let state = localStorage.getItem('state'); //взять положение из веб-хранилища , сохранённый при последнем запуске браузера
        if (state === undefined) { //если неизвестно то взять первый элемент
            state = 'true';
        }

    let i = localStorage.getItem('slideToRemember'); //взять номер из веб-хранилища , сохранённый при последнем запуске браузера
        if (i === undefined) { //если неизестен то предпоследний
            i = lastpic-1;
        }

    // Создать точки
    let dotsContainer = document.querySelector('.sliderDots'); //поиск элемента и остановка после первго найденого
    for (let k = dotsCounter-1; k >= 0; k--) {
        let dotsElement = `<div class="dot" data-attr="${k}" ></div>`;
        dotsContainer.insertAdjacentHTML("afterBegin", dotsElement); //вставить недостающие точки после первой
    }

    // Стрелки
    let sliderPic = document.querySelector('.slider_Pic');
    let leftButton = document.getElementById('leftbutton');
    let rightButton = document.getElementById('rightbutton');

    // Dots
    let dots = document.querySelectorAll('.dot'); //поиск всех элементов 

    // автопролистывание
    let scrollButton = document.querySelector('.autoshowButton');
    let scrollIcon = document.getElementById('sliderIcon');

    // Линия
    let sliderLine = document.getElementById('sliderLine');
    let width = 0;

    // Клик по стрелкам
    if ( fisrtLoading ) {
        scrollIcon.classList.remove('fa-pause'); //удалить знак при прокрутке класса
        scrollIcon.classList.remove('fa-play');

        if (state == 'true') {
            scrollIcon.classList.add('fa-pause'); //добавить знак если 
            sliderLine.classList.remove('hide');
            Loading();
        } else {
            scrollIcon.classList.add('fa-play');
            sliderLine.classList.add('hide');

            i++;
//обработка ошибок
            try {
                smoothly(sliderPic, 'src', pictures[i]);
            }
            catch {
                console.log('smoothly lib cant be loaded');
                sliderPic.setAttribute('src', pictures[i]); //установить атрибутом рисунок с адресом src
            }

            leftButton.classList.remove('hide');
            rightButton.classList.remove('hide');

            dots.forEach(findDot);
            function findDot(dot) {
                let currentDot = dot;
                let currentDotNumber = dot.getAttribute("data-attr"); //получить значение атрибута с данным именем

                if (currentDotNumber == i) {
                    currentDot.classList.add("active");
                }
            }
        }
        fisrtLoading = 'false';
    }
 //если кликнуть на точку , то она станет активной, а другая неактивной

    function switchDot(i) {
        dots.forEach(findDot);
        function findDot(dot) {
            let currentDot = dot;
            let currentDotNumber = dot.getAttribute("data-attr"); 

            if ( currentDotNumber == i ) { //для каждого элемента удалить активность точки и сделать для текущей
                dots.forEach(removeDotsClass)
                function removeDotsClass(dot) {
                    dot.classList.remove("active");
                };
                currentDot.classList.add("active");
            }
        }
    }
   
    
    // Изменение изображения
    function ChangeImage(dir) {
        if ( dir == 'next' ) {  //если хочешь следующую     
            i++;
            if(i == lastpic){ //если хочешь последнюю
                i = 0;
            }
            nextpic = pictures[i];

             // Определить точку
            switchDot(i);

        } else if ( dir == 'prev' ) {
            i--;
            if (i < 0) {
                i = lastpic - 1;
            }
            nextpic = pictures[i];
            switchDot(i);
        }

        localStorage.setItem('slideToRemember', i-1);
        sliderLine.style.width = '0';
        width = 0;

      //Изменить 
        if (state == 'true') {
            let timerId = setTimeout(PreLoading, 500);
            smoothly(sliderPic, 'src', nextpic);
        } else {
            sliderPic.setAttribute('src', nextpic);
        }
    }

    leftButton.addEventListener('click', function(){
       ChangeImage('prev'); //при клике изменить изображение 
    });

    rightButton.addEventListener('click', function(){
        ChangeImage('next');
    });
    
    dots.forEach(onDotsClick);
    function onDotsClick(dot) {
        dot.addEventListener("click", function(){
   
            dots.forEach(removeDotsClass)
            function removeDotsClass(dot) {
                dot.classList.remove('active');
            };
   
            let currentDot = dot;
            currentDot.classList.add('active');
   
            let currentDotNumber = currentDot.getAttribute('data-attr');
            i = currentDotNumber;
   
            sliderPic.setAttribute('src', pictures[i]);
   
            localStorage.setItem('slideToRemember', i-1);
        });
    }

 //При автоматическом пролистывании автоматически изменять активных точек
    function scrollButtonClick() {
        scrollIcon.classList.remove('fa-pause');
        scrollIcon.classList.remove('fa-play');

        if (state == 'true') {
            scrollIcon.classList.add('fa-play');
            state = 'false';
            localStorage.setItem('state', state);

            sliderLine.classList.add('hide');
            leftButton.classList.remove('hide');
            rightButton.classList.remove('hide');

        } else {
            scrollIcon.classList.add('fa-pause');
            state = 'true';
            localStorage.setItem('state', state);

            sliderLine.classList.remove('hide');
            leftButton.classList.add('hide');
            rightButton.classList.add('hide');
        }
    }

    scrollButton.addEventListener("click", scrollButtonClick);
    scrollButton.addEventListener('click', PreLoading);

    function PreLoading() {

        let barId = setInterval(Move, 30); //вызывать ф-ию каждые 0.3 сек
        function Move(){
            width++;
            sliderLine.style.width = width + '%';
            if (state == 'true') {
                if (width >= 100){

                    width = 0;

                    clearInterval(barId);

                    let timer2Id = setTimeout(Loading, 300); // через 3 сек, единожды
                };
            } else {
                clearInterval(barId);
                width = 0;
                sliderLine.style.width = '0';
            }
        }
    }
    function Loading() {
        if (state == 'true') {
            ChangeImage('next');
        }
    }

    //Управление с клавы
    document.addEventListener('keydown', function(event) {
        if (state == 'false') {
            if (event.code == 'ArrowLeft') { //физическое значение клавиши
                ChangeImage('prev');
                console.log('left'); //выводит элемент в виде DOM-дерево
            }
            if (event.code == 'ArrowRight') {
                ChangeImage('next');
                console.log('right');
            }
        }
    });

}, false);
