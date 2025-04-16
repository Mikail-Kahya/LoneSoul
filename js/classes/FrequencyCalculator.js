import Microphone from "./Mic.js";

// Stores frequencies and gives back the average
// overides old samples if over sample count
export default class FrequencyCalculator {
    #averageFreq = 0;
    #frequencies = []
    #maxSamples = 100;
    #nrSamples = 0;
    #sampleIdx = 0;
    #isDirty = false; // Dirty flag for optimization

    get averageFreq() {
        if (this.#isDirty)
        {
            this.#averageFreq = this.#calcAverageFreq();
            this.#isDirty = false;
        }
        return this.#averageFreq;
    }

    constructor(sampleCount = 100)
    {
        this.#maxSamples = sampleCount;
        this.#frequencies.length = sampleCount;
    }

    // Sample and calculate average frequency
    sample() {
        this.#frequencies[this.#sampleIdx] = Microphone.instance.freq;
        this.#sampleIdx = (this.#sampleIdx + 1) % this.#maxSamples;
        this.#nrSamples = min(this.#nrSamples + 1, this.#maxSamples);
        this.#isDirty = true;
    }

    // Empty samples
    clear() {
        this.#nrSamples = 0;
        this.#sampleIdx = 0;
        this.#averageFreq = 0;
        this.#isDirty = false;
    }

    #calcAverageFreq() {
        let averageFreq = 0;

        for (let sampleIdx = 0; sampleIdx < this.#nrSamples; ++sampleIdx)
            averageFreq += this.#frequencies[sampleIdx];

        return averageFreq / this.#nrSamples;
    }
}