import pickle
from flask import Flask, request, jsonify

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


if __name__ == '_main_':
    app.run(debug=True)
