/**
 * Analytics Service for UIU Note Share
 * Supports Google Analytics 4 (GA4) and custom user interaction tracking
 */

// Extend window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const STORAGE_KEY_GA_ID = 'uiu_ga_measurement_id';

class AnalyticsService {
  private gaId: string | null = null;
  private isInitialized = false;

  constructor() {
    const metaEnv = (import.meta as any).env || {};
    const envGaId = metaEnv.VITE_GA_MEASUREMENT_ID || metaEnv.VITE_GA_ID;
    const storedGaId = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_GA_ID) : null;
    this.gaId = storedGaId || envGaId || null;

    if (this.gaId) {
      this.initGoogleAnalytics(this.gaId);
    }
  }

  /**
   * Initialize Google Analytics 4 script dynamically
   */
  public initGoogleAnalytics(measurementId: string): void {
    if (!measurementId || measurementId.trim() === '' || this.isInitialized) return;
    this.gaId = measurementId.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_GA_ID, this.gaId);
    }

    try {
      if (typeof document === 'undefined') return;
      const existingScript = document.getElementById('ga-gtag-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'ga-gtag-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        function gtag(...args: any[]) {
          window.dataLayer.push(args);
        }
        window.gtag = gtag;

        gtag('js', new Date());
        gtag('config', this.gaId, {
          send_page_view: true,
          anonymize_ip: true
        });

        this.isInitialized = true;
      }
    } catch (err) {
      console.warn('Analytics initialization skipped:', err);
    }
  }

  /**
   * Track Page View
   */
  public trackPageView(path: string, title?: string): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function' && this.gaId) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title || (typeof document !== 'undefined' ? document.title : '')
      });
    }
  }

  /**
   * Track Custom Interaction Events (e.g. Download, Search, Filter)
   */
  public trackEvent(action: string, category: string, label?: string, value?: number): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function' && this.gaId) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  }

  public getMeasurementId(): string | null {
    return this.gaId;
  }

  public setMeasurementId(id: string): void {
    this.gaId = id.trim();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_GA_ID, this.gaId);
    }
    this.isInitialized = false;
    this.initGoogleAnalytics(this.gaId);
  }
}

export const analytics = new AnalyticsService();
