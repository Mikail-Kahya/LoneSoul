let freq, mic, pitch, audioContext;

export const getMic = () => {
    window.setup = async () => {
        audioContext = await getAudioContext();
        startMic();
    }
    window.touchStarted = () => {
        audioContext = getAudioContext();
        if (audioContext.state !== `running`)
            audioContext.resume();
    }
}
const startMic = () => {
    if (audioContext.state !== `running`)
        audioContext.resume();

    mic = new p5.AudioIn();
    mic.start(startPitch);
}

const startPitch = () => {
    try 
    {
        pitch = ml5.pitchDetection('./js/model', audioContext, mic.stream, modelLoaded);
    } catch (err)
    {
        console.log(err);    
    }
}

const modelLoaded = () => {
    pitch.getPitch(gotPitch);
}

const gotPitch = (error, frequency) => {
    freq = 0;
    if (error) 
        console.error(error);
    else 
    {
        if (frequency)
            freq = frequency;
    }
    pitch.getPitch(gotPitch);
    getFreq();
}

export const getFreq = () => 
{
    return [freq, mic.getLevel()];
}
