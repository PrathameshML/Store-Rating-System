/**
 * responseHelper - consistent API responses
 */
function success(res, data = {}, message = 'OK', code = 200) {
  return res.status(code).json({ success: true, message, data });
}

function error(res, message = 'Error', code = 400, details = undefined) {
  return res.status(code).json({ success: false, message, details });
}

module.exports = { success, error };
