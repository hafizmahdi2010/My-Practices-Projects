let ques = document.querySelector(".ques");
let getQuizBtn = document.querySelector(".getQuiz");
let optionsCon = document.querySelector(".optionsCon");

getQuizBtn.addEventListener("click", getQuiz);

function getQuiz() {
  let API_URL = "http://127.0.0.1:5500/data.json";
  fetch(API_URL).then(res=>res.json()).then(data=>{
    // Getting a random quiz
    let randomQuiz = data[Math.floor(Math.random() * data.length)];
    renderQuiz(randomQuiz);
  });
};

function renderQuiz(quiz){
  ques.innerHTML = quiz.title;
  optionsCon.innerHTML = "";
  quiz.options.forEach((option, index)=>{
    console.log(option)
    optionsCon.innerHTML += `
    <p onclick="checkAnswer(event,{isTrue:${option.isTrue}})" istrue=${option.isTrue ? true : false} class="option p-[7px] bg-[#f7f7f7] mt-2 cursor-pointer flex items-center justify-between">
        ${option.option} <ion-icon class="text-[25px] ${option.isTrue ? "text-green-500" : "text-red-500"}" name=${option.isTrue ? "checkmark-circle-outline" : "close-circle-outline"}></ion-icon>
    </p>
`;
  });
}

function checkAnswer(e,isTrue){
  if(e.target.classList.contains("option")){

    let options = document.querySelectorAll(".option");
    options.forEach(option=>option.classList.add("optionActive"));

    if(isTrue.isTrue){
      // e.target.classList.add("optionActive")
    }else{
      // e.target.classList.add("optionActive")
    }
  }
}