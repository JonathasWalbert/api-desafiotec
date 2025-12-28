import { RegisterUserDTO } from "../../dto/Authentication/register.dto";
import { User } from "../../models/User";

export class UserRepository {
    static async findByEmail(email: string) {
        return User.findOne({ email });
    }

    static async create(data: RegisterUserDTO){
        return User.create(data);
    }
}