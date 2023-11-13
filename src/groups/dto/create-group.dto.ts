import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateGroupDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    image?: string;
}
