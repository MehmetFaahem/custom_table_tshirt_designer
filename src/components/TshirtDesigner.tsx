import React, { useState, useRef, useCallback } from 'react';
import Draggable from 'react-draggable';
import html2canvas from 'html2canvas';
import '../styles/TshirtDesigner.css';
import TshirtMockup from '../assets/t-shirt.jpg';

const TshirtDesigner: React.FC = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState({ width: 100, height: 100 });
  const [logoPosition, setLogoPosition] = useState({ x: 200, y: 200 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tshirtContainerRef = useRef<HTMLDivElement>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      loadImage(file);
    }
  };

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setLogo(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleResize = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSize = parseInt(e.target.value);
    setLogoSize({
      width: newSize,
      height: newSize * (logoSize.height / logoSize.width),
    });
  };

  const handleDragStop = (e: any, data: { x: number; y: number }) => {
    setLogoPosition({ x: data.x, y: data.y });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      loadImage(files[0]);
      
      if (tshirtContainerRef.current) {
        const rect = tshirtContainerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - (logoSize.width / 2);
        const y = e.clientY - rect.top - (logoSize.height / 2);
        setLogoPosition({ 
          x: Math.max(0, Math.min(x, rect.width - logoSize.width)),
          y: Math.max(0, Math.min(y, rect.height - logoSize.height))
        });
      }
    }
  };

  const downloadDesign = useCallback(() => {
    const container = tshirtContainerRef.current;
    if (!container) return;

    html2canvas(container, {
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      scale: 2, // Increase quality
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'tshirt-design.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  }, []);

  return (
    <div className="tshirt-designer">
      <div 
        className="tshirt-container" 
        ref={tshirtContainerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <img 
          src={TshirtMockup}
          alt="T-shirt template" 
          className="tshirt-image" 
        />
        
        {logo && (
          <Draggable 
            bounds="parent"
            position={logoPosition}
            onStop={handleDragStop}
            defaultPosition={{ x: 200, y: 200 }}
          >
            <div className="logo-container">
              <img
                src={logo}
                alt="Uploaded logo"
                className="logo-image"
                style={{
                  width: `${logoSize.width}px`,
                  height: `${logoSize.height}px`,
                }}
              />
            </div>
          </Draggable>
        )}
      </div>

      <div className="controls">
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoUpload}
          ref={fileInputRef}
          className="file-input"
        />
        
        {logo && (
          <>
            <div className="size-control">
              <label>Logo Size:</label>
              <input
                type="range"
                min="50"
                max="200"
                value={logoSize.width}
                onChange={handleResize}
              />
            </div>
            <button 
              className="download-button"
              onClick={downloadDesign}
            >
              Download Design
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TshirtDesigner; 