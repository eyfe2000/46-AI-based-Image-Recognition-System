const express = require('express');
const bodyParser = require('body-parser');
const { createReadStream } = require('fs');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();
const port = 3000;

// 使用body-parser中间件解析POST请求的JSON数据
app.use(bodyParser.json());

// 设置Google Cloud Vision API凭证
const visionClient = new ImageAnnotatorClient({
  keyFilename: 'path-to-your-google-cloud-credentials.json',
});

// 处理图像识别和分类请求
app.post('/identify-objects', async (req, res) => {
  const { imageUrl } = req.body;

  try {
    const [result] = await visionClient.objectLocalization(createReadStream(imageUrl));

    if (result.localizedObjectAnnotations && result.localizedObjectAnnotations.length > 0) {
      const objects = result.localizedObjectAnnotations.map((obj) => obj.name);
      res.json({ objects });
    } else {
      res.status(404).json({ message: 'No objects found in the image' });
    }
  } catch (error) {
    console.error(`Error identifying objects: ${error.message}`);
    res.status(500).json({ message: 'Object identification failed' });
  }
});

// 启动Express应用程序
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
