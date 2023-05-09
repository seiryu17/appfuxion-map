export interface IRequestFetch {
  baseUrl: string;
  token?: string;
  service?: string;
  header?: { [key: string]: string };
  timeout?: number;
  handleUploadProgress?: (e: any) => void;
  handleDownloadProgress?: (e: any) => void;
}
