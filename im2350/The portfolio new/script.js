// Setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.lineWidth = 10;
const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
gradient.addColorStop(0, 'white');
gradient.addColorStop(0.5, 'green');
gradient.addColorStop(1, 'white');
ctx.fillStyle = gradient;
ctx.strokeStyle = 'black';
this.element = document.getElementById('caption').getBoundingClientRect();
console.log(this.element);




// array of images that are to be included in the site 
const imageFiles = ['renderPersonal.png', 'uberGame.png', 'DaveCourt.png', 'cyberFeminism.png', 'speculativeFuture.png', 'draining.png', 'ThreeDMe.png', 'paradiseClub.png', 'mediaPlayer.png', 'contactMe.png'];
const imageLinks = {
    contactMe: document.getElementById("contactMeDiv"),
    DaveCourt: document.getElementById("DaveCourtDiv"),
    uberGame: "https://www.youtube.com/",
    cyberFeminism: document.getElementById("cyberFeminismDiv"),
    ThreeDMe: document.getElementById("ThreeDMeDiv"),
    speculativeFuture: document.getElementById("speculativeFutureDiv"),
    mediaPlayer: "https://lucash0rta.github.io/im2350/a2/e4/index.html",
    draining: document.getElementById("drainingDiv"),
    paradiseClub: document.getElementById("paradiseClubDiv"),
    mediaPlayer: document.getElementById("mediaPlayerDiv")
}
let testString = "insta.png"

let currentLink;

//console.log(imageLinks[testString.replace('.png', '')])

// randomly selects one of the image files from the array
const selectedImageFile = imageFiles[Math.floor(Math.random() * imageFiles.length)];

const image = new Image();
image.src = selectedImageFile;

image.onload = () => {
   // console.log('Image is loaded.'); // This message will be displayed when the image is loaded
};

// Particle class originally designed from franks laboratory tutorial, i would like to change this to 
// work with the image sizes of each of the images instead of the random dimensions 
class Particle {
    constructor(effect) {
        this.effect = effect;
        this.size = 80;
        this.x = this.size + Math.random() * (this.effect.width - this.size * 2);
        this.y = this.size + Math.random() * (this.effect.height - this.size * 2);
        this.vx = Math.random() * 2 - 2;
        this.vy = Math.random() * 2 - 2;
        this.collided = false;
        //forceforcentre point
        this.attractForce = 0.1;
        // setting the hover state to false so it doesnt trigger 
        this.hovered = false;

        // randomly selects one of the image files from the array
        // image files is the array. imagefiles.length calculates the length of the array 
        // the math is saying to calculate a random value between the total length of the array and assigns the value 
        /* this.imageSrc = imageFiles[Math.floor(Math.random() * imageFiles.length)]; */
        this.imageSrc = imageFiles.pop();
        this.rectCollided = false;
        
    }

    

    
    

    draw(context) {
        context.fillStyle = 'gradient';
        context.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    
        // changes the size of the particles if it is in a hovered state 
        const size = this.hovered ? this.size * 3 : this.size;
        
        // Load and draw the selected image
        const image = new Image();
        image.src = this.imageSrc;
        
        // Calculate width and height based on the original aspect ratio
        const aspectRatio = image.width / image.height;
        let imgWidth = size;
        let imgHeight = size / aspectRatio;
    
        // Draw the image, maintaining its aspect ratio
        context.drawImage(image, this.x - imgWidth / 2, this.y - imgHeight / 2, imgWidth, imgHeight);

        
    
        //context.lineWidth = 50;
    }

    update() {
        
        // Attraction force towards the mouse cursor
        const dx = this.x - this.effect.mouse.x;
        const dy = this.y - this.effect.mouse.y;
        const distance = Math.hypot(dx, dy);
        const force = this.effect.mouse.radius / distance;
        
        if (distance < this.effect.mouse.radius) {
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * 0;
            this.y += Math.sin(angle) * 0;        }

        // If the particle is hovered, it should not move regardless of collisions
        if (this.hovered) {
            this.vx = 0; // Set horizontal velocity to zero
            this.vy = 0; // Set vertical velocity to zero
            console.log(this.imageSrc)
            currentLink = imageLinks[this.imageSrc.replace('.png', '')]
        } else {
            //currentLink = null;
            //Attraction force towards the center
            //console.log('nonhover')
            const centerX = this.effect.width / 2;
            const centerY = this.effect.height / 2;
            const dxCenter = centerX - this.x;
            const dyCenter = centerY - this.y;
            const distanceCenter = Math.hypot(dxCenter, dyCenter);

            const forceX = dxCenter / distanceCenter;
            const forceY = dyCenter / distanceCenter;

            this.vx += forceX * this.attractForce;
            this.vy += forceY * this.attractForce;
            

            // Collision detection and response
            // beginning with going through all the particles using the for (const particle of this.effect.particles)
            for (const particle of this.effect.particles) {
                /* if particle ! == this makes sure that the particle is not comparing to itself */
                if (particle !== this) {
                    // calculate the distance between the particles x and y values 
                    const dx = this.x - particle.x;
                    const dy = this.y - particle.y;

                    // finding the hypotenuse using the dx and dy amounts created above 
                    const distance = Math.hypot(dx, dy);
                    /* check if the distance between between them is less then the sum of their radius  */
                    if (distance < (this.size + particle.size) / 2) {
                        // if the collision is detected then the following code is triggered
                        // atan2 is used to calculate the new angle in radians that the object should move in after collision
                        // i dont fully understand this math but was shown and adapted from franks Laboratory tutorials
                        const angle = Math.atan2(dy, dx);

                        /* console logging to better understand how the math works.  */
                        /* console.log("Angle:", angle); */

                        /* calculating how much the particles are overlapping 
                        using the size of both particles then dividing by 2 it gives me the average size
                        then I minus the distance between the particles if the distance is less than the average size 
                        then they are overlapping. if they are overlapping then the amount will be a positive number   */
                        const overlap = (this.size + particle.size) / 2 - distance;

                        // using the angle calculated with the atan the below math moves the x and y coordinates
                        // of the object that has collided in that direction ive multipliedd by 0.5 here 
                        // so that they dont move too quickly from eachother essentially dampening their movement 
                        this.x += Math.cos(angle) * overlap * 0.5;
                        this.y += Math.sin(angle) * overlap * 0.5;

                        /* If the object has collided then reduce the velocity of the particles by multiplying the current velocity in x and
                        y by 0.999 i added this code because the ongoing force towards the center of the screen constantly 
                        adds velocity to the objects to move in. I have tried a few methods of reducing the force to the 
                        centre but found that some objects would get stuck to the corners of the screen. i find with a higher force 
                        and using the dampening works best for my desird effect  */
                        if (!this.collided) {
                            this.vx *= 0.995; // Horizontal  damping
                            this.vy *= 0.995; // Vertical  damping
                            this.collided = true; // avoid multiple damping in the same frame
                        }
                    } else {
                        this.collided = false; // Reset the collision flag if no collision occurred in this frame
                    }


                }
            }
        }

        // Bounce off the canvas edges - originally addapted from franks laboratory tutorial 
        if (this.x < this.size / 2) {
            this.x = this.size / 2;
            this.vx *= -0.5;
        } else if (this.x > this.effect.width - this.size / 2) {
            this.x = this.effect.width - this.size / 2;
            this.vx *= -0.5;
        }
        if (this.y < this.size / 2) {
            this.y = this.size / 2;
            this.vy *= -0.5;
        } else if (this.y > this.effect.height - this.size / 2) {
            this.y = this.effect.height - this.size / 2;
            this.vy *= -0.5;
        }

        // Update the particle's position based on its velocity
        this.x += this.vx;
        this.y += this.vy;
    }

    reset() {
        this.x = this.size + Math.random() * (this.effect.width - this.size * 2);
        this.y = this.size + Math.random() * (this.effect.height - this.size * 2);
    }
    
}



// Effect class definition
class Effect {
    

    
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = imageFiles.length;
        this.createParticles();

        this.mouse = {
            x: 0,
            y: 0,
            // unnecesary code from previous trials of effects
           // pressed: false,
           // radius: 300
        }

        // Event listeners
        window.addEventListener('resize', e => {
            this.resize(window.innerWidth, window.innerHeight);
            this.element = document.getElementById('caption').getBoundingClientRect();
        });

        canvas.addEventListener('mousemove', (e) => {
            const canvasRect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - canvasRect.left;
            const mouseY = e.clientY - canvasRect.top;
            
            for (const particle of effect.particles) {
                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const distance = Math.hypot(dx, dy);
                
                if (distance < particle.size / 2 && !particle.hovered) {
                    // Particle is now hovered
                    particle.hovered = true;
                    document.body.style.cursor = "pointer";
                    console.log('hello')
                } else if (distance >= particle.size / 2 && particle.hovered) {
                    // Particle is no longer hovered
                    particle.hovered = false;
                    document.body.style.cursor = "auto";
                    console.log('goodbye')
                    
                }
            }
        });
    }

    createParticles() {
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }

    handleParticles(context) {
        const falafel = this.falafel;
        //commenting out the call for connecting particles. 
       // this.connectParticles(context);
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.update();
            
        });
        function drawRectangle() {
}


        
    }

    

    // code originally made through franksLaboratory tutorial that I no longer need as connecting the images is not apart of my initial design

/*     connectParticles(context) {
        const maxDistance = 100;
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = 0; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.hypot(dx, dy);
                if (distance < maxDistance) {
                    context.save();
                    const opacity = 1 - (distance / maxDistance);
                    context.globalAlpha = opacity;
                    context.beginPath();
                    context.moveTo(this.particles[a].x, this.particles[a].y);
                    context.lineTo(this.particles[b].x, this.particles[b].y);
                    context.stroke();
                    context.restore();
                }
            }
        }
    } */

    resize(width, height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = width;
        this.height = height;
        this.context.fillStyle = 'blue';
        const gradient = this.context.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, 'white');
        gradient.addColorStop(0.5, 'green');
        gradient.addColorStop(1, 'white');
        this.context.fillStyle = gradient;
        this.context.strokeStyle = 'grey';
        this.particles.forEach(particle => {
            particle.reset();
            
        })
    }
}

const effect = new Effect(canvas, ctx);

// Animation loop
function animate() {
    //redrawing the canvas with a background fill so that the trails from movement can be controlled 
    // using rgba so that I can utilise the alpha channel to show the path of the image or trails 

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    effect.handleParticles(ctx);
    requestAnimationFrame(animate);
}
animate();

/* function getKeyByValue(object, value) {
    return Object.keys
} */

canvas.addEventListener('mousemove', e => {
    for (const particle of effect.particles) {
        const dx = particle.x - e.clientX;
        const dy = particle.y - e.clientY;
        const distance = Math.hypot(dx, dy);
        if (distance < particle.size / 2) {
            particle.hovered = true;
        } else {
            particle.hovered = false;
        }
    }
});

/*  here i have edited the code for the original html setup that i had 

replacing the  href with the link 
canvas.addEventListener('click', () => {
    for (const particle of effect.particles) {
        if (particle.hovered && particle.imageSrc) {
            const link = imageLinks[particle.imageSrc.replace('.png', '')];
            if (link) {
                window.location.href = link;
            }
        }
    }
});

*/

canvas.addEventListener('click', () => {
    for (const particle of effect.particles) {
        if (particle.hovered && particle.imageSrc) {
            const link = particle.imageSrc.replace('.png', '');
            const div = imageLinks[link];
            div.style.display = 'block';

            // Scroll to the div
            div.scrollIntoView({
                behavior: 'smooth', // smooth scroll
                block: 'center',    // vertical alignment
                inline: 'center'    // horizontal alignment
            });
        }
    }
});
document.addEventListener("DOMContentLoaded", () => {

    /* DaveCourtHouseParty */
    const popupCardDaveCourt = document.getElementById("DaveCourtDiv");
    const closeButtonDaveCourt = document.getElementById("closeButtonHouseParty");

    closeButtonDaveCourt.addEventListener("click", () => {
        toggleDisplay(popupCardDaveCourt, closeButtonDaveCourt);
    });

    /* threedme */
    const popupCard3DMe = document.getElementById("ThreeDMeDiv");
    const closeButton3DMe = document.getElementById("closeButton3dMe");

    closeButton3DMe.addEventListener("click", () => {
        toggleDisplay(popupCard3DMe, closeButton3DMe);
    });

    /* speculative future */
    const popupCardSpeculative = document.getElementById("speculativeFutureDiv");
    const closeButtonSpeculative = document.getElementById("closeButtonSpeculativeFuture");

    closeButtonSpeculative.addEventListener("click", () => {
        toggleDisplay(popupCardSpeculative, closeButtonSpeculative);
    });

    /* cyberfeminism */
    const popupCardCyberFeminism = document.getElementById("cyberFeminismDiv");
    const closeButtonCyberFeminism = document.getElementById("closeButtoncyberFeminism");

    closeButtonCyberFeminism.addEventListener("click", () => {
        toggleDisplay(popupCardCyberFeminism, closeButtonCyberFeminism);
    });

    /* paradise club */
    const popupCardParadiseClub = document.getElementById("paradiseClubDiv");
    const closeButtonParadiseClub = document.getElementById("closeButtonParadiseClub");

    closeButtonParadiseClub.addEventListener("click", () => {
        toggleDisplay(popupCardParadiseClub, closeButtonParadiseClub);
    });

    /* draining */
    const popupCardDraining = document.getElementById("drainingDiv");
    const closeButtonDraining = document.getElementById("closeButtonDraining");

    closeButtonDraining.addEventListener("click", () => {
        toggleDisplay(popupCardDraining, closeButtonDraining);
    });


/* mediaPlayerDiv */
const popupCardMediaPlayer = document.getElementById("mediaPlayerDiv");
const closeButtonMediaPlayer = document.getElementById("closeButtonMediaPlayer");

closeButtonMediaPlayer.addEventListener("click", () => {
    toggleDisplay(popupCardMediaPlayer, closeButtonMediaPlayer);
});

    /* contactMeDiv */
    const popupCardContactMe = document.getElementById("contactMeDiv");
    const closeButtonContactMe = document.getElementById("closeButtonContactMe");
    closeButtonContactMe.addEventListener("click", () => {
        toggleDisplay(popupCardContactMe, closeButtonContactMe);
    });

    
    });


// Helper function to toggle the display of the given element
function toggleDisplay(element, closeButton) {
    if (element.style.display === "none" || element.style.display === "") {
        element.style.display = "block";
        closeButton.querySelector('img').src = "new_image.png"; // Image to show when popupCard3DMe is displayed
    } else {
        element.style.display = "none";
        closeButton.querySelector('img').src = "cross.png"; // Original cross image
    }
}


//setting a timrout function so that the event isnt constantly being contradicted by itself.
//when setting the pointer events to none after hover then the mouse would no longer be hovering 
//and the  layer would be visible again
document.querySelector('.hoverTrigger').addEventListener('mouseover', function() {
    this.style.opacity = '0';
    this.style.pointerEvents = 'none';
    setTimeout(() => {
        this.style.opacity = '1';
        this.style.pointerEvents = 'auto';
    }, 4000);  // 4000 milliseconds equals 4 seconds
});

