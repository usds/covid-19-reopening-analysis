interface StateResponse {
  ID: string;
  State: string;
  Reported: string;
  Confirmed: number;
  Dead: number;
  NewConfirmed: number; // not used
  NewDead: number; // not used
}

interface CountyResponse {
  ID: string;
  County: string;
  State: string;
  Reported: string;
  Confirmed: number;
  Dead: number;
  StateFIPS: string; // not used
  CountyFIPS: string; // not used
  NewDead: number; //not used
  NewConfirmed: number; // not used
}
