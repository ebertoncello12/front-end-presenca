
import api from '../services/api';
import CryptoJS from 'crypto-js';

interface QRCodeGenerateResponse {
  qrCode: string;
  expirationTime: number;
}

// Mock QR code data for development/demo
const generateMockQRCode = (classId: string, expirationMinutes: number) => {
  const data = {
    classId,
    className: 'Programação Web',
    professor: 'Dr. Silva',
    timestamp: new Date().toISOString()
  };

  const secretKey = 'mySecretKey';
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  
  // Create a mock QR code URL (in production this would be a real QR code)
  const mockQRCode = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==`;

  return {
    qrCode: mockQRCode,
    expirationTime: Date.now() + (expirationMinutes * 60 * 1000)
  };
};

class TeacherService {
  async generateQRCode(classId: string, expirationMinutes: number): Promise<QRCodeGenerateResponse> {
    try {
      const response = await api.post('/attendance/qrcode/generate', {
        classId,
        expirationMinutes
      });
      return response.data;
    } catch (error) {
      console.log('Using mock QR code data due to API error');
      return generateMockQRCode(classId, expirationMinutes);
    }
  }
}

export default new TeacherService();