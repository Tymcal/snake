import React, { useEffect, useRef, useState } from 'react';
import './App.css'
import { ExampleContent } from './data'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faImages } from '@fortawesome/free-solid-svg-icons'


const CameraComponent: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraViewRef = useRef<HTMLDivElement | null>(null);
  const {img, title, appearance, poisonous, attack, threaten, prey, habitat} = ExampleContent

  // Start the camera when the component mounts
  useEffect(() => {
    startCamera();
  }, []);

  const startCamera = () => {
    const constraints = {
      video: {
        facingMode: 'environment',
      },
      audio: false,
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('autoplay', 'true');
          videoRef.current.setAttribute('playsinline', 'true');
          videoRef.current.style.height = '100%';
          videoRef.current.style.objectFit = 'cover';
        }
      })
      .catch((error) => {
        console.error('Error accessing the camera: ', error);
      });
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (video) {
      // Create a canvas element to capture the frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the video frame on the canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL('image/png'); // Get the captured image data
        setCapturedImage(image);
      }
    }
  };

  return (
    <div className="camera-container">
      <div className="camera-view" ref={cameraViewRef}>
        {!capturedImage ? (
          <video ref={videoRef} id="camera-stream" />
        ) : (
          <img src={capturedImage} alt="Captured" style={{ height: '100%' }} />
        )}
        {capturedImage && (
        <div className="info-overlay">
          
          <div className="info-content">
            <button
                className="back-button"
                onClick={() => {
                  setCapturedImage(null); // Clear the captured image
                  startCamera(); // Restart the camera
                }}
              >
                <FontAwesomeIcon icon={faAngleLeft} style={{color: "#ffffff",}} /> Back
            </button>
            <img className='snake-img' src={img} alt="" />
            <h2>{title}</h2>
            <p className='appearance' >{appearance}</p>
            <div className="details">
              <div>{poisonous}พิษ</div>
              <div>{attack}กัด</div>
              <div>{threaten}ขู่</div>
            </div>
            <hr />
            <p className='subtitle'>อาหาร</p>
            <p>{prey}</p>
            
            <p><p className='subtitle'>ที่อยู่</p>{habitat}</p>
          </div>
        </div>
      )}
      </div>
      {/* Conditionally render the capture and upload buttons only when there's no captured image */}
      {!capturedImage && (
        <div className="button-container">
          <input
            type="file"
            accept="image/*"
            id="upload-image"
            style={{ display: 'none' }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.target.files && event.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  if (e.target?.result) {
                    setCapturedImage(e.target.result as string);
                  }
                };
                reader.readAsDataURL(event.target.files[0]);
              }
            }}
          />

          <button
            className="upload-button"
            onClick={() => document.getElementById('upload-image')?.click()}
          >
            <FontAwesomeIcon icon={faImages} size="2xl" style={{color: "#ffffff",}} />
          </button>
          <button className="capture-button" onClick={capturePhoto}></button>
        </div>
      )}

      
    </div>
  );
};

export default CameraComponent;
