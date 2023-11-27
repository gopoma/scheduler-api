import { IsEmail, IsOptional, IsString, IsUUID } from "class-validator";

export class SearchUserDto {
    @IsOptional()
    name: string;

    @IsOptional()
    email: string;
}
