/**
 * Controller kiểm tra trạng thái hoạt động của service.
 */
function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'portfolio-media-service',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };

