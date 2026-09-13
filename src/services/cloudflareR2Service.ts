import { CloudflareR2Config } from '../types';

export const CloudflareR2Service = {
  getConfig(): CloudflareR2Config | null {
    const raw = localStorage.getItem('uiu_r2_config_v1');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  saveConfig(config: CloudflareR2Config): void {
    localStorage.setItem('uiu_r2_config_v1', JSON.stringify(config));
  },

  /**
   * Helper to format a file URL from R2 public bucket domain
   */
  formatR2Url(filename: string): string {
    const config = this.getConfig();
    if (!config || !config.publicDomain) {
      return filename;
    }
    const cleanDomain = config.publicDomain.replace(/\/+$/, '');
    const cleanFile = filename.replace(/^\/+/, '');
    return `${cleanDomain}/${cleanFile}`;
  },

  /**
   * Generates sample presigned curl / instructions for R2 direct upload
   */
  getUploadInstructions(filename: string): string {
    const config = this.getConfig();
    if (!config) {
      return 'Cloudflare R2 is not yet configured. Please add your credentials in Admin Settings.';
    }
    return `Upload to bucket: ${config.bucketName}\nPublic URL will be: ${this.formatR2Url(filename)}`;
  }
};
