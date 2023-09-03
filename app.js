class CountdownTimer extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.endTime = null;
		this.time = false;
		this.int = null;
		this.started = false;
	}
      
	connectedCallback() {
		this.render();
		this.test()
	}
      
	test() {
		const startButton = document.getElementById('startButton');
		startButton.addEventListener('click', (e) => {
			console.log(e.target)
			if (!this.started) {
				this.started = true;
				this.startCountDown();
			}
		});
		const pauseButton = document.getElementById('pauseButton');
		const resetButton = document.getElementById('resetButton');
		pauseButton.addEventListener('click', () => this.pauseCountDown());
		resetButton.addEventListener('click', () => this.resetCountDown());
	};
      
	static get observedAttributes() {
	  	return ['seconds', 'to-time'];
	};
      
	attributeChangedCallback(name, oldValue, newValue) {
		const seconds = parseInt(newValue);
		this.endTime = Date.now() + seconds * 1000; // вычисляем время завершения таймера 
		console.log(this.endTime)
		if (this.time) {
			this.updateTimeDisplay();
		};
	};

	render() {
		this.shadowRoot.innerHTML = `
		<style>
		:host {
			display: flex;
			font-size: 24px;
		}
		</style>
		<span id="timer">00:00:00</span>
		`;
	};
      
	updateTimeDisplay() {
		const timerElement = this.shadowRoot.getElementById('timer');
		if (timerElement) {
			const currentTime = Date.now();
			
			const timeDifference = Math.max(this.endTime - currentTime, 0);
			
			const hours = Math.floor(timeDifference / 3600000);
			const minutes = Math.floor((timeDifference % 3600000) / 60000);
			const seconds = Math.floor((timeDifference % 60000) / 1000);

			const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	
			timerElement.innerText = `${formattedTime}`;
		};
	};
      
	startCountDown() {
		this.time = true;
		if (this.time) {
			this.int = setInterval(() => {
				this.updateTimeDisplay();
				if (this.endTime - Date.now() <= 0) {
					clearInterval(this.int);
					// this.dispatchEvent(new Event('endtimer'));
				};
			}, 1000);
		};
	};
      
	pauseCountDown() {
	  	clearInterval(this.int);
	};
      
	resetCountDown() {
		clearInterval(this.int);
		this.time = false;
		this.render();
	};
}
customElements.define('countdown-timer', CountdownTimer);


// const startButton = document.createElement('button');
// const pauseButton = document.createElement('button');
// const resetButton = document.createElement('button');

// window.addEventListener('DOMContentLoaded', () => {
// 	const startButton = document.createElement('button');
// 	startButton.textContent = 'Start Timer';

// 	startButton.addEventListener('click', () => {
// 		const timerElement = document.querySelector('countdown-timer');
// 		timerElement.dispatchEvent(new CustomEvent('startTimer'));
// 	});

// 	const pauseButton = document.createElement('button');
// 	pauseButton.textContent = 'Pause Timer';

// 	pauseButton.addEventListener('click', () => {
// 		const timerElement = document.querySelector('countdown-timer');
// 		timerElement.dispatchEvent(new CustomEvent('pauseTimer'));
// 	});

// 	const resetButton = document.createElement('button');
// 	resetButton.textContent = 'Reset Timer';

// 	resetButton.addEventListener('click', () => {
// 		const timerElement = document.querySelector('countdown-timer');
// 		timerElement.dispatchEvent(new CustomEvent('resetTimer'));
// 	});

// //     // Добавляем кнопки в DOM
// 	document.body.appendChild(startButton);
// 	document.body.appendChild(pauseButton);
// 	document.body.appendChild(resetButton);
// });
