// sound effect object
// creates n objects for each sound and cycles
// through them for playback
function sFO(fileName, n) {
    this.carousel = [];
    this.turn = 0;
    for (var i=0; i < n; ++i) {
        this.carousel[i] = new Audio(fileName)
    }

    this.play = function() {
        this.turn = ++this.turn % this.carousel.length;
        // this.carousel[this.turn].play();
    };

    this.loop = function() {
        this.carousel[this.turn].loop = true
    }
}


const shot_sound = new sFO("sound/Laser_Shoot31.wav", 10)
const explosion_sound = new sFO("sound/small-explosion.wav", 10)
