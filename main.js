console.log("Three.js loaded:", typeof THREE !== "undefined");

if (typeof THREE !== "undefined") {
  // Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("solarCanvas"),
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Sun
  const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xfdb813 });
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  scene.add(sun);

  // Light
  const pointLight = new THREE.PointLight(0xffffff, 2, 100);
  pointLight.position.set(0, 0, 0);
  scene.add(pointLight);

  // Planet Data
  const planetData = [
    { name: "Mercury", color: 0xaaaaaa, size: 0.4, dist: 4 },
    { name: "Venus", color: 0xffc04d, size: 0.8, dist: 6 },
    { name: "Earth", color: 0x3399ff, size: 0.9, dist: 8 },
    { name: "Mars", color: 0xff3300, size: 0.7, dist: 10 },
    { name: "Jupiter", color: 0xff9966, size: 1.6, dist: 14 },
    { name: "Saturn", color: 0xffcc66, size: 1.5, dist: 17 },
    { name: "Uranus", color: 0x66ffff, size: 1.2, dist: 20 },
    { name: "Neptune", color: 0x3366ff, size: 1.2, dist: 23 },
  ];

  const planets = [];
  const speedMap = {};
  const controlsDiv = document.getElementById("controls");

  // Create Planets
  planetData.forEach((data, index) => {
    const geo = new THREE.SphereGeometry(data.size, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: data.color });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = data.dist;
    mesh.userData = { angle: Math.random() * Math.PI * 2, distance: data.dist };
    scene.add(mesh);
    planets.push({ mesh, data });

    // Speed sliders
    speedMap[data.name] = 0.01 + index * 0.002;

    const label = document.createElement("label");
    label.innerText = `${data.name} Speed:`;
    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = 0;
    slider.max = 0.1;
    slider.step = 0.001;
    slider.value = speedMap[data.name];
    slider.oninput = (e) => {
      speedMap[data.name] = parseFloat(e.target.value);
    };
    controlsDiv.appendChild(label);
    controlsDiv.appendChild(slider);
  });

  // Background stars
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 5000;
  const starVertices = [];

  for (let i = 0; i < starCount; i++) {
    const x = (Math.random() - 0.5) * 1000;
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(starVertices, 3)
  );
  const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);

  camera.position.z = 30;

  // Animate
  let paused = false;
  document.getElementById("pauseBtn").addEventListener("click", () => {
    paused = !paused;
    document.getElementById("pauseBtn").innerText = paused ? "Resume" : "Pause";
  });

  function animate() {
    requestAnimationFrame(animate);
    if (!paused) {
      planets.forEach(({ mesh, data }) => {
        mesh.userData.angle += speedMap[data.name];
        mesh.position.x =
          Math.cos(mesh.userData.angle) * mesh.userData.distance;
        mesh.position.z =
          Math.sin(mesh.userData.angle) * mesh.userData.distance;
        mesh.rotation.y += 0.01;
      });
    }
    renderer.render(scene, camera);
  }

  animate();

  // Responsive
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
