const logger = {
  info: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    if (Object.keys(data).length > 0) {
      console.log(`[${timestamp}] INFO: ${message} - ${JSON.stringify(data)}`);
    } else {
      console.log(`[${timestamp}] INFO: ${message}`);
    }
  },

  error: (message, error = null, data = {}) => {
    const timestamp = new Date().toISOString();
    let logMessage = `[${timestamp}] ERROR: ${message}`;

    if (error) {
      logMessage += ` - ${error.message}`;
    }

    if (Object.keys(data).length > 0) {
      logMessage += ` - ${JSON.stringify(data)}`;
    }

    console.error(logMessage);
  },

  warn: (message, data = {}) => {
    const timestamp = new Date().toISOString();
    if (Object.keys(data).length > 0) {
      console.warn(`[${timestamp}] WARN: ${message} - ${JSON.stringify(data)}`);
    } else {
      console.warn(`[${timestamp}] WARN: ${message}`);
    }
  },

  debug: (message, data = {}) => {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.DEBUG === "true"
    ) {
      const timestamp = new Date().toISOString();
      if (Object.keys(data).length > 0) {
        console.log(
          `[${timestamp}] DEBUG: ${message} - ${JSON.stringify(data)}`
        );
      } else {
        console.log(`[${timestamp}] DEBUG: ${message}`);
      }
    }
  },

  // HTTP request logging
  logRequest: (args) => {
    const method = args.__ow_method || "UNKNOWN";
    const path = args.__ow_path || "/";
    const userAgent = args.__ow_headers?.["user-agent"] || "Unknown";
    const ip =
      args.__ow_headers?.["x-forwarded-for"] ||
      args.__ow_headers?.["x-real-ip"] ||
      "Unknown";

    logger.info(
      `HTTP ${method} ${path} - IP: ${ip} - User-Agent: ${userAgent}`
    );
  },

  // HTTP response logging
  logResponse: (requestArgs, response, duration) => {
    const method = requestArgs.__ow_method || "UNKNOWN";
    const path = requestArgs.__ow_path || "/";
    const statusCode = response.statusCode || 500;

    if (statusCode >= 400) {
      logger.warn(
        `HTTP ${method} ${path} - Status: ${statusCode} - Duration: ${duration}ms`
      );
    } else {
      logger.info(
        `HTTP ${method} ${path} - Status: ${statusCode} - Duration: ${duration}ms`
      );
    }
  },
};

module.exports = logger;
