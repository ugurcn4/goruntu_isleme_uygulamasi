# Resim İşleme Uygulaması

Bu uygulama, kullanıcıların resim yükleyip çeşitli işlemler (boyutlandırma, döndürme, çevirme, kırpma) yapabilmesini sağlayan bir web uygulamasıdır.

## Proje Yapısı

Proje iki ana bölümden oluşmaktadır:

- **Frontend**: React kullanılarak oluşturulmuş kullanıcı arayüzü
- **Backend**: Python ve Flask kullanılarak oluşturulmuş API

## Gereksinimler

### Frontend

- Node.js ve npm
- React.js
- Axios

### Backend

- Python 3.6 veya üzeri
- Flask
- Flask-CORS
- Pillow (PIL)
- python-dotenv

## Kurulum

### Backend

1. Python bağımlılıklarını yükleyin:
```
cd backend
pip install -r requirements.txt
```

2. Backend sunucusunu başlatın:
```
python app.py
```

### Frontend

1. JavaScript bağımlılıklarını yükleyin:
```
cd frontend
npm install
```

2. Frontend geliştirme sunucusunu başlatın:
```
npm start
```

## Kullanım

1. Frontend uygulaması varsayılan olarak [http://localhost:3000](http://localhost:3000) adresinde çalışır
2. "Resim Seçin" butonu ile bilgisayarınızdan bir resim seçin
3. İstediğiniz işlemleri (boyutlandırma, döndürme, çevirme, kırpma) yapın
4. "Resmi İşle" butonuna tıklayın
5. İşlenmiş resmi görüntüleyin ve dilerseniz indirin

## Özellikler

- **Boyutlandırma**: Resmin genişlik ve yüksekliğini piksel cinsinden belirleyin
- **Döndürme**: Resmi 0-360 derece arasında döndürün
- **Çevirme**: Resmi yatay veya dikey olarak çevirin
- **Kırpma**: Resmi kenarlarından belirli piksel miktarında kırpın

## API Bilgileri

Backend API'si şu endpoint'i içerir:

- `POST /api/process-image`: Resim işleme isteği
  - multipart/form-data formatında istek gönderilmelidir
  - Parametreler:
    - `image`: İşlenecek resim dosyası
    - `width`: Genişlik (piksel)
    - `height`: Yükseklik (piksel)
    - `rotation`: Döndürme açısı (derece)
    - `flipHorizontal`: Yatay çevirme (true/false)
    - `flipVertical`: Dikey çevirme (true/false)
    - `cropLeft`: Sol kenardan kırpılacak piksel
    - `cropTop`: Üst kenardan kırpılacak piksel
    - `cropRight`: Sağ kenardan kırpılacak piksel
    - `cropBottom`: Alt kenardan kırpılacak piksel 
