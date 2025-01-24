import pickle
from flask import Flask, request, jsonify
import tensorflow as tf
import numpy as np
from PIL import Image

# Tạo ứng dụng Flask
app = Flask(__name__)

# Tải mô hình từ tệp model.pkl
with open('model.pkl', 'rb') as f:
    model = pickle.load(f)


# Định nghĩa endpoint để nhận dữ liệu và dự đoán
@app.route('/predict', methods=['POST'])
def predict():
    # Lấy dữ liệu từ request
    input_data = request.get_json()
    # print(input_data['Air humidity (%)'])

    # Chuyển dữ liệu đầu vào thành định dạng thích hợp (ví dụ: numpy array)
    # input_data = np.array(input_data)
    # print(input_data)

    # Dùng input_data['feature1'], input_data['feature2'], ... để truy cập dữ liệu
    data = [input_data['soilMoisture'], input_data['temperature'], input_data['wind'],
            input_data['humidity'], input_data['rainfall']]

    # print(data)

    # Dự đoán với mô hình
    prediction = model.predict([data])
    # print(prediction)

    # Trả kết quả về JSON
    return jsonify({'prediction': str(prediction[0])})


MODEL_PATH = 'model.h5'  # Đường dẫn tới file model.h5
INPUT_SHAPE = (224, 224)

# Load model
modelTF = tf.keras.models.load_model(MODEL_PATH)

# Label bệnh của cây
LABELS = {
    0: "Cassava Bacterial Blight (CBB)",
    1: "Cassava Brown Streak Disease (CBSD)",
    2: "Cassava Green Mottle (CGM)",
    3: "Cassava Mosaic Disease (CMD)",
    4: "Healthy"
}

def preprocess_image(image_file):
    """
    Preprocess the image file for model prediction
    """

    # Mở file ảnh và resize về đúng định dạng
    image = Image.open(image_file)
    image = image.resize(INPUT_SHAPE)
    
    # Chuyển ảnh sang mảng và chuẩn hóa
    img_array = tf.keras.preprocessing.image.img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    
    return img_array

@app.route('/detect', methods=['POST'])
def detect():
    try:
        # Kiểm tra header Content-Type
        if 'multipart/form-data' not in request.content_type:
            return jsonify({'error': 'Content-Type must include multipart/form-data'}), 400
        
        # Kiểm tra nếu file ảnh có trong request
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
            
        image_file = request.files['image']
        
        # Kiểm tra nếu không có file được chọn
        if image_file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Xử lý file ảnh
        processed_image = preprocess_image(image_file)
        
        # Dự đoán bệnh
        predictions = modelTF.predict(processed_image)
        predicted_class = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][predicted_class])
        
        # Chuẩn bị response trả về
        response = {
            'prediction': {
                'id': predicted_class,
                'name': LABELS[predicted_class],
                'confidence': confidence,
                'probabilities': {
                    LABELS[i]: float(prob) 
                    for i, prob in enumerate(predictions[0])
                }
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '_main_':
    app.run(debug=True)
