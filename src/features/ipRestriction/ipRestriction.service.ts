import { Injectable } from '@nestjs/common';
import { IpRestrictionRepository } from './ipRestriction.repository';
import { AddIpRestrictionType, GetIpRestriction } from './types/addIpRestrictionType';


@Injectable()
export class IpRestrictionService {
  constructor(private ipRestrictionRepository: IpRestrictionRepository) {
  }

  async addIpRestriction(dto: AddIpRestrictionType){
    return await this.ipRestrictionRepository.addIpRestriction(dto)
  }

  async getIpRestriction(dto: GetIpRestriction){
return await this.ipRestrictionRepository.getIpRestriction(dto)
  }
}