import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

function Resize() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [downloadLink, setDownloadLink] = useState(null);
  const [lockRatio, setLockRatio] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [imageName, setImageName] = useState('');
  const [compressedSize, setCompressedSize] = useState(null);
  const [desiredMB, setDesiredMB] = useState('');

  const handleResize = () => {  
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const resizedImage = canvas.toDataURL('image/png');
      setPreview(resizedImage);
      setDownloadLink(resizedImage);
    };
  };

  const handleCompress = () => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width || img.width;
      canvas.height = height || img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      let quality = 0.9;
      let compressedImage = canvas.toDataURL('image/jpeg', quality);
      let sizeInBytes = compressedImage.length * 0.75;
      const targetBytes = parseFloat(desiredMB) * 1024 * 1024;

      while (sizeInBytes > targetBytes && quality > 0.1) {
        quality -= 0.05;
        compressedImage = canvas.toDataURL('image/jpeg', quality);
        sizeInBytes = compressedImage.length * 0.75;
      }

      setPreview(compressedImage);
      setDownloadLink(compressedImage);
      setCompressedSize((sizeInBytes / (1024 * 1024)).toFixed(2));
    };
  };

  const setStandardSize = (w, h) => {
    setWidth(w);
    setHeight(h);
  };

  const handleWidthChange = (e) => {
    const w = e.target.value;
    setWidth(w);
    if (lockRatio && height) {
      setHeight(Math.round(w / aspectRatio));
    }
  };

  const handleHeightChange = (e) => {
    const h = e.target.value;
    setHeight(h);
    if (lockRatio && width) {
      setWidth(Math.round(h * aspectRatio));
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const imgData = e.target.result;
        setImage(imgData);
        setPreview(imgData);
        setImageName(file.name);
        const img = new Image();
        img.onload = () => setAspectRatio(img.width / img.height);
        img.src = imgData;
      };
      reader.readAsDataURL(file);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-200 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold mb-4 text-purple-700">Smart Image Resizer</h1>
      <p className="mb-6 text-gray-600">Resize your PAN card, Aadhar, and other document images easily!</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { title: 'PAN Card', w: 213, h: 337 },
          { title: 'Aadhar Card', w: 300, h: 400 },
          { title: 'Passport Photo', w: 600, h: 600 },
          { title: 'Landscape', w: 800, h: 600 },
        ].map((item) => (
          <div
            key={item.title}
            onClick={() => setStandardSize(item.w, item.h)}
            className="cursor-pointer bg-white shadow hover:shadow-lg p-4 rounded-xl text-center border hover:border-indigo-400"
          >
            <div className="text-xl font-semibold text-indigo-600">{item.title}</div>
            <div className="text-sm text-gray-500">{item.w}×{item.h}px</div>
          </div>
        ))}
      </div>

      <div className="bg-white shadow-xl rounded-xl p-6 w-full max-w-2xl">
        <div {...getRootProps()} className="border-2 border-dashed p-6 text-center bg-gray-100 rounded-lg cursor-pointer mb-4">
          <input {...getInputProps()} />
          <p className="text-gray-500">Drag and drop an image here, or click to upload</p>
        </div>

        {imageName && (
          <p className="text-gray-700 mb-2 text-center">Uploaded: <strong>{imageName}</strong></p>
        )}

        {image && !downloadLink && (
          <p className="text-yellow-600 mb-4 text-center">Click the Resize Image button to see resized preview.</p>
        )}

        <div className="flex gap-4 mb-4">
          <input
            type="number"
            placeholder="Width"
            value={width}
            onChange={handleWidthChange}
            className="w-1/2 p-3 rounded-lg border bg-gray-50"
          />
          <input
            type="number"
            placeholder="Height"
            value={height}
            onChange={handleHeightChange}
            className="w-1/2 p-3 rounded-lg border bg-gray-50"
          />
        </div>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={lockRatio}
            onChange={() => setLockRatio(!lockRatio)}
          />
          <span className="text-gray-700">Lock Aspect Ratio</span>
        </label>

        <button
          onClick={handleResize}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 mb-4"
        >
          Resize Image
        </button>

        <div className="flex gap-2 items-center mb-4">
          <input
            type="number"
            placeholder="Desired Size (MB)"
            value={desiredMB}
            onChange={(e) => setDesiredMB(e.target.value)}
            className="w-full p-3 rounded-lg border bg-gray-50"
          />
          <button
            onClick={handleCompress}
            className="bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600"
          >
            Compress
          </button>
        </div>
      </div>

      {preview && downloadLink && (
        <div className="mt-10 bg-white p-6 shadow-xl rounded-lg max-w-2xl w-full text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Preview</h2>
          <img src={preview} alt="Resized Preview" className="mx-auto rounded-lg shadow-md max-h-[400px]" />
          {compressedSize && (
            <p className="text-sm text-gray-600 mt-2">Estimated Size: {compressedSize} MB</p>
          )}
          <a
            href={downloadLink}
            download="resized-image.jpg"
            className="inline-block mt-4 bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
          >
            Download Resized Image
          </a>
        </div>
      )}

      <footer className="mt-16 text-sm text-gray-500 max-w-4xl mx-auto text-center px-4">
        <p>
          Smart Image Resizer helps you quickly resize PAN card photos, Aadhar card images, and passport-size pictures online.
          Ideal for Indian document uploads and government form requirements.
        </p>
        <p className="mt-2">
          100% free, secure, and easy to use. No signup required.
        </p>
      </footer>
    </div>
  );
}

export default Resize;