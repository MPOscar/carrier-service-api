
export interface IUser {

    readonly id: string;
    
    readonly email?: string;
    
    readonly firstName?: string;
    
    readonly language?: string;    
    
    readonly lastLogin?: Date;    
    
    readonly lastName?: string;    
    
    readonly password?: string;
    
    readonly phone?: string;  
    
    readonly verificationCode?: string;
    
    readonly region?: string;    
    
    readonly comuna?: string;
    
    readonly address?: string;
    
    readonly zip?: string;
    
    readonly shopUrl?: string;
    
    readonly userApiChile?: string;
    
    readonly passwordApiChile?: string;
    
    readonly idApiChile?: string;

    readonly redirect?: string;

    readonly newUser?: boolean;

    readonly hmac?: boolean;

    readonly rut?: boolean;

    readonly recharge: number;

    readonly labelFormat: string;

    readonly createdAt?: Date;

    readonly updatedAt?: Date;
}