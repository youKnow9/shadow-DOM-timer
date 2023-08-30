class CountdownTimer extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.endTime = null;
		this.int = null;
	};
      
	connectedCallback() {
		this.render();
		this.initializeEventListeners();
	};
      
	initializeEventListeners() {
		this.addEventListener('startTimer', () => this.startCountDown());
		this.addEventListener('pauseTimer', () => this.pauseCountDown());
		this.addEventListener('resetTimer', () => this.resetCountDown());
	};
      
	static get observedAttributes() {
	  	return ['seconds', 'to-time'];
	};
	
	// функция для изменения времени
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'seconds') {
			const seconds = parseInt(newValue);
			this.endTime = Date.now() + seconds * 1000;
		} else if (name === 'to-time') {
			const now = new Date();
			const [hours, minutes, seconds] = newValue.split(':').map(Number);
		
			const targetTime = new Date();
			targetTime.setHours(hours);
			targetTime.setMinutes(minutes);
			targetTime.setSeconds(seconds);
		
			this.endTime = targetTime.getTime();
		};
	    
		this.restartCountdown();
	};

	//стили
	render() {
		this.shadowRoot.innerHTML = 
			`<style>:host {
					display: inline-block;
					font-size: 24px;
				}
      			</style>
      			<span id="timer">00:00:00</span>`;
	};
      
	startCountDown() {
		this.int = setInterval(() => {
			const currentTime = Date.now();
			const timeDifference = Math.max(this.endTime - currentTime, 0);
		  
			const hours = Math.floor(timeDifference / 3600000);
			const minutes = Math.floor((timeDifference % 3600000) / 60000);
			const seconds = Math.floor((timeDifference % 60000) / 1000);
		  
			const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
			this.shadowRoot.getElementById('timer').textContent = formattedTime;
		  
			if (timeDifference === 0) {
				clearInterval(this.int);
				this.dispatchEvent(new Event('endtimer'));
			};
		}, 1000);
	};
      
	pauseCountDown() {
	  	clearInterval(this.int);
	};
      
	resetCountDown() {
		clearInterval(this.int);
		this.render();
	};

	restartCountDown() {
		clearInterval(this.interval);
		this.startCountDown();
	};
};
      
customElements.define('countdown-timer', CountdownTimer);
      
// создаем кнопки и вешаем слушатели
const startButton = document.createElement('button');
startButton.textContent = 'Start Timer';

startButton.addEventListener('click', () => {
	const timerElement = document.querySelector('countdown-timer');
	timerElement.dispatchEvent(new CustomEvent('startTimer'));
});

const pauseButton = document.createElement('button');
pauseButton.textContent = 'Pause Timer';

pauseButton.addEventListener('click', () => {
	const timerElement = document.querySelector('countdown-timer');
	timerElement.dispatchEvent(new CustomEvent('pauseTimer'));
});

const resetButton = document.createElement('button');
resetButton.textContent = 'Reset Timer';

resetButton.addEventListener('click', () => {
	const timerElement = document.querySelector('countdown-timer');
	timerElement.dispatchEvent(new CustomEvent('resetTimer'));
});

// добавляем кнопки в DOM
document.body.appendChild(startButton);
document.body.appendChild(pauseButton);
document.body.appendChild(resetButton);