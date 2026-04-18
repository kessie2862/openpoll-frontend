import { WSMessage, PollResults } from '../types';

type ResultsHandler = (results: PollResults) => void;
type StatusHandler = (connected: boolean) => void;

export class PollWebSocket {
  private ws: WebSocket | null = null;
  private shortId: string;
  private onResults: ResultsHandler;
  private onStatus: StatusHandler;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private destroyed = false;

  constructor(
    shortId: string,
    onResults: ResultsHandler,
    onStatus: StatusHandler,
  ) {
    this.shortId = shortId;
    this.onResults = onResults;
    this.onStatus = onStatus;
    this.connect();
  }

  private connect() {
    if (this.destroyed) return;

    const wsBase = process.env.NEXT_PUBLIC_WS_URL;
    const url = `${wsBase}/ws/polls/${this.shortId}/`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.onStatus(true);
      this.startPing();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const message: WSMessage = JSON.parse(event.data);
        if (
          message.type === 'initial_results' ||
          message.type === 'results_updated'
        ) {
          if (message.payload) this.onResults(message.payload);
        }
      } catch {
        console.error('WS parse error', event.data);
      }
    };

    this.ws.onclose = () => {
      this.onStatus(false);
      this.stopPing();
      this.scheduleReconnect();
    };

    this.ws.onerror = () => {
      this.ws?.close();
    };
  }

  private startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 25000);
  }

  private stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private scheduleReconnect() {
    if (this.destroyed) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) return;

    const delay = Math.min(1000 * 2 ** this.reconnectAttempts, 30000);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }

  destroy() {
    this.destroyed = true;
    this.stopPing();
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    this.ws?.close();
    this.ws = null;
  }
}
