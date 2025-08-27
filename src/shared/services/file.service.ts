import { Injectable } from '@angular/core';
import { remove, list, uploadData, downloadData } from '@aws-amplify/storage';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  bucketName = 'footballappdata';

  constructor() {
    console.log('start file service')
    // Amplify.configure({
    //   Storage: environment.s3, // e.g., { S3: { bucket: '...', region: '...' } }
    // });

  }

  /**
   * List top-level files/folders in your bucket
   */
  async listFiles(): Promise<any[]> {
    const { items } = await list({
      path: 'public/picks/'
    });
    return items;
  }

  /**
   * Get the content of a file as string
   */
// async getFileText(fileName: string): Promise<string> {
//   const result = await downloadData({ path: fileName }) as unknown as { body: Blob };
//   console.log({ content: result})
//   const arrayBuffer = await result.body.arrayBuffer();
//   return new TextDecoder('utf-8').decode(arrayBuffer);
// }

async getFileText(fileName: string): Promise<string> {
  const download = await downloadData({ path: fileName });
  // const data = (await download.result).body.text()
  const data = await (await download.result).body.text();
  return await data;
}

  /**
   * Upload a text file (string content)
   */
  async writeFile(name: string, content: string): Promise<boolean> {
    try {
      const blob = new Blob([content], { type: 'text/plain' });
      await uploadData({ path: name, data: blob });
      return true;
    } catch (err) {
      console.error('Upload failed:', err);
      return false;
    }
  }

    convertFileToString(data: any): string {
    const fileText = new TextDecoder('utf-8').decode(data.Body);
    return fileText;
  }

  async deleteFile(fileName: string): Promise<void> {
  try {
    await remove({ path: fileName });
  } catch (error) {
    console.error(`Error deleting file ${fileName}:`, error);
    throw error;
  }
}

/**
 * Deletes all files under a prefix except for the newest file.
 * 
 * @param pathPrefix The folder/prefix to search under (e.g. "public/picks/")
 * @param newestFile The filename (or full path) that should be kept
 */
async cleanupOldFiles(pathPrefix: string, newestFile: string): Promise<void> {
  try {
    // Get all files in the prefix
    const { items } = await list({ path: pathPrefix });

    // Iterate and delete everything except the newest file
    for (const item of items) {
      if (item.path !== newestFile) {
        console.log(`Deleting old file: ${item.path}`);
        await remove({ path: item.path });
      }
    }

    console.log('Cleanup complete.');
  } catch (error) {
    console.error('Error cleaning up files:', error);
    throw error;
  }
}


}
