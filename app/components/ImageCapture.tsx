import { CheckIcon } from '@heroicons/react/24/outline';
import { ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import {
  FC,
  HTMLProps,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from 'react';

function dataUrlToFile(dataUrl: string, filename: string) {
  const [header, base64Data] = dataUrl.split(',');
  const mimeMatch = header.match(/:(.*?);/);
  const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
  const binary = atob(base64Data);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new File([array], filename, { type: mimeType });
}

const ImageCapture: FC<{
  onPhotoSubmit: (file: File) => void;
  onRetake: () => void;
  isApiCallLoading: boolean;
}> = ({ onPhotoSubmit, onRetake, isApiCallLoading }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>();
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [photo, setPhoto] = useState<string>();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    setIsCameraOn(true);
    onRetake();
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          'Camera access not supported in this browser. Try Safari or update iOS.'
        );
        return;
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          setStream(mediaStream);
        };
      }
    } catch (e) {
      console.error('Camera access denied:', e);
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted)
      (async () => {
        await startCamera();
      })();
    return () => {
      mounted = false;
    };
  }, []);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOn(false);
    setStream(null);
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Ensure video has data
    if (video.readyState < 2) {
      console.warn('Video not ready yet');
      return;
    }

    // Match canvas to real video frame size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL('image/png');
    setPhoto(imageData);
    stopCamera();
  };

  const imageButtonStyle =
    'flex gap-1 items-center bg-emerald-600/80 hover:bg-emerald-600 cursor-pointer text-black text-sm px-6 py-4 rounded-3xl font-semibold text-white';

  return (
    <>
      <section className="w-full max-h-full">
        {isCameraOn ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="min-w-full h-full object-cover"
            />
            {stream && (
              <button
                onClick={captureImage}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[80px] h-[80px] rounded-full border-[6px] border-white/70 flex items-center justify-center shadow-md active:scale-95 transition-transform"
              >
                <span className="w-[60px] h-[60px] rounded-full bg-white/90 transition-colors shadow-inner active:bg-gray-200" />
              </button>
            )}
          </div>
        ) : (
          <div className="relative h-full">
            {photo && (
              <img
                src={photo}
                alt="captured photo"
                className="min-w-full h-full object-cover"
              />
            )}
            {!isApiCallLoading && (
              <div className="flex justify-between absolute bottom-4 left-0 w-full px-4">
                <button className={imageButtonStyle} onClick={startCamera}>
                  <ArrowUturnLeftIcon className="w-4 h-4" /> Retake
                </button>
                <button
                  className={imageButtonStyle}
                  onClick={() => {
                    const photoFile = dataUrlToFile(photo!, 'temp.png');
                    onPhotoSubmit(photoFile);
                  }}
                >
                  <CheckIcon className="w-4 h-4" /> Submit
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      <canvas ref={canvasRef} className="hidden" />
    </>
  );
};

export default ImageCapture;
