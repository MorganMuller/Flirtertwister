

let wheel = document.querySelector(".wheel");
let spinner = wheel.querySelector(".spinner");
let volgende = wheel.querySelector(".btn-verder");
const trigger = wheel.querySelector(".btn-spin");
const ticker = wheel.querySelector(".ticker");
let selectedDisplay = document.querySelector("#displaySelected");

const spinClass = "is-spinning";
const selectedClass = "selected";
const spinnerStyles = window.getComputedStyle(spinner);
let tickerAnim;
let rotation = 0;
let currentSlice = 0;
let prizeNodes;
// is het Wie wat of waar? Belangrijk want het bepaalt de waarden daarom hebben we een variabele die dit bijhoudt 1 is wie, 2 is wat en 3 is waar
let WieWatOfWaar = 1;
let gekozenWieWaarde=document.querySelector("#displayWie"); 
let gekozenWatWaarde =document.querySelector("#displayWat");
let gekozenWaarWaarde =document.querySelector("#displayWaar");

console.log(WieWatOfWaar);
let valuesWheel = volwassenenWie;

const prizeSlice = 360 / valuesWheel.length;
const prizeOffset = Math.floor(180 / valuesWheel.length);

const changeValues = () => {
if(WieWatOfWaar===1){
  valuesWheel = volwassenenWie;
  selectedDisplay.innerHTML= "Wie?"
  gekozenWieWaarde.classList.add("vet");
 }else if(WieWatOfWaar===2){
  valuesWheel = volwassenenWat;
  selectedDisplay.innerHTML= "Wat?"
  gekozenWieWaarde.classList.remove("vet");
  gekozenWieWaarde.classList.add("wasVet");
  gekozenWatWaarde.classList.add("vet");
 }else if(WieWatOfWaar===3){
  valuesWheel = volwassenenWaar;
  selectedDisplay.innerHTML= "Waar?"
  gekozenWatWaarde.classList.remove("vet");
  gekozenWatWaarde.classList.add("wasVet");
  gekozenWaarWaarde.classList.add("vet");
 }
setupWheel()
};




const createPrizeNodes = () => {
  valuesWheel.forEach(({ text, color}, i) => {
    const rotation = ((prizeSlice * i) * -1) - prizeOffset;
    
    spinner.insertAdjacentHTML(
      "beforeend",
      `<li class="prize" style="--rotate: ${rotation}deg">
        <span class="text">${text}</span>
      </li>`
    );
  });
};

const createConicGradient = () => {
  spinner.setAttribute(
    "style",
    `background: conic-gradient(
      from -90deg,
      ${valuesWheel
        .map(({ color }, i) => `${color} 0 ${(100 / valuesWheel.length) * (valuesWheel.length - i)}%`)
        .reverse()
      }
    );`
  );
};


const setupWheel = () => {
  createConicGradient();
  createPrizeNodes();
  prizeNodes = wheel.querySelectorAll(".prize");
};

const spinertia = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const runTickerAnimation = () => {
  // https://css-tricks.com/get-value-of-css-rotation-through-javascript/
  const values = spinnerStyles.transform.split("(")[1].split(")")[0].split(",");
  const a = values[0];
  const b = values[1];  
  let rad = Math.atan2(b, a);
  
  if (rad < 0) rad += (2 * Math.PI);
  
  const angle = Math.round(rad * (180 / Math.PI));
  const slice = Math.floor(angle / prizeSlice);

  if (currentSlice !== slice) {
    ticker.style.animation = "none";
    setTimeout(() => ticker.style.animation = null, 10);
    currentSlice = slice;
  }

  tickerAnim = requestAnimationFrame(runTickerAnimation);
};



const selectPrize = () => {
  const selected = Math.floor(rotation / prizeSlice);
  prizeNodes[selected].classList.add(selectedClass);
  selectedDisplay.innerHTML= prizeNodes[selected].innerHTML;
  volgende.classList.remove("invisible");
  if(WieWatOfWaar===1){
    gekozenWieWaarde.innerHTML= prizeNodes[selected].innerHTML;
   } else if(WieWatOfWaar===2){
    gekozenWatWaarde.innerHTML= prizeNodes[selected].innerHTML;
   } else if(WieWatOfWaar===3){
    gekozenWaarWaarde.innerHTML= prizeNodes[selected].innerHTML.trim() +".";
    volgende.innerHTML = "Opnieuw spelen?";
    gekozenWieWaarde.classList.add("finalValtOp");
    gekozenWatWaarde.classList.add("finalValtOp");
    gekozenWaarWaarde.classList.add("finalValtOp");
   }
   trigger.classList.add("invisible");
};

trigger.addEventListener("click", () => {
  trigger.disabled = true;
  rotation = Math.floor(Math.random() * 360 + spinertia(2000, 5000));
  prizeNodes.forEach((prize) => prize.classList.remove(selectedClass));
  wheel.classList.add(spinClass);
  spinner.style.setProperty("--rotate", rotation);
  ticker.style.animation = "none";
  runTickerAnimation();
});

spinner.addEventListener("transitionend", () => {
  cancelAnimationFrame(tickerAnim);
  trigger.disabled = false;
 // trigger.focus();
  rotation %= 360;
  selectPrize();
  wheel.classList.remove(spinClass);
  spinner.classList.add("opacity");
  spinner.style.setProperty("--rotate", rotation);
});

volgende.addEventListener("click", () => {
  spinner.classList.remove("opacity");
  wheel.querySelectorAll(".prize").forEach(e=> e.remove());
  if(WieWatOfWaar<3){
    WieWatOfWaar++;
    console.log(WieWatOfWaar);
    changeValues();
   } else if(WieWatOfWaar===3){
    location.reload();
   }
   volgende.classList.add("invisible");
   trigger.classList.remove("invisible");
});

setupWheel();
