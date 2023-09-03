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
		this.test();
		const secondsAttr = this.getAttribute('seconds');
		const totalSeconds = parseInt(secondsAttr);
		this.setTimer(totalSeconds);
	}

	test() {
		const startButton = document.getElementById('startButton');
  		startButton.addEventListener('click', () => {
			if (!this.started) {
				this.started = true;
				const secondsAttr = this.getAttribute('seconds');
				const seconds = parseInt(secondsAttr);
				this.endTime = Date.now() + seconds * 1000;
					if (this.time) {
						this.updateTimeDisplay();
					};
				this.startCountDown();
			};
  		});
		const pauseButton = document.getElementById('pauseButton');
		const resetButton = document.getElementById('resetButton');
		pauseButton.addEventListener('click', () => this.pauseCountDown());
		resetButton.addEventListener('click', () => this.resetCountDown());
	};
      
	static get observedAttributes() {
	  	return ['seconds', 'to-time'];
	};

	render() {
		this.shadowRoot.innerHTML = `
		<style>
			:host {
				text-align: center;
				display: flex;
				font-size: 30px;
			}
		</style>
		<span id="timer">00:00:00</span>`;
	};
	
	setTimer(totalSeconds) {
		const timerElement = this.shadowRoot.getElementById('timer');
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
		timerElement.innerText = formattedTime;
	};

	updateTimeDisplay() {
		const timerElement = this.shadowRoot.getElementById('timer');
		if (timerElement) {
			const currentTime = Date.now();
			
			const timeDifference = Math.max(this.endTime - currentTime, 0);
			
			const hours = Math.floor(timeDifference / 3600000);
			const minutes = Math.floor((timeDifference % 3600000) / 60000);
			const seconds = Math.floor((timeDifference % 60000) / 1000);
			console.log(minutes)
			console.log(seconds)
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
					this.dispatchEndTimerEvent();
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

	dispatchEndTimerEvent() {
		const endTimerEvent = new Event('endtimer');
		this.dispatchEvent(endTimerEvent);
	};
}
customElements.define('countdown-timer', CountdownTimer);

const countdownTimer = document.querySelector('countdown-timer');
countdownTimer.addEventListener('endtimer', () => {
	const timerElement = countdownTimer.shadowRoot.getElementById('timer');
	if (timerElement) {
		timerElement.innerText = 'Время!';
	};
});