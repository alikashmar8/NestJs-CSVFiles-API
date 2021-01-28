import { UserDto } from "src/Dtos/userDto";
import { User } from "src/users/user.entity";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> {

  async storeNew(user) {
    return await this.save(user);
  }

  async updateUser(id: string, data: UserDto){
    const u = await this.save({
        id: id,
        password: data.password,
        email: data.email,
        name: data.name
    })
    return u;
  }

  async findById(id: string){
    return await this.findOne({ where: { id } });
  }

  async findByEmail(email: string){
    const user: User = await this.findOne({ email: email })
    return user;
  }

}