import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import { convertVideo, deleteProcessedVideo, deleteRawVideo, downloadRawVideo, setupDirectories, uploadProcessedVideo } from './storage';
import { upload } from '@google-cloud/storage/build/cjs/src/resumable-upload';

setupDirectories();

const app = express();
app.use(express.json());

app.post('/process-video', async (req, res) => {
    let data;
    try{
      const message = Buffer.from(req.body.message.data, 'base64').toString();
      data = JSON.parse(message);
      if(!data.fileName){
        throw new Error('fileName is required');
      }
    } catch (error){
      console.error(error);
      return res.status(400).send('Invalid request missing fileName');
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    await downloadRawVideo(inputFileName);
    
    try{
      await convertVideo(inputFileName, outputFileName)
    }catch (err){
      await Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
      ]);
      console.error(err);
      return res.status(500).send('Failed to process video');
    }

    uploadProcessedVideo(outputFileName);
    await Promise.all([
      deleteRawVideo(inputFileName),
      deleteProcessedVideo(outputFileName)
    ]);

    return res.status(200).send('Video processed successfully');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
