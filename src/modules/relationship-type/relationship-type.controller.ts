import { Controller } from '@nestjs/common';

import { RELATIONSHIP_TYPES_ROUTE } from '../../configs/routes';
import { RelationshipTypeService } from './relationship-type.service';

@Controller(RELATIONSHIP_TYPES_ROUTE)
export class RelationshipTypeController {
  constructor(
    private readonly relationshipTypeService: RelationshipTypeService,
  ) {}
}
