'use client';

import { Button } from '@repo/ui/components/ui/button';
import { Separator } from '@repo/ui/components/ui/separator';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '../../config/api';
import UploadFileArea from '../UploadFileArea';

export default function DeseaseDetect() {
  const { id: locationId } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [detecting, setDetecting] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);

  const handleDetect = async () => {
    setDetecting(true);
    const formData = new FormData();
    formData.append('image', file as File);
    try {
      const response = await api.post<{ result: string }, any>(
        `/pets-predict?locationId=${locationId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setResult(response.result);
    } catch (error) {
      console.error(error);
    }
    setDetecting(false);
  };

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [file]);
  return (
    <div className="flex flex-row gap-4 w-full">
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-xl font-semibold">Disease Detection</h2>
        <UploadFileArea value={file} onChange={setFile} onDrop={setFile} />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover"
          />
        )}
        {file && <Button onClick={handleDetect}>Detect</Button>}
      </div>
      <Separator orientation="vertical" className="flex h-auto" />
      <div className="flex w-full flex-col gap-4">
        <h2 className="text-xl font-semibold">Result</h2>
        <div className="flex items-center">
          {detecting && <p>Detecting...</p>}
          {result && (
            <p className="flex gap-2 items-center">
              {result === 'Healthy' ? (
                <span className="bg-green-500 rounded-full w-4 h-4"></span>
              ) : (
                <span className="bg-red-500 rounded-full w-4 h-4"></span>
              )}
              {result}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
