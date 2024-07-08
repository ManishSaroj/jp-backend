// sseMiddleware.js
const sseMiddleware = (req, res, next) => {
    res.sseSetup = function() {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      });
    };
  
    res.sseSend = function(data) {
      if (!res.headersSent) {
        res.sseSetup();
      }
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };
  
    // Handle client disconnect
    req.on('close', () => {
      if (res.sseClose) res.sseClose();
    });
  
    next();
  };
  
  module.exports = sseMiddleware;