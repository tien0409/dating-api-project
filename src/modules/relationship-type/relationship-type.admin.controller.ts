import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import {
  CREATE_ROUTE,
  RELATIONSHIP_TYPES_ADMIN_ROUTE,
} from '../../configs/routes';
import { RelationshipTypeService } from './relationship-type.service';
import { CreateRelationshipTypeDTO } from './dtos/create-relationship-type.dto';
import { GetRelationshipTypesDTO } from './dtos/get-relationship-types.dto';
import { UpdateRelationshipTypeDTO } from './dtos/update-relationship-type.dto';

@Controller(RELATIONSHIP_TYPES_ADMIN_ROUTE)
export class RelationshipTypeAdminController {
  constructor(
    private readonly relationshipTypeService: RelationshipTypeService,
  ) {}

  @Get()
  getAll(@Query() getRelationshipTypesDTO: GetRelationshipTypesDTO) {
    return this.relationshipTypeService.getAdminAll(getRelationshipTypesDTO);
  }

  @Post(CREATE_ROUTE)
  create(@Body() createRelationshipTypeDTO: CreateRelationshipTypeDTO) {
    return this.relationshipTypeService.create(createRelationshipTypeDTO);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateRelationshipTypeDTO: UpdateRelationshipTypeDTO,
  ) {
    return this.relationshipTypeService.update(id, updateRelationshipTypeDTO);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.relationshipTypeService.delete(id);
  }
}
