import { InternalServerErrorException } from "@nestjs/common";

export function parseBoolean(value: string) {
    value = value.toLowerCase();
    switch (value) {
        case "true":
            return true;
        case "false":
            return false
        default:
            throw new InternalServerErrorException("Не удалось преобразовать в логическое значение")
    }
}