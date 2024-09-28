export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  }
  
  export interface Membership {
    type: string;
    status: string;
    startDate: Date;
    endDate: Date;
    renewalDate?: Date;
  }
  
  export interface EmergencyContact {
    name: string;
    phone: string;
    relation: string;
  }
  
  export interface Progress {
    fitnessGoals: string;
    milestones?: string[];
  }
  
  export interface Loyalty {
    points: number;
    rewards?: string[];
  }
  
  export interface Member {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    address: Address;
    membership: Membership;
    emergencyContact: EmergencyContact;
    progress?: Progress;
    loyalty?: Loyalty;
  }
  