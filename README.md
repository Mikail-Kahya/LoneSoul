<h1>Lone Soul</h1>
<p><strong>
  Welcome to my recently remade project from a few years ago. Lone Soul is a web game inspired by <em>Limbo</em>, <em>One Hand Clapping</em>, and <em>Hollow Knight</em>.
  Lone Soul can be played through the link on <a target="_blank" href="https://mikailkahya.netlify.app">my website</a>. Make sure to check that out! 
</strong></p>

<br  />
<h2>Journey</h2>
<p>
  Lone Soul started as a school project where we needed to use the <strong>p5 open-source library with an unique input</strong>. I got inpsired by a recent game I played, <em>One Hand Clapping</em> (I recommend playing it).
  So, I immediately sought libraries to make my development process easier. If you have worked in JavaScript and tried to move objects on a canvas, it is easy until you need to make images appear, rotate, and scale. 
  That is just images, now the gameplay aspects of input, collision, events, etc. 	<em>Yeah it gets a lot.</em>
</p>
<p>
  I found Phaser, a library for web games that did all the aspects I needed at the time. So, I started my development learning 2 new libraries, how to make the model of pitch detection work. More about that second part later. 
  Phaser had a rough framework allowing me to make scenes, transition between scenes, and put sprites on those scenes with their collision. Most collisions were made through svgs and json files. More in technical part.
</p>

<hr />
<h2>Technical aspects</h2>
<p>Here I talk a bit about the technology used in depth rather than skimming over it. I talk more about how I implemented certain aspects</p>

<h3>P5</h3>
<p>
  The open-source library p5 came in clutch. They allowed me to take the input of ones microphone throught audio context and plug this into a model to get a pitch back. This is together with the ml5 model learning extension to p5.
  Further more, p5 was not used and the canvas created by p5 was abandoned.
</p>

<h3>Phaser</h3>
<p>
  Phaser allowed me to setups scenes. These scenes were built in a canvas made by myself and plugged into a scene. The scene then allowed for sprites, text, images, and sprite sheets turned into animations to be placed in the world. 
  Phaser works top to bottom with their Y-axis

</p>
