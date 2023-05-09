export default interface IConfig {
  baseURL: string;
  timeout?: number;
  retryAttemp?: number;
  retyrInterval?: number;
  customHeader?: Headers;
  onUploadProgress?: (e: any) => void;
  onDownloadProgress?: (e: any) => void;
}
