import React, { useState } from 'react';
import { QrReader } from 'react-qr-reader';
import useDebounce from '../hooks/useDebounce';
import QRCodeUploader from './QrCodeUploader';

interface QrScannerProps {
  onResult?: (result: string) => void;
}

const QRScanner: React.FC<QrScannerProps> = ({ onResult }) => {
  const [error, setError] = useState<string>('');
  const errorDebounce = useDebounce(error, 5000);

  const handleScan = (result: any) => {
    if (result) {
      const scannedData = result.text;
      if (onResult) {
        onResult(scannedData);
      }
      setError('');
    }
  };

  const handleError = (err: any) => {
    if (errorDebounce) return;
    setError('Có lỗi khi quét mã QR');
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quét mã QR</h2>

      <div className="w-[300px] mb-6 rounded-lg overflow-hidden border-4 border-blue-500">
        <QrReader
          constraints={{ facingMode: 'environment' }}
          onResult={(result, error) => {
            if (!!result) {
              handleScan(result);
            }

            if (!!error) {
              handleError(error);
            }
          }}
        />
      </div>

      <div className="flex items-center justify-center w-full mb-6">
        <div className="h-px bg-gray-300 flex-1"></div>
        <span className="px-4 text-gray-500 font-medium">Hoặc</span>
        <div className="h-px bg-gray-300 flex-1"></div>
      </div>

      <QRCodeUploader
        onResult={(result) => {
          if (onResult) {
            onResult(result);
            setError('');
          }
        }}
      />

      {errorDebounce && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {errorDebounce}
        </div>
      )}
    </div>
  );
};

export default QRScanner;
