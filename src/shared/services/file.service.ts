import { Injectable } from '@angular/core';
import { Amplify, Storage } from 'aws-amplify';
import { SESV2 } from 'aws-sdk';
import { resourceLimits } from 'worker_threads';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  s3: any;
  bucketName = 'footballappdata';

  constructor() {
    Amplify.configure({
      Storage: environment.s3,
    });

    this.configure();
  }

  configure(): void {
    const AWSService = require('aws-sdk');
    AWSService.config.update({
      region: 'us-west-2',
      credentials: new AWSService.CognitoIdentityCredentials({
        IdentityPoolId: 'us-west-2:38573e23-157a-4097-bd61-42a89029b8ce' // '38573e23-157a-4097-bd61-42a89029b8ce'
      })
    });
    this.s3 = new AWSService.S3({
      apiVersion: '2006-03-01',
      params: { Bucket: this.bucketName}
    });
  }

  // listFiles(folderName: string): Promise<any> {
  //   return Storage.list(folderName);
  // }

  listFiles(): any{
    const params = {
      Bucket: this.bucketName,
      Delimiter: '/'
     // Prefix: 's/5469b2f5b4292d22522e84e0/ms.files/'
     };

    // tslint:disable-next-line:typedef
    this.s3.listObjects(params, (err, data) => {
        if (err) {
          console.log('List Files Error', err);
        } else {
          console.log('List Files Success', data);
          return data;
        }
      });

  }

  getFileText(fileName: string): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: fileName
    };
    return this.s3.getObject(params).promise();

    // this.s3.getObject(params, function(err, data) {
    //   if (err) {
    //     console.error(err); // an error occurred
    //     return 'no data';
    //   } else {
    //     // tslint:disable-next-line:variable-name

    //   }
    // });
  }

  convertFileToString(data: any): string {
    const fileText = new TextDecoder('utf-8').decode(data.Body);
    console.log(fileText);
    return fileText;
  }

  writeFile(email: string, content: string): void {

  }
}
