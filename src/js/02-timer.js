import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const input = document.getElementById('datetime-picker');

const timerHtml = document.querySelector('.timer');
const btnStart = document.querySelector('button[data-start]');
const seconds = document.querySelector('span[data-seconds]');
const minutes = document.querySelector('span[data-minutes]');
const hours = document.querySelector('span[data-hours]');
const days = document.querySelector('span[data-days]');
btnStart.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      btnStart.disabled = true;
      alert('Please choose a date in the future');
    } else {
      btnStart.disabled = false;
      console.log(selectedDates[0]);
    }
  },
};

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function dataTimer() {
  let timer = setInterval(() => {
    let countdown = new Date(input.value) - new Date();
    btnStart.disabled = true;
    if (countdown >= 0) {
      let timeObject = convertMs(countdown);
      days.textContent = addLeadingZero(timeObject.days);
      hours.textContent = addLeadingZero(timeObject.hours);
      minutes.textContent = addLeadingZero(timeObject.minutes);
      seconds.textContent = addLeadingZero(timeObject.seconds);
      if (countdown <= 10000) {
        timerHtml.style.color = 'tomato';
      }
    } else {
      timerHtml.style.color = 'black';
      clearInterval(timer);
    }
  }, 1000);
}

btnStart.addEventListener('click', dataTimer);

flatpickr(input, options);
