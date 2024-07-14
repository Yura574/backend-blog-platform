import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IpRestriction, IpRestrictionDocument } from './domain/ipRestriction.entity';
import { Model } from 'mongoose';
import { AddIpRestrictionType, GetIpRestriction } from './types/addIpRestrictionType';


@Injectable()
export class IpRestrictionRepository {
  constructor(@InjectModel(IpRestriction.name) private ipRestrictionModel = Model<IpRestrictionDocument>) {
  }


  async addIpRestriction(dto: AddIpRestrictionType) {
    const restriction = await this.ipRestrictionModel.create(dto);
    await restriction.save();
  }

  async getIpRestriction(dto: GetIpRestriction){
    return this.ipRestrictionModel.find({ ip: dto.ip, url: dto.url });
  }
}