import { useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const Dropzone = ({
  onChange,
  value,
  size = 'full',
  onDrop,
}: {
  onChange: (file: File | null) => void;
  value: File | null;
  size?: 'crop' | 'full';
  onDrop?: (files: File[]) => void;
}) => {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, acceptedFiles } =
    useDropzone({
      accept: { 'image/*': [] },
      maxFiles: 1,
      onDropAccepted: (files) => {
        if (onDrop) {
          onDrop(files);
        }
      },
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  useEffect(() => {
    if (acceptedFiles.length) {
      onChange(acceptedFiles[0]);
    }
  }, [acceptedFiles, onChange]);

  return (
    <div className="container" style={{ width: size === 'full' ? '100%' : '50%' }}>
      <div {...getRootProps({ style: style as React.CSSProperties })}>
        <input {...getInputProps()} />
        <p>Déposer ici</p>
        {value && <p>Fichier sélectionné : {value.name}</p>}
      </div>
    </div>
  );
};

export default Dropzone;
