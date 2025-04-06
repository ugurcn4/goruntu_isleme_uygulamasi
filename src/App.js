import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import {
  FaImage,
  FaArrowsAlt,
  FaCrop,
  FaUndo,
  FaUpload,
  FaCheck,
  FaExclamationTriangle,
  FaDownload,
  FaSync
} from 'react-icons/fa';

function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [processedImageUrl, setProcessedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Resim işleme ayarları
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [rotation, setRotation] = useState(0);
  const [flipHorizontal, setFlipHorizontal] = useState(false);
  const [flipVertical, setFlipVertical] = useState(false);
  const [cropLeft, setCropLeft] = useState(0);
  const [cropTop, setCropTop] = useState(0);
  const [cropRight, setCropRight] = useState(0);
  const [cropBottom, setCropBottom] = useState(0);

  // Dosya seçme işlemi
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Ön izleme URL'sini oluştur
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(selectedFile);

      // İşlenmiş görüntü URL'sini sıfırla
      setProcessedImageUrl('');
    }
  };

  // Form gönderme işlemi
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Lütfen bir resim seçin');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      // İşleme ayarlarını ekle
      if (width) formData.append('width', width);
      if (height) formData.append('height', height);
      formData.append('rotation', rotation);
      formData.append('flipHorizontal', flipHorizontal);
      formData.append('flipVertical', flipVertical);
      formData.append('cropLeft', cropLeft);
      formData.append('cropTop', cropTop);
      formData.append('cropRight', cropRight);
      formData.append('cropBottom', cropBottom);

      const response = await axios.post('http://localhost:5000/api/process-image', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Blob URL oluştur
      const imageUrl = URL.createObjectURL(response.data);
      setProcessedImageUrl(imageUrl);

    } catch (err) {
      console.error('Resim işleme hatası:', err);
      setError('Resim işlenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1><FaImage style={{ marginRight: '10px' }} /> Resim İşleme Uygulaması</h1>
      </header>

      <main className="container">
        <div className="row">
          <div className="col">
            <form onSubmit={handleSubmit}>
              <div className="upload-container">
                <label htmlFor="imageUpload" className="upload-label">
                  <div className="upload-icon">
                    <FaUpload size={36} />
                    <span>Resim Seçin</span>
                  </div>
                  <input
                    type="file"
                    id="imageUpload"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="upload-input"
                  />
                </label>
                {file && <div className="file-name">{file.name}</div>}
              </div>

              {previewUrl && (
                <div className="preview-container mb-3">
                  <h3><FaImage style={{ marginRight: '8px' }} /> Seçilen Resim</h3>
                  <img src={previewUrl} alt="Önizleme" className="img-preview" />
                </div>
              )}

              <div className="card mb-3">
                <div className="card-header">
                  <h3><FaArrowsAlt style={{ marginRight: '8px' }} /> Boyut Ayarları</h3>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <label htmlFor="width">Genişlik (px)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="width"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        min="0"
                        placeholder="Orijinal genişlik"
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="height">Yükseklik (px)</label>
                      <input
                        type="number"
                        className="form-control"
                        id="height"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        min="0"
                        placeholder="Orijinal yükseklik"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-3">
                <div className="card-header">
                  <h3><FaUndo style={{ marginRight: '8px' }} /> Döndürme ve Çevirme</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="rotation">Döndürme Açısı (derece)</label>
                    <div className="rotation-container">
                      <input
                        type="range"
                        className="form-range"
                        id="rotation"
                        min="0"
                        max="360"
                        value={rotation}
                        onChange={(e) => setRotation(parseInt(e.target.value))}
                      />
                      <div className="rotation-value">
                        <div className="rotation-circle" style={{ transform: `rotate(${rotation}deg)` }}>
                          <FaUndo />
                        </div>
                        <span>{rotation}°</span>
                      </div>
                    </div>
                  </div>

                  <div className="flip-buttons">
                    <button
                      type="button"
                      className={`flip-button ${flipHorizontal ? 'active' : ''}`}
                      onClick={() => setFlipHorizontal(!flipHorizontal)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3H3V9H5V5H9V3Z" fill="currentColor" />
                        <path d="M3 15V21H9V19H5V15H3Z" fill="currentColor" />
                        <path d="M19 3H15V5H19V9H21V3H19Z" fill="currentColor" />
                        <path d="M19 19H15V21H21V15H19V19Z" fill="currentColor" />
                        <path d="M12 5V19" stroke="currentColor" strokeWidth="2" />
                        <path d="M8 12L16 12" stroke="currentColor" strokeWidth="2" />
                      </svg>
                      Yatay Çevir
                    </button>

                    <button
                      type="button"
                      className={`flip-button ${flipVertical ? 'active' : ''}`}
                      onClick={() => setFlipVertical(!flipVertical)}
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 3H3V9H5V5H9V3Z" fill="currentColor" />
                        <path d="M3 15V21H9V19H5V15H3Z" fill="currentColor" />
                        <path d="M19 3H15V5H19V9H21V3H19Z" fill="currentColor" />
                        <path d="M19 19H15V21H21V15H19V19Z" fill="currentColor" />
                        <path d="M12 19L12 5" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 8L12 16" stroke="currentColor" strokeWidth="2" transform="rotate(90 12 12)" />
                      </svg>
                      Dikey Çevir
                    </button>
                  </div>
                </div>
              </div>

              <div className="card mb-3">
                <div className="card-header">
                  <h3><FaCrop style={{ marginRight: '8px' }} /> Kırpma Ayarları</h3>
                </div>
                <div className="card-body">
                  <div className="crop-container">
                    <div className="crop-row">
                      <div className="crop-blank"></div>
                      <div className="crop-input-wrapper">
                        <label>Üst Kenar (px)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={cropTop}
                          onChange={(e) => setCropTop(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="crop-blank"></div>
                    </div>

                    <div className="crop-row">
                      <div className="crop-input-wrapper">
                        <label>Sol Kenar (px)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={cropLeft}
                          onChange={(e) => setCropLeft(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="crop-image">
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="5" y="5" width="90" height="90" stroke="currentColor" strokeWidth="2" />
                          <rect x="20" y="20" width="60" height="60" fill="rgba(74, 108, 250, 0.2)" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                        </svg>
                      </div>
                      <div className="crop-input-wrapper">
                        <label>Sağ Kenar (px)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={cropRight}
                          onChange={(e) => setCropRight(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                    </div>

                    <div className="crop-row">
                      <div className="crop-blank"></div>
                      <div className="crop-input-wrapper">
                        <label>Alt Kenar (px)</label>
                        <input
                          type="number"
                          className="form-control"
                          value={cropBottom}
                          onChange={(e) => setCropBottom(parseInt(e.target.value) || 0)}
                          min="0"
                        />
                      </div>
                      <div className="crop-blank"></div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg mb-3"
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <FaSync className="spin-icon" /> İşleniyor...
                  </>
                ) : (
                  <>
                    <FaCheck /> Resmi İşle
                  </>
                )}
              </button>

              {error && (
                <div className="alert alert-danger">
                  <FaExclamationTriangle style={{ marginRight: '8px' }} />
                  {error}
                </div>
              )}
            </form>
          </div>

          {
            processedImageUrl && (
              <div className="col processed-image-container">
                <h3><FaImage style={{ marginRight: '8px' }} /> İşlenmiş Resim</h3>
                <img
                  src={processedImageUrl}
                  alt="İşlenmiş resim"
                  className="img-processed"
                />
                <a
                  href={processedImageUrl}
                  download="processed-image.jpg"
                  className="btn btn-success mt-3"
                >
                  <FaDownload style={{ marginRight: '8px' }} /> İndir
                </a>
              </div>
            )
          }
        </div >
      </main >

      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Resim İşleme Uygulaması</p>
      </footer>
    </div >
  );
}

export default App;
