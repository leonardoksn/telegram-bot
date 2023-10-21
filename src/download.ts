import fs from 'fs';
import ytdl from 'ytdl-core';
export class DownloadVideo {
  async video(url: string) {
    return new Promise<{ path: string; name: string, thumb: any, author: string }>((resolve, reject) => {
      const videoId = url
      // Get video info from YouTube
      ytdl.getInfo(videoId).then((info) => {

        // Select the video format and quality
        const format = ytdl.chooseFormat(info.formats, { filter: "audioonly" });
        // Create a write stream to save the video file
        const outputFilePath = `./src/${info.videoDetails.title}.mp4`;
        const outputStream = fs.createWriteStream(outputFilePath);
        // Download the video file
        ytdl.downloadFromInfo(info, { format: format, filter: "audioonly" }).pipe(outputStream);
        // When the download is complete, show a message
        outputStream.on('finish', () => {
          return resolve({
            path: outputFilePath,
            name: info.videoDetails.title,
            thumb: info.videoDetails.thumbnails[0],
            author: info.videoDetails.author.name,
            // duration : info.videoDetails.lengthSeconds
          })
        });
      }).catch((err) => {
        reject(err)
      });
    })

  }
}