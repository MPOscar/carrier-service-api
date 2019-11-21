export class CreateWithdrawalDto {
    contact: String;
    contactPhone: string;
    date: Date;
    horaDesde: Date;
    horaHasta: Date;
    rut?: string;
    address?: string;
    comuna?: string;
    region?: string;
    zip?: string;
}
