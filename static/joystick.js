const joystick = nipplejs.create({
  zone: document.getElementById('pitchYawJoystick'),
  mode: 'static',
  position: { left: '50%', top: '50%' },
  color: 'cyan'
});

let pitch = 0, yaw = 0;
window.pitch = pitch; // For Three.js usage
window.yaw = yaw; 

function sendOrientation(pitch, roll, yaw) {
    fetch('/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            pitch: pitch,
            roll: roll,
            yaw: yaw
        })
    }).then(res => res.json())
      .then(data => console.log("Server response:", data))
      .catch(err => console.error("Failed to send orientation:", err));
}

function updateControlDom(pitch,yaw) {
  document.getElementById('pitchValue').textContent = `${Math.round(pitch * 100)}%`;
  document.getElementById('rollValue').textContent = `${Math.round(yaw * 100)}%`;
  window.pitch = pitch; 
  window.yaw = yaw; 
  sendOrientation(pitch,0,yaw)
}

joystick.on('move', (evt, data) => {
  if (data && data.angle) {
    const angle = data.angle.radian;
    const dist = data.distance;
    pitch = Math.sin(angle) * dist * 0.02;
    yaw = Math.cos(angle) * dist * 0.02;
    updateControlDom(pitch, yaw);
  }
});

joystick.on('end', () => {
  pitch = 0;
  yaw = 0;
  updateControlDom(pitch, yaw);
});

// const knob = document.getElementById('rollKnob');
// const center = { x: 75, y: 75 };
let rollAngle = 0;
window.rollAngle = rollAngle; // For Three.js usage
// knob.addEventListener('mousedown', (e) => {
//   function moveHandler(ev) {
//     const rect = knob.parentElement.getBoundingClientRect();
//     const mouseX = ev.clientX - rect.left;
//     const mouseY = ev.clientY - rect.top;
//     const dx = mouseX - center.x;
//     const dy = center.y- mouseY;
//     const dist = Math.sqrt(dx*dx + dy*dy);
//     const clampedDist = Math.max(48, Math.min(52, dist));

//     const angle = Math.atan2(dy, dx);
//     knob.setAttribute('cx', center.x + clampedDist * Math.cos(angle));
//     knob.setAttribute('cy', center.y - clampedDist * Math.sin(angle));
//     window.rollchange=true;
//     rollAngle = angle; 
//     window.rollAngle = rollAngle; 
//     document.getElementById('rollValue').textContent = `${Math.round(rollAngle * (180 / Math.PI))}°`;
//   }

//   function upHandler() {
//     window.removeEventListener('mousemove', moveHandler);
//     window.removeEventListener('mouseup', upHandler);
//     rollAngle=0;
//     window.rollchange=false;
//   }

//   window.addEventListener('mousemove', moveHandler);
//   window.addEventListener('mouseup', upHandler);
// });
    const slider = document.getElementById("slider");
    const button = document.getElementById("button");
    const rolldisplay=document.getElementById('yawValue')
    const sliderHeight = slider.offsetHeight;
    const buttonRadius = button.offsetHeight / 2;

    window.isDragging = false;

    const setButtonPosition = (y) => {
      const minY = 0;
      const maxY = sliderHeight;
      y = Math.min(Math.max(y, minY), maxY);

      button.style.bottom = `${y- buttonRadius}px`;

      // Normalize to value between -1 and 1
      const normalized = ((y / sliderHeight) * 2) - 1;
      window.rollAngle=rollAngle = normalized;
      sendOrientation(0,rollAngle,0)
      rolldisplay.textContent = `${Math.round(normalized*100)}%`;
    };
    
    button.addEventListener("mousedown", (e) => {
      window.isDragging = true;
      slider.style.opacity = "0.7"; 
    });

    window.addEventListener("mouseup", () => {
      window.isDragging = false;
      slider.style.opacity = "0.4";
      setButtonPosition(sliderHeight / 2); // Reset to center on mouse up
    });

    window.addEventListener("mousemove", (e) => {
      if (!window.isDragging) return;
      const rect = slider.getBoundingClientRect();
      const y = rect.bottom - e.clientY;
      setButtonPosition(y);
    });

    // Initial position (center)
    setButtonPosition(sliderHeight / 2);