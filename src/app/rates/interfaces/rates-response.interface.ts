export interface IRatesResponse {
    readonly base: string;
    readonly serviceCode: string;
    readonly concept: string;
    readonly totalConcept: string;
    readonly tax: string;
    readonly observations: string;
    readonly portes: string;
    readonly total: string;    
    readonly createdAt: Date;
    readonly updatedAt: Date;
}