import { Users } from "src/database/entities/users.entity";
import { UserRole } from "./enum";


export const checkRole = (currentRole: UserRole, allowedRole: UserRole) => {
  let tempRole:UserRole;

  switch(allowedRole){
    case UserRole.SUPER_ADMIN:
      tempRole = UserRole.ADMIN;
      break;
    case UserRole.ADMIN:
      tempRole = UserRole.USER;
      break;
    default:
      break;
  }

  if(tempRole != currentRole) throw new Error("You dont have permission to perform this action");
  return true;
}