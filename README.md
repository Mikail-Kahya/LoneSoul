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
  I found <strong>Phaser</strong>, a library for web games that did all the aspects I needed at the time. So, I started my development <strong>learning 2 new libraries</strong>, how to make the model of pitch detection work. More about that second part later. 
  Phaser had a rough framework allowing me to make scenes, transition between scenes, and put sprites on those scenes with their collision. Most collisions were made through svgs and json files. More in technical part.
</p>
<p>
  As a web dev, <strong>modularity</strong> wasn't taught to me. Magical numbers were shunned, but not outright seen as mistakes. That made the visiting back to this project one hell of a task. 
  <strong>As a developer I see where I have grown exponentialy</strong> and I am proud of where I am now. Looking back at the code even now there are issues, but a full remake of Lone Soul would take more time than it is worth. 
</p>
<h3>Changes</h3>
<p>
  Looking back at the code, the entire game was built in the scene itself. This was a mess filled with spaghetti code such as;<br>
  - The player's input was affected by the scene<br>
  - The collisions used the observer pattern and added a new observer every frame<br>
  - The game was frame dependent<br>
  - No comments were used<br>
  - Classes were avoided<br>
  - Inheritance was used over composition<br>
  - Etc.<br>
  It is quite obvious that the past version of Lone Soul cut a lot of corners and avoided the hardships of software engineering. I am giving myself some slack by saying it was my first game ever. 
  The changed version however isn't perfect. I would have enjoyed using the observer pattern more, I did miss it in this current project. Reasons for not using it is the <strong>unfamiliarity of JavaScript syntax</strong>. 
</p>
<p>
  <strong>Classes</strong> were new to me at the time of the conception of Lone Soul. Now that I have grown as a developer, it only is normal to put the logic in their respective classes and clean up my scene. 
  <strong>If you ever want to check out what it was before, the first commit is the original Lone Soul.</strong> This had come with the increase of using programming patterns and the structure I learnt from developing in C++.
</p>

<hr />
<h2>Technical aspects</h2>
<p>Here I talk a bit about the technology used in depth rather than skimming over it. I talk more about how I implemented certain aspects</p>

<h3>P5</h3>
<p>
  The open-source library p5 came in clutch. They allowed me to take the input of a microphone through audio context and plug this into a model to get a pitch back. This is together with the <strong>ml5 model learning extension to p5</strong>.
  Further more, p5 was not used and the canvas created by p5 was discarded.
</p>

<h3>Phaser</h3>
<p>
  Phaser allowed me to setups scenes. These scenes were built in a canvas made by myself and plugged into phaser. The scene then allowed for <strong>sprites, text, images, and sprite sheets turned into animations</strong> to be placed in the world. 
  Phaser works top to bottom with their Y-axis, which is logical for web development, but becomes a hassle in game development. Anyone who has worked with WIN32 can attest to that.
</p>
