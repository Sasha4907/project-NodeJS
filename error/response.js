const { errorType } = require('../config/errorType');

const checkErrorCode = (errType) => {
  if (errType === errorType.NOT_FOUND) return 404;
  if (errType === errorType.SERVER) return 500;
  if (errType === errorType.SUCCESS) return 201;
  if (errType === errorType.AUTHORIZATION) return 401;
  if (errType === errorType.ACCESS) return 403;
  if (
    errType === errorType.CREATING
    || errorType.UPDATING
    || errorType.DELETING
    || errorType.VALIDATING
  ) { return 400; }
};

exports.checkErrorCode = checkErrorCode;
