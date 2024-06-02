import { ObjectResult, ResultStatus } from './objectResult';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

export const handleErrorObjectResult = (
  result: ObjectResult<any | null>,
  res: Response,
) => {
  if (result.status === ResultStatus.BadRequest)
    return res.status(HttpStatus.BAD_REQUEST).send(result.errorsMessages);
  if (result.status === ResultStatus.Unauthorized)
    return res.status(HttpStatus.UNAUTHORIZED).send(result.errorsMessages);
  if (result.status === ResultStatus.Forbidden)
    return res.status(HttpStatus.FORBIDDEN).send(result.errorsMessages);
  if (result.status === ResultStatus.NotFound)
    return res.status(HttpStatus.NOT_FOUND).send(result.errorsMessages);
  return res

    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .send(result.errorsMessages);
};
