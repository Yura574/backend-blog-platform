import { All, Controller, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';


@Controller()
export class FallbackController {
  @All('*')
  handleFallback(@Req() req: Request, @Res() res: Response) {
    res.status(404).json({
      statusCode: 404,
      message: 'Route not found',
      path: req.originalUrl,
    });
  }
}