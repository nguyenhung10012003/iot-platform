import { Icons } from '@repo/ui/components/icons/icons';
import { Input } from '@repo/ui/components/ui/input';
import { useDragDrop } from '../../../packages/ui/src/hooks/use-drag-drop';

type UploadFileAreaProps = {
  value: File | null;
  onChange: (file: File) => void;
  onDrop: (file: File) => void;
  accept?: string;
};

export default function UploadFileArea({
  value,
  onChange,
  onDrop,
  accept
}: UploadFileAreaProps) {
  const [{ dragActive }, { handleDrag, handleDrop }] = useDragDrop(onDrop);
  return (
    <label htmlFor="dropzone-file">
      <div
        className={`flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-lg cursor-pointer ${
          dragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 bg-gray-50'
        } hover:bg-gray-100`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center">
          <Icons.upload
            className="w-10 h-10 mb-3 text-gray-400"
            aria-hidden="true"
          />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
        </div>
        <Input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept={accept}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              onChange(file);
            }
          }}
        />
        {value && (
          <div className="text-sm text-gray-500">
            Selected file: {value.name}
          </div>
        )}
      </div>
    </label>
  );
}
