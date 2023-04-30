import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.APP_PORT || process.env.PORT, 10) || 3000,
  websocket_url: process.env.WEBSOCKET_URL,
  default_oms_id: process.env.DEFAULT_OMS_ID || 1,
  ticker_history_interval: process.env.TICKER_HISTORY_INTERVAL || 86400,
}));
