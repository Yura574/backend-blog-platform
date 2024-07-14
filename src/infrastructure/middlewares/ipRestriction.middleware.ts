import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { IpRestrictionService } from '../../features/ipRestriction/ipRestriction.service';
import { AddIpRestrictionType } from '../../features/ipRestriction/types/addIpRestrictionType';


@Injectable()
export class IpRestrictionMiddleware implements NestMiddleware {
  // constructor(private ipRestrictionService: IpRestrictionService) {
  // }

  async use(req: Request, res: Response, next: NextFunction) {

    const dto: AddIpRestrictionType = {
      ip: req.ip!,
      url: req.url,
      data: new Date().toISOString()

    };
    // await this.ipRestrictionService.addIpRestriction(dto);
    //
    // const restrictions = await this.ipRestrictionService.getIpRestriction({ ip: dto.ip, url: dto.url });
    next();
  }
}

