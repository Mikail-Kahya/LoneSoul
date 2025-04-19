import * as Math from "../Utils/Utils.js";
import Debugger from "./Debugger.js";

export default class Microphone {
    // =========
    // Singleton
    // =========
    static #instance;
    static get instance(){
        if (Microphone.#instance == undefined) {
            Microphone.#instance = new Microphone();

            window.setup = async () => {
                Microphone.#instance.setup(getAudioContext());
            }
            window.touchStarted = () => {
                Microphone.#instance.setup(getAudioContext());
            }
        }

        return Microphone.#instance;
    }

    // ==== Private variables ====
    #freq;
    #mic;
    #pitch;
    #audioContext;


    // mic use
    #lowFreq = 0;
    #highFreq = 500;
    #level = 0;


    // ====== Getters ========
    get level() {
        return this.#mic.getLevel() * 100;
    }

    get freq() {
        return this.#freq;
    }

    get lowFreq() {
        return this.#lowFreq;
    }

    get highFreq() {
        return this.#highFreq;
    }

    get freqRatio() {
        // get the ratio between the low and high frequentie put in a range between 0 - 1
        if (this.#freq == 0 || this.#freq == NaN)
            return 0;
        const droppedFreq = this.#freq - this.#lowFreq;
        const ratio = droppedFreq / (this.#highFreq - this.#lowFreq);
        return Math.clamp(ratio, 0, 1);
    }

    // ====== Setters ========
    set highFreq(freq) {
        this.#highFreq = max(freq, this.#lowFreq);
        Debugger.log(`High frequency: ${this.#highFreq}`);
    }

    set lowFreq(freq) {
        this.#lowFreq = min(freq, this.#highFreq);
        Debugger.log(`High frequency: ${this.#lowFreq}`);
    }



    // =======
    // Methods
    // =======
    setup(audioContext) {
        try {
            this.#audioContext = audioContext;
            this.#grabContext();
            if (this.#audioContext.state !== `running`)
                this.#audioContext.resume();
        } catch(err) {
            console.log(err);
        }
    }

    #grabContext() {
        if (this.#audioContext == undefined)
        {
            console.log("No context given");
            return;
        }

        if (this.#mic !== undefined)
            return;

        this.#mic = new p5.AudioIn();
        this.#mic.start(Microphone.instance.#startPitch);
    }

    #startPitch() {
        console.log("Load pitch model");
        let mic = Microphone.instance;
        try {
           mic.#pitch = ml5.pitchDetection('./js/model', mic.#audioContext, mic.#mic.stream, mic.#modelLoaded);

        } catch(err) {
            console.log(err);
        }
    }
    
    #modelLoaded() {
        console.log('Model loaded correctly');
        let mic = Microphone.instance;
        mic.#pitch.getPitch(mic.#pitchLoaded);
    }

    #getPitch(error, frequency) {
        let mic = Microphone.instance;
        if (error) {
            console.error(error);
            mic.#freq = 0;
            return 0;
        }
        mic.#freq = frequency;
    }

    #pitchLoaded() {
        let mic = Microphone.instance;
        mic.#pitch.getPitch(mic.#getPitch);
        requestAnimationFrame(mic.#pitchLoaded);
    }
}