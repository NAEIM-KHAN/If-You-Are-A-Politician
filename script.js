const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const popup = document.getElementById('popup');
const resultImage = document.getElementById('resultImage');
const spinButton = document.getElementById('spin');

canvas.width = 300;
canvas.height = 300;

// Define images and properties for each segment
const segments = [
  { image: 'images/image1.jpg' },
  { image: 'images/image2.jpg' },
  { image: 'images/image3.jpg' },
  { image: 'images/image4.jpg' },
  { image: 'images/image5.jpg' },
  { image: 'images/image6.jpg' },
  { image: 'images/image7.jpg' },
  { image: 'images/image8.jpg' },
  { image: 'images/image9.jpg' },
];

let angle = 0; // Tracks the current rotation angle
let spinning = false; // Prevents multiple spins at the same time

// Preload images for the wheel
function loadImages() {
  return Promise.all(
    segments.map(
      (segment) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = segment.image;
          img.onload = () => {
            segment.img = img;
            resolve();
          };
        })
    )
  );
}

// Draw the wheel with images
function drawWheel() {
    const segmentAngle = (2 * Math.PI) / segments.length;
  
    segments.forEach((segment, index) => {
      // Calculate start and end angles for the segment
      const startAngle = angle + segmentAngle * index;
      const endAngle = startAngle + segmentAngle;
  
      // Draw segment background
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        startAngle,
        endAngle
      );
      ctx.closePath();
      ctx.fillStyle = index % 2 === 0 ? '#ffcc00' : '#ff9900';
      ctx.fill();
      ctx.stroke();
  
      // Clip the segment for the image
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        startAngle,
        endAngle
      );
      ctx.closePath();
      ctx.clip();
  
      // Calculate the position and size of the image
      const imgAngle = startAngle + segmentAngle / 2; // Center angle of the segment
      const imgX =
        canvas.width / 2 +
        Math.cos(imgAngle) * canvas.width / 4 -
        segment.img.width / 6;
      const imgY =
        canvas.height / 2 +
        Math.sin(imgAngle) * canvas.height / 4 -
        segment.img.height / 6;
  
      ctx.drawImage(
        segment.img,
        imgX,
        imgY,
        segment.img.width / 3, // Scale down image width
        segment.img.height / 3 // Scale down image height
      );
  
      ctx.restore();
    });
  }
  

// Spin the wheel with smooth animation
function spinWheel() {
  if (spinning) return;

  spinning = true;
  let spinAngle = Math.random() * 360 + 720; // Randomize the spin between 2–3 full spins
  let currentAngle = 0;
  const speed = 10;

  function animate() {
    currentAngle += speed;
    if (currentAngle >= spinAngle) {
      currentAngle = spinAngle; // Stop when the desired angle is reached
      spinning = false;
      showResult();
    }
    angle += (speed * Math.PI) / 180;
    drawWheel();
    if (spinning) requestAnimationFrame(animate);
  }

  animate();
}

// Display the random result image
function showResult() {
  const segmentAngle = 360 / segments.length;
  const normalizedAngle = (360 - ((angle * 180) / Math.PI) % 360) % 360; // Normalize to 0–360 degrees
  const resultIndex = Math.floor(normalizedAngle / segmentAngle);

  const result = segments[resultIndex];

  // Set the image source dynamically
  const resultImage = document.getElementById('resultImage');
  resultImage.src = result.image;

  // Show the pop-up and hide the spinning wheel (optional)
  const popup = document.getElementById('popup');
  const wheelContainer = document.getElementById('wheel-container');

  popup.classList.remove('hidden');
  popup.style.display = 'block';

  // Optional: Hide or reduce visibility of the spinning wheel
  wheelContainer.style.opacity = 0.3; // Dim the wheel
  wheelContainer.style.pointerEvents = 'none'; // Disable interaction with the wheel

  // Add close functionality
  document.getElementById('closePopup').addEventListener('click', () => {
    popup.classList.add('hidden');
    popup.style.display = 'none';

    // Restore wheel visibility and interaction
    wheelContainer.style.opacity = 1;
    wheelContainer.style.pointerEvents = 'auto';
  });
}


// Handle spin button click
spinButton.addEventListener('click', spinWheel);

// Load images and draw the wheel initially
loadImages().then(drawWheel);


document.getElementById('closePopup').addEventListener('click', () => {
  const popup = document.getElementById('popup');
  popup.classList.add('hidden'); // Add hidden class to hide the pop-up
  popup.style.display = 'none'; // Ensure it's hidden
});

function showResult() {
  const segmentAngle = 360 / segments.length;
  const normalizedAngle = (360 - ((angle * 180) / Math.PI) % 360) % 360; // Normalize to 0–360 degrees
  const resultIndex = Math.floor(normalizedAngle / segmentAngle);

  const result = segments[resultIndex];

  // Set the image source dynamically
  const resultImage = document.getElementById('resultImage');
  resultImage.src = result.image;

  // Show the pop-up
  const popup = document.getElementById('popup');
  popup.classList.remove('hidden');
  popup.style.display = 'block';
}