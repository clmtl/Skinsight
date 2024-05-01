import { SetMetadata } from '@nestjs/common';

export const IS_LOCKED_KEY = 'isLocked';
export const Locked = () => SetMetadata(IS_LOCKED_KEY, true);