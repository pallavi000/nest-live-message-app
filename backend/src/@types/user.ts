import { userDto } from 'src/user/dto/user.dto';
import { User } from 'src/user/entity/user.entity';

export interface ISocketUser extends User {
  socketId: string;
}
