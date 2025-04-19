import { Button } from '@repo/ui/components/ui/button';
import jsQR from 'jsqr';
import { Upload } from 'lucide-react';
import React, { useRef, useState } from 'react';

interface QRCodeUploaderProps {
  onResult?: (result: string) => void;
}

const QRCodeUploader: React.FC<QRCodeUploaderProps> = ({ onResult }) => {
  const [qrData, setQrData] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = (file?: File): void => {
    if (!file) {
      setError('Không có file được tải lên');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      img.onload = () => {
        // Tạo canvas để xử lý ảnh
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          setError('Không thể tạo context canvas');
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0);

        // Lấy dữ liệu ảnh
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height,
        );

        // Quét mã QR từ dữ liệu ảnh
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrData(code.data);
          if (onResult) {
            onResult(code.data);
          }
          setError('');
        } else {
          setError('Không tìm thấy mã QR trong ảnh');
        }
      };

      if (event.target && event.target.result) {
        img.src = event.target.result as string;
      }
    };

    reader.onerror = () => {
      setError('Có lỗi khi đọc file');
    };

    reader.readAsDataURL(file);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    processImage(files[0]);
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Tải lên mã QR
      </h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        ref={fileInputRef}
        className="hidden"
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        className=""
        variant="outline"
      >
        <Upload className="w-4 h-4 mr-2" />
        Chọn ảnh chứa mã QR
      </Button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg w-full text-center">
          {error}
        </div>
      )}

    </div>
  );
};

export default QRCodeUploader;
