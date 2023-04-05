const video = document.getElementById('video')
const model = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(model),
  faceapi.nets.faceLandmark68Net.loadFromUri(model),
  faceapi.nets.faceRecognitionNet.loadFromUri(model),
  faceapi.nets.faceExpressionNet.loadFromUri(model)
]).then(startVideo)

function startVideo() {
  navigator.mediaDevices.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('playing', () => {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas, displaySize)
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
    const resizedDetections = faceapi.resizeResults(detections, displaySize)
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    faceapi.draw.drawDetections(canvas, resizedDetections)
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections)
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
  }, 100)
})
