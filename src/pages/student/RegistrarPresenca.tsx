import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Upload, ArrowLeft, MapPin, Camera, Loader2, ShieldCheck, Play, AlertTriangle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import * as faceapi from 'face-api.js';
import jsQR from 'jsqr';
import toast from "react-hot-toast";
import StudentService from "../../services/student.service";
import CryptoJS from 'crypto-js';

interface QRCodeData {
  classId: string;
  className: string;
  professor: string;
  timestamp: string;
}

const MAX_ATTEMPTS = 30;

const RegistrarPresenca = () => {
  const navigate = useNavigate();
  const { encryptedData } = useParams();
  const [activeTab, setActiveTab] = useState<'scan' | 'upload'>('scan');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [qrCodeData, setQRCodeData] = useState<QRCodeData | null>(null);
  const [showFaceRecognition, setShowFaceRecognition] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isFaceMatched, setIsFaceMatched] = useState<boolean | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [qrError, setQrError] = useState<string>('');
  const [showPreModal, setShowPreModal] = useState(false);
  const [recognitionStarted, setRecognitionStarted] = useState(false);
  const [recognitionAttempts, setRecognitionAttempts] = useState(0);
  const [recognitionFailed, setRecognitionFailed] = useState(false);
  const [hasMatched, setHasMatched] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [showScanButton, setShowScanButton] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanVideoRef = useRef<HTMLVideoElement>(null);
  const scanCanvasRef = useRef<HTMLCanvasElement>(null);

  const referencePhotoUrl = 'https://i.ibb.co/kDXYYXd/enzzo.jpg';

  useEffect(() => {
    const handleEncryptedData = async () => {
      if (encryptedData) {
        try {
          const secretKey = 'mySecretKey';
          const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), secretKey);
          const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
          setQRCodeData(decryptedData);
          setShowPreModal(true);
        } catch (error) {
          console.error('Error decrypting data:', error);
          toast.error('Link inválido ou expirado');
          navigate('/dashboard');
        }
      }
    };

    handleEncryptedData();
  }, [encryptedData, navigate]);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Não foi possível obter sua localização');
        }
      );
    } else {
      setLocationError('Geolocalização não suportada pelo navegador');
    }
  }, []);

  const startQRScanner = async () => {
    try {
      setShowScanButton(false);
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });

      if (scanVideoRef.current) {
        scanVideoRef.current.srcObject = stream;
        scanVideoRef.current.play();
        scanQRCode();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setQrError('Erro ao acessar a câmera. Por favor, verifique as permissões.');
      setIsScanning(false);
      setShowScanButton(true);
    }
  };

  const stopQRScanner = () => {
    if (scanVideoRef.current && scanVideoRef.current.srcObject) {
      const stream = scanVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      scanVideoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setShowScanButton(true);
  };

  const scanQRCode = () => {
    if (!scanVideoRef.current || !scanCanvasRef.current) return;

    const canvas = scanCanvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const scanInterval = setInterval(() => {
      if (!scanVideoRef.current) {
        clearInterval(scanInterval);
        return;
      }

      canvas.width = scanVideoRef.current.videoWidth;
      canvas.height = scanVideoRef.current.videoHeight;
      context.drawImage(scanVideoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        try {
          const data = JSON.parse(code.data) as QRCodeData;
          stopQRScanner();
          setQRCodeData(data);
          setShowPreModal(true);
        } catch (error) {
          setQrError('QR Code inválido. Por favor, tente novamente.');
          stopQRScanner();
        }
      }
    }, 100);

    return () => clearInterval(scanInterval);
  };

  const loadFaceApiModels = async () => {
    setIsLoadingModels(true);
    try {
      await Promise.all([
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error('Error loading face-api models:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const readQRCode = (file: File): Promise<QRCodeData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            try {
              const data = code.data as QRCodeData;
              resolve(data);
            } catch (error) {
              reject(new Error('Invalid QR code format'));
            }
          } else {
            reject(new Error('No QR code found in image'));
          }
        };
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  };

  const startFaceRecognition = async () => {
    try {
      await loadFaceApiModels();
      setRecognitionStarted(true);
      setRecognitionAttempts(0);
      setRecognitionFailed(false);
      setHasMatched(false);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Error starting face recognition:', error);
      alert('Erro ao acessar a câmera. Por favor, verifique as permissões do navegador.');
    }
  };

  const stopFaceRecognition = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setRecognitionStarted(false);
  };

  let hasMatchedFlag = false;

  const compareFaces = async () => {
    if (!videoRef.current || !canvasRef.current || !recognitionStarted) return;

    try {
      if (hasMatchedFlag) {
        return;
      }

      const referenceImage = await faceapi.fetchImage(referencePhotoUrl);
      const referenceDetection = await faceapi.detectSingleFace(referenceImage)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!referenceDetection) {
        console.error('No face detected in reference image');
        return;
      }

      const videoEl = videoRef.current;
      const detection = await faceapi.detectSingleFace(videoEl)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        const distance = faceapi.euclideanDistance(referenceDetection.descriptor, detection.descriptor);
        const isMatch = distance < 0.6;

        if (isMatch && !hasMatchedFlag) {
          hasMatchedFlag = true;
          const data = await StudentService.postAttendance(qrCodeData);
          console.log(data);
          setIsFaceMatched(true);
          setHasMatched(true);
          stopFaceRecognition();
          setShowSuccessModal(true);
          toast.success('Presença realizada com sucesso!');
        } else if (!isMatch) {
          setRecognitionAttempts(prev => {
            const newAttempts = prev + 1;
            if (newAttempts >= MAX_ATTEMPTS) {
              stopFaceRecognition();
              setRecognitionFailed(true);
            }
            return newAttempts;
          });
        }
      }
    } catch (error) {
      setRecognitionFailed(true);
      console.error('Error comparing faces:', error);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (showFaceRecognition && modelsLoaded && recognitionStarted && !recognitionFailed) {
      interval = setInterval(compareFaces, 100);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
      if (!showFaceRecognition) {
        stopFaceRecognition();
      }
    };
  }, [showFaceRecognition, modelsLoaded, recognitionStarted, recognitionFailed]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setQrError('');

      const data = await readQRCode(file);
      console.log(data, ' valor do qr lido');

      const qrLink = data;

      const encryptedData = qrLink.split('registrar-presenca/')[1];

      if (!encryptedData) {
        throw new Error('Link do QR Code inválido');
      }

      const secretKey = 'mySecretKey';
      const bytes = CryptoJS.AES.decrypt(decodeURIComponent(encryptedData), secretKey);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      console.log('Dados descriptografados:', decryptedData);

      setQRCodeData(decryptedData);
      setShowPreModal(true);

    } catch (error) {
      setQrError('Erro ao ler o QR Code. Por favor, verifique se a imagem contém um QR code válido.');
      console.error('Error reading QR code:', error);
    }
  };

  const handleStartRecognition = () => {
    setShowPreModal(false);
    setShowFaceRecognition(true);
    startFaceRecognition();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Registrar Presença
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        {!showFaceRecognition ? (
          <>
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('scan')}
                  className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 ${
                    activeTab === 'scan'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <QrCode size={20} />
                    <span>Scanear QR Code</span>
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`flex-1 px-6 py-4 text-sm font-medium text-center border-b-2 ${
                    activeTab === 'upload'
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Upload size={20} />
                    <span>Importar QR Code</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                  <MapPin size={16} className="text-primary-600 dark:text-primary-400" />
                  {location ? (
                    <span>Localização atual: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}</span>
                  ) : (
                    <span>{locationError || 'Obtendo localização...'}</span>
                  )}
                </div>
              </div>

              {qrError && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg">
                  {qrError}
                </div>
              )}

              {activeTab === 'scan' ? (
                <div className="text-center space-y-4">
                  <div className="w-full max-w-md mx-auto aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative">
                    {isScanning ? (
                      <>
                        <video
                          ref={scanVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        <canvas
                          ref={scanCanvasRef}
                          className="absolute top-0 left-0 w-full h-full hidden"
                        />
                        <div className="absolute inset-0 border-2 border-primary-500 animate-pulse pointer-events-none" />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Camera size={64} className="text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>
                  {showScanButton ? (
                    <button
                      onClick={startQRScanner}
                      className="px-6 py-3 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 mx-auto"
                    >
                      <Camera size={20} />
                      <span>Iniciar Scanner</span>
                    </button>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">
                      Posicione o QR Code da aula em frente à câmera
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-full max-w-md mx-auto p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <div className="space-y-4">
                      <Upload size={48} className="mx-auto text-gray-400 dark:text-gray-500" />
                      <div>
                        <label
                          htmlFor="qr-upload"
                          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-md cursor-pointer inline-block transition-colors"
                        >
                          Selecionar Arquivo
                        </label>
                        <input
                          type="file"
                          id="qr-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                        />
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Arraste uma imagem do QR Code ou clique para selecionar
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="p-6">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Verificação Facial
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {isLoadingModels
                    ? 'Preparando sistema de reconhecimento facial...'
                    : 'Posicione seu rosto em frente à câmera para verificação'
                  }
                </p>
              </div>

              <div className="relative max-w-md mx-auto">
                {recognitionStarted && !recognitionFailed && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-64">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <div className="h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-2 bg-primary-500 rounded-full transition-all duration-200"
                          style={{ width: `${(recognitionAttempts / MAX_ATTEMPTS) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div className="relative max-w-md mx-auto bg-black rounded-lg overflow-hidden">
                  {isLoadingModels ? (
                    <div className="w-full h-[480px] bg-gray-800 animate-pulse flex items-center justify-center">
                      <div className="space-y-4 text-center">
                        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto animate-pulse" />
                        <div className="h-2 w-32 bg-gray-700 rounded mx-auto" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                        style={{ minHeight: '480px' }}
                      />
                      <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 w-full h-full"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                <Camera className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Pronto para Iniciar
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              QR Code lido com sucesso! Clique no botão abaixo para iniciar o reconhecimento facial.
            </p>
            <button
              onClick={handleStartRecognition}
              className="flex items-center justify-center space-x-2 w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Play size={20} />
              <span>Iniciar Reconhecimento Facial</span>
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <ShieldCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Presença Registrada!
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sua presença foi registrada com sucesso para a aula de {qrCodeData?.className}.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Voltar para o Dashboard
            </button>
          </div>
        </div>
      )}

      {recognitionFailed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Verificação Falhou
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Não foi possível verificar sua identidade. Certifique-se de que seu rosto está bem iluminado e posicionado corretamente.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setRecognitionFailed(false);
                  setRecognitionAttempts(0);
                  startFaceRecognition();
                }}
                className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => {
                  stopFaceRecognition();
                  setShowFaceRecognition(false);
                  setRecognitionFailed(false);
                  setRecognitionAttempts(0);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrarPresenca;