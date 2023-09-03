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
		this.addEventListener('starttimer', () => {
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
		this.addEventListener('pausetimer', () => this.pauseCountdown());
    		this.addEventListener('resettimer', () => this.resetCountdown());
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
		timerElement.innerText = `${formattedTime}`;
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
		const endTimerEvent = new Event('endtimer', { bubbles: true });
    		this.dispatchEvent(endTimerEvent);
	};
	
	attributeChangedCallback(name, oldValue, newValue) {
		if (name === 'seconds' && newValue !== null) {
			const totalSeconds = parseInt(newValue);
			this.setTimer(totalSeconds);
			if (!this.started) {
				this.endTime = null;
				this.updateTimeDisplay();
			};
		};
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

const startButton = document.getElementById('startButton');
startButton.textContent = 'Start Timer';
startButton.addEventListener('click', () => {
	const timerElement = document.querySelector('countdown-timer');
	timerElement.dispatchEvent(new CustomEvent('starttimer'));
});

const pauseButton = document.getElementById('pauseButton');
pauseButton.textContent = 'Pause Timer';
pauseButton.addEventListener('click', () => {
	const timerElement = document.querySelector('countdown-timer');
	timerElement.dispatchEvent(new CustomEvent('pausetimer'));
});

const resetButton = document.getElementById('resetButton');
resetButton.textContent = 'Reset Timer';
resetButton.addEventListener('click', () => {
	const timerElement = document.querySelector('countdown-timer');
	timerElement.dispatchEvent(new CustomEvent('resettimer'));
});