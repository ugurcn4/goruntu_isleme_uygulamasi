from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from PIL import Image
import io
import os
import uuid

app = Flask(__name__)
CORS(app)  # Cross-Origin Resource Sharing etkinleştirme

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/api/process-image', methods=['POST'])
def process_image():
    # POST isteğinden dosyayı alma
    if 'image' not in request.files:
        return jsonify({'error': 'Resim yüklenmedi'}), 400
    
    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'Dosya seçilmedi'}), 400
    
    # Görüntü işleme parametrelerini al
    width = int(request.form.get('width', 0))
    height = int(request.form.get('height', 0))
    rotation = int(request.form.get('rotation', 0))
    flip_horizontal = request.form.get('flipHorizontal') == 'true'
    flip_vertical = request.form.get('flipVertical') == 'true'
    crop_left = int(request.form.get('cropLeft', 0))
    crop_top = int(request.form.get('cropTop', 0))
    crop_right = int(request.form.get('cropRight', 0))
    crop_bottom = int(request.form.get('cropBottom', 0))
    
    try:
        # PIL ile görüntüyü aç
        img = Image.open(image_file)
        
        # Kırpma işlemi
        if crop_left or crop_top or crop_right or crop_bottom:
            # Kırpma işlemi için resmin boyutlarını al
            img_width, img_height = img.size
            
            # Kırpma koordinatlarını hesapla
            right = img_width - crop_right if crop_right > 0 else img_width
            bottom = img_height - crop_bottom if crop_bottom > 0 else img_height
            
            # Kırpma işlemini uygula
            img = img.crop((crop_left, crop_top, right, bottom))
        
        # Boyutlandırma işlemi
        if width > 0 and height > 0:
            img = img.resize((width, height), Image.LANCZOS)
        
        # Döndürme işlemi
        if rotation != 0:
            img = img.rotate(rotation, expand=True)
        
        # Çevirme işlemleri
        if flip_horizontal:
            img = img.transpose(Image.FLIP_LEFT_RIGHT)
        if flip_vertical:
            img = img.transpose(Image.FLIP_TOP_BOTTOM)
        
        # İşlenmiş görüntüyü byte olarak kaydet
        img_byte_arr = io.BytesIO()
        img.save(img_byte_arr, format=img.format if img.format else 'JPEG')
        img_byte_arr.seek(0)
        
        # Benzersiz dosya adı oluştur
        filename = f"{uuid.uuid4()}.jpg"
        save_path = os.path.join(UPLOAD_FOLDER, filename)
        
        # Dosyayı kaydet
        img.save(save_path)
        
        # İşlenmiş resmi gönder
        return send_file(img_byte_arr, mimetype='image/jpeg')
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) 