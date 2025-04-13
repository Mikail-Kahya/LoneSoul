import { getMic } from "../classes/Mic.js";

export default class MiccheckScene extends Phaser.Scene{
    constructor(){
        super(`miccheck-cene`);
        this.stream;
    }

    init(){
        document.querySelector(`.miccheck-wrapper`).style.display = `flex`;   
        getMic();
        this.checkMicActivated();
    }

    checkMicActivated(){
        navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(stream => {
            if(stream.getAudioTracks()[0].enabled === true){
                this.scene.start(`loading-scene`);
            }      
        })
    }
}