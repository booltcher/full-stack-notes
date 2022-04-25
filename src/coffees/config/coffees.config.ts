import { registerAs } from '@nestjs/config';

export default registerAs('coffee', () => ({
  foo: 'bar',
}));
