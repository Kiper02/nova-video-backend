import {
  CompleteMultipartUploadCommand,
  CompleteMultipartUploadCommandInput,
  CreateMultipartUploadCommand,
  CreateMultipartUploadCommandInput,
  DeleteObjectCommand,
  type DeleteObjectCommandInput,
  HeadObjectCommand,
  HeadObjectCommandInput,
  PutObjectCommand,
  type PutObjectCommandInput,
  S3Client,
  UploadPartCommand,
  UploadPartCommandInput,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private readonly client: S3Client;
  private readonly bucket: string;

  public constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
      region: this.configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_KEY_SECRET'),
      },
    });
    this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
  }

  public async upload(buffer: Buffer, key: string, mimetype: string) {
    const command: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      Body: buffer,
      ContentType: mimetype,
    };

    try {
      await this.client.send(new PutObjectCommand(command));
    } catch (error) {
      throw error;
    }
  }

  public async initUpload(key: string, mimetype: string) {
    const initParams: CreateMultipartUploadCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      ContentType: mimetype
    };

    const initResult = await this.client.send(new CreateMultipartUploadCommand(initParams));
    return initResult;
  }

  public async completeUpload(key: string, uploadId: string, etags: string[]) {
    const completeParams: CompleteMultipartUploadCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      MultipartUpload: {
        Parts: etags.map((etag, index) => ({
          ETag: etag,
          PartNumber: index + 1
        }))
      },
      UploadId: uploadId
    };
  
    try {
      await this.client.send(new CompleteMultipartUploadCommand(completeParams));
    } catch (error) {
      throw error;
    }
  }
  
  public async getEtag(key: string, partNumber: number) {
    const headParams: HeadObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      PartNumber: partNumber,
    };
  
    try {
      const result = await this.client.send(new HeadObjectCommand(headParams));
      return result.ETag;
    } catch (error) {
      throw error;
    }
  }

  public async uploadChanks(key: string, partNumber: number, uploadId: string, buffer: Buffer) {
    const command: UploadPartCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
      PartNumber: partNumber,
      UploadId: uploadId,
      Body: buffer
    };

    try {
      await this.client.send(new UploadPartCommand(command));
    } catch (error) {
      throw error;
    }
  }

  public async remove(key: string) {
    const command: DeleteObjectCommandInput = {
      Bucket: this.bucket,
      Key: String(key),
    };

    try {
      await this.client.send(new DeleteObjectCommand(command));
    } catch (error) {
      throw error;
    }
  }
}
