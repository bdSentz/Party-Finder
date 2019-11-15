export interface Party {
    address: string;
    invitees: any[];
    description: string;
    startTime: Date;
    endTime: Date;
    openParty: boolean;
    createdBy: string;
}
