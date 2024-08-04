// types.ts

export interface WebsocketConfig {
    maxPayloadLength?: number; // default: 16 * 1024 * 1024 = 16 MB
    idleTimeout?: number; // default: 120 (seconds)
    backpressureLimit?: number; // default: 1024 * 1024 = 1 MB
    closeOnBackpressureLimit?: boolean; // default: false
    sendPings?: boolean; // default: true
    publishToSelf?: boolean; // default: false

    perMessageDeflate?:
      | boolean
      | {
          compress?: boolean;
          decompress?: boolean;
        };
}
