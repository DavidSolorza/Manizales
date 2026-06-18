export interface IImageStorageService {
  upload(file: { buffer: Buffer; originalname: string }): Promise<string>
  delete(url: string): Promise<void>
}
