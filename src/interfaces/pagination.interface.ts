import { PaginationDto } from '../queries/page-options';

export interface PageMetaDtoParameters {
  pageOptionsDto: PaginationDto;
  itemCount: number;
}
